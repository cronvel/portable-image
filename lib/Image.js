/*
	Portable Image

	Copyright (c) 2024 Cédric Ronvel

	The MIT License (MIT)

	Permission is hereby granted, free of charge, to any person obtaining a copy
	of this software and associated documentation files (the "Software"), to deal
	in the Software without restriction, including without limitation the rights
	to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
	copies of the Software, and to permit persons to whom the Software is
	furnished to do so, subject to the following conditions:

	The above copyright notice and this permission notice shall be included in all
	copies or substantial portions of the Software.

	THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
	IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
	FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
	AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
	LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
	OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
	SOFTWARE.
*/

"use strict" ;



/*
	Params:
		width: image width in pixel
		height: image height in pixel
		channelDef: pass an already existing channel definition
		channels: the channels, default to [ 'red' , 'green' , 'blue' , 'alpha' ] or ChannelDef.RGBA
		indexed: (boolean) it uses a palette, up to 256 entries, each pixel is a 1-Byte index
		palette: (array of array of integers) force indexed a pass an array of array of channel value
		pixelBuffer: (Buffer or Uint8Array) the buffer containing all the pixel data
*/
function Image( params = {} ) {
	this.width = params.width ;
	this.height = params.height ;
	this.channelDef = params.channelDef ?? new ChannelDef( params ) ;
	this.pixelBuffer = null ;

	if ( params.pixelBuffer ) {
		if ( params.pixelBuffer instanceof Buffer ) {
			if ( params.pixelBuffer.length !== this.width * this.height * this.channelDef.bytesPerPixel ) {
				throw new Error( "Provided pixel Buffer mismatch the expected size (should be exactly width * height * bytesPerPixel)" ) ;
			}

			this.pixelBuffer = params.pixelBuffer ;
		}
		else if ( params.pixelBuffer instanceof Uint8Array ) {
			if ( params.pixelBuffer.length !== this.width * this.height * this.channelDef.bytesPerPixel ) {
				throw new Error( "Provided pixel Uint8Array buffer mismatch the expected size (should be exactly width * height * bytesPerPixel)" ) ;
			}

			this.pixelBuffer = Buffer.from( params.pixelBuffer ) ;
		}
		else {
			throw new Error( "Provided pixel buffer is not a Buffer or a Uint8Array" ) ;
		}
	}
	else {
		this.pixelBuffer = Buffer.allocUnsafe( this.width * this.height * this.channelDef.bytesPerPixel ) ;
	}
}

module.exports = Image ;



const ChannelDef = Image.ChannelDef = Image.prototype.ChannelDef = require( './ChannelDef.js' ) ;

Image.compositing = require( './compositing.js' ) ;

Image.prototype.setPalette = function( palette ) { this.channelDef.setPalette( palette ) ; } ;
Image.prototype.setPaletteEntry = function( index , entry ) { this.channelDef.setPaletteEntry( index , entry ) ; } ;
Image.prototype.setPaletteColor = function( index , color ) { this.channelDef.setPaletteColor( index , color ) ; } ;
Image.prototype.hasSamePalette = function( image ) { return this.channelDef.hasSamePalette( image.channelDef ) ; } ;

// Create the mapping to another Image
Image.prototype.getAutoMappingTo = function( toImage , defaultChannelValues = ChannelDef.DEFAULT_CHANNEL_VALUES ) {
	return this.channelDef.getAutoMappingToChannels( toImage.channelDef.channels , defaultChannelValues ) ;
} ;



/*
	Copy to another Image instance.
*/
Image.prototype.copyTo = function( image , params = {} ) {
	var mapping = params.mapping ,
		scaleX = params.scaleX ?? params.scale ?? 1 ,
		scaleY = params.scaleY ?? params.scale ?? 1 ;

	if ( ! mapping ) {
		mapping = this.getAutoMappingTo( image ) ;
	}

	let src = {
		buffer: this.pixelBuffer ,
		width: this.width ,
		height: this.height ,
		bytesPerPixel: this.channelDef.bytesPerPixel ,
		x: params.x < 0 ? - params.x / scaleX : 0 ,
		y: params.y < 0 ? - params.y / scaleY : 0 ,
		endX: this.width ,
		endY: this.height ,
		channels: this.channelDef.channels.length ,
		scaleX ,
		scaleY ,
		mapping ,
		compositing: params.compositing || null
	} ;

	let dst = {
		buffer: image.pixelBuffer ,
		width: image.width ,
		height: image.height ,
		bytesPerPixel: image.channelDef.bytesPerPixel ,
		x: params.x > 0 ? params.x : 0 ,
		y: params.y > 0 ? params.y : 0 ,
		endX: image.width ,
		endY: image.height ,
		channels: image.channelDef.channels.length
	} ;
	//console.log( "### Mapping: " , dst.mapping ) ;

	if ( src.compositing ) {
		if ( this.channelDef.indexed ) {
			if ( image.channelDef.indexed ) {
				if ( ! this.hasSamePalette( image ) ) {
					throw new Error( "Uncompatible palettes are not supported yet" ) ;
				}

				src.palette = this.channelDef.palette ;

				if ( src.compositing.id === 'binaryOver' && this.channelDef.channelIndex.alpha !== undefined ) {
					src.alphaChannel = this.channelDef.channelIndex.alpha ;
					Image.fullIndexedBlitWithTransparency( src , dst ) ;
				}
				else {
					throw new Error( "Copy indexed to indexed with compositing is not supported yet, except for 'binaryOver' mode" ) ;
				}
			}
			else {
				src.palette = this.channelDef.palette ;
				Image.compositingBlitFromIndexed( src , dst ) ;
			}
		}
		else {
			if ( image.channelDef.indexed ) { throw new Error( "Copy to indexed portable image is not supported yet" ) ; }
			Image.compositingBlit( src , dst ) ;
		}
	}
	else {
		if ( this.channelDef.indexed ) {
			if ( image.channelDef.indexed ) {
				if ( ! this.hasSamePalette( image ) ) {
					throw new Error( "Uncompatible palettes are not supported yet" ) ;
				}

				src.mapping = ChannelDef.Mapping.INDEXED_TO_INDEXED ;
				Image.blit( src , dst ) ;
			}
			else {
				src.palette = this.channelDef.palette ;
				Image.blitFromIndexed( src , dst ) ;
			}
		}
		else {
			if ( image.channelDef.indexed ) { throw new Error( "Copy to indexed portable image is not supported yet" ) ; }
			Image.blit( src , dst ) ;
		}
	}
} ;



Image.prototype.createImageData = function( params = {} ) {
	var scaleX = params.scaleX ?? params.scale ?? 1 ,
		scaleY = params.scaleY ?? params.scale ?? 1 ;

	var imageData = new ImageData( this.width * scaleX , this.height * scaleY ) ;
	this.updateImageData( imageData , params ) ;
	return imageData ;
} ;



Image.prototype.updateImageData = function( imageData , params = {} ) {
	var mapping = params.mapping ,
		scaleX = params.scaleX ?? params.scale ?? 1 ,
		scaleY = params.scaleY ?? params.scale ?? 1 ;

	if ( ! mapping ) {
		if ( imageData.width === this.width && imageData.height === this.height ) {
			if ( this.channelDef.indexed ) {
				if ( this.channelDef.isRgbaCompatible ) { return this.isoIndexedRgbaCompatibleToRgbaBlit( imageData.data ) ; }
				if ( this.channelDef.isRgbCompatible ) { return this.isoIndexedRgbCompatibleToRgbaBlit( imageData.data ) ; }
			}
			else {
				if ( this.channelDef.isRgbaCompatible ) { return this.isoRgbaCompatibleToRgbaBlit( imageData.data ) ; }
				if ( this.channelDef.isRgbCompatible ) { return this.isoRgbCompatibleToRgbaBlit( imageData.data ) ; }
			}
		}

		if ( this.channelDef.isRgbaCompatible ) { mapping = ChannelDef.Mapping.RGBA_COMPATIBLE_TO_RGBA ; }
		else if ( this.channelDef.isRgbCompatible ) { mapping = ChannelDef.Mapping.RGB_COMPATIBLE_TO_RGBA ; }
		else if ( this.channelDef.isGrayAlphaCompatible ) { mapping = ChannelDef.Mapping.GRAY_ALPHA_COMPATIBLE_TO_RGBA ; }
		else if ( this.channelDef.isGrayCompatible ) { mapping = ChannelDef.Mapping.GRAY_COMPATIBLE_TO_RGBA ; }
		else { throw new Error( "Mapping required for image that are not RGB/RGBA/Grayscale/Grayscale+Alpha compatible" ) ; }
	}

	//console.warn( "Mapping:" , mapping ) ;

	let src = {
		buffer: this.pixelBuffer ,
		width: this.width ,
		height: this.height ,
		bytesPerPixel: this.channelDef.bytesPerPixel ,
		x: params.x < 0 ? - params.x / scaleX : 0 ,
		y: params.y < 0 ? - params.y / scaleY : 0 ,
		endX: this.width ,
		endY: this.height ,
		channels: this.channelDef.channels.length ,
		scaleX ,
		scaleY ,
		mapping ,
		compositing: params.compositing || null
	} ;

	let dst = {
		buffer: imageData.data ,
		width: imageData.width ,
		height: imageData.height ,
		bytesPerPixel: 4 ,
		x: params.x > 0 ? params.x : 0 ,
		y: params.y > 0 ? params.y : 0 ,
		endX: imageData.width ,
		endY: imageData.height ,
		channels: 4
	} ;

	if ( src.compositing ) {
		if ( this.channelDef.indexed ) {
			src.palette = this.channelDef.palette ;
			Image.compositingBlitFromIndexed( src , dst ) ;
		}
		else {
			Image.compositingBlit( src , dst ) ;
		}
	}
	else {
		if ( this.channelDef.indexed ) {
			src.palette = this.channelDef.palette ;
			Image.blitFromIndexed( src , dst ) ;
		}
		else {
			Image.blit( src , dst ) ;
		}
	}
} ;



/*
	Perform a regular blit, copying a rectangle are a the src to a rectangulare are of the dst.

	src, dst:
		* buffer: array-like
		* width,height: geometry stored in the array-like
		* bytesPerPixel
		* x,y: coordinate where to start copying (included)
		* endX,endY: coordinate where to stop copying (excluded)
	src only:
		* scaleX,scaleY: drawing scale (nearest)
		* mapping: an instance of Mapping, that maps the channels from src to dst
*/
Image.blit = function( src , dst ) {
	//console.warn( ".blit() used" , src , dst ) ;
	var blitWidth = Math.min( dst.endX - dst.x , ( src.endX - src.x ) * src.scaleX ) ,
		blitHeight = Math.min( dst.endY - dst.y , ( src.endY - src.y ) * src.scaleY ) ;

	for ( let yOffset = 0 ; yOffset < blitHeight ; yOffset ++ ) {
		for ( let xOffset = 0 ; xOffset < blitWidth ; xOffset ++ ) {
			let iDst = ( ( dst.y + yOffset ) * dst.width + ( dst.x + xOffset ) ) * dst.bytesPerPixel ;
			let iSrc = ( Math.floor( src.y + yOffset / src.scaleY ) * src.width + Math.floor( src.x + xOffset / src.scaleX ) ) * src.bytesPerPixel ;
			src.mapping.map( src , dst , iSrc , iDst ) ;
		}
	}
} ;



/*
	Perform a blit, but the source pixel is an index, that will be substituted by the relevant source palette.

	Same arguments than .blit(), plus:

	src only:
		* palette: an array of array of values
*/
Image.blitFromIndexed = function( src , dst ) {
	console.warn( ".blitFromIndexed() used" , src , dst ) ;
	var blitWidth = Math.min( dst.endX - dst.x , ( src.endX - src.x ) * src.scaleX ) ,
		blitHeight = Math.min( dst.endY - dst.y , ( src.endY - src.y ) * src.scaleY ) ;

	for ( let yOffset = 0 ; yOffset < blitHeight ; yOffset ++ ) {
		for ( let xOffset = 0 ; xOffset < blitWidth ; xOffset ++ ) {
			let iDst = ( ( dst.y + yOffset ) * dst.width + ( dst.x + xOffset ) ) * dst.bytesPerPixel ;
			let iSrc = ( Math.floor( src.y + yOffset / src.scaleY ) * src.width + Math.floor( src.x + xOffset / src.scaleX ) ) * src.bytesPerPixel ;
			let channelValues = src.palette[ src.buffer[ iSrc ] ] ;
			src.mapping.map( src , dst , 0 , iDst , channelValues ) ;
		}
	}
} ;



/*
	Perform a blit, but with compositing (alpha-blending, etc).

	src only:
		* compositing: a compositing object, having a method "alpha" and "channel"
*/
Image.compositingBlit = function( src , dst ) {
	//console.warn( ".compositingBlit() used" , src , dst ) ;
	var blitWidth = Math.min( dst.endX - dst.x , ( src.endX - src.x ) * src.scaleX ) ,
		blitHeight = Math.min( dst.endY - dst.y , ( src.endY - src.y ) * src.scaleY ) ;

	for ( let yOffset = 0 ; yOffset < blitHeight ; yOffset ++ ) {
		for ( let xOffset = 0 ; xOffset < blitWidth ; xOffset ++ ) {
			let iDst = ( ( dst.y + yOffset ) * dst.width + ( dst.x + xOffset ) ) * dst.bytesPerPixel ;
			let iSrc = ( Math.floor( src.y + yOffset / src.scaleY ) * src.width + Math.floor( src.x + xOffset / src.scaleX ) ) * src.bytesPerPixel ;
			src.mapping.compose( src , dst , iSrc , iDst , src.compositing ) ;
		}
	}
} ;



/*
	Perform a blit, but with compositing (alpha-blending, etc) + the source pixel is an index,
	that will be substituted by the relevant source palette.

	Same arguments than .blit(), plus:

	src only:
		* palette: an array of array of values
		* compositing: a compositing object, having a method "alpha" and "channel"
*/
Image.compositingBlitFromIndexed = function( src , dst ) {
	//console.warn( ".compositingBlitFromIndexed() used" , src , dst ) ;
	var blitWidth = Math.min( dst.endX - dst.x , ( src.endX - src.x ) * src.scaleX ) ,
		blitHeight = Math.min( dst.endY - dst.y , ( src.endY - src.y ) * src.scaleY ) ;

	for ( let yOffset = 0 ; yOffset < blitHeight ; yOffset ++ ) {
		for ( let xOffset = 0 ; xOffset < blitWidth ; xOffset ++ ) {
			let iDst = ( ( dst.y + yOffset ) * dst.width + ( dst.x + xOffset ) ) * dst.bytesPerPixel ;
			let iSrc = ( Math.floor( src.y + yOffset / src.scaleY ) * src.width + Math.floor( src.x + xOffset / src.scaleX ) ) * src.bytesPerPixel ;
			let channelValues = src.palette[ src.buffer[ iSrc ] ] ;
			src.mapping.compose( src , dst , 0 , iDst , src.compositing , channelValues ) ;
		}
	}
} ;



/*
	Perform a blit, copying palette indexes, ignoring index-color association, except for source transparency.
	The transparency is binary, it is either fully transparent (alpha=0) or fully opaque (alpha>0).

	Same arguments than .blit(), plus:

	src only:
		* palette: an array of array of values
		* alphaChannel: the index of the alpha channel (3 for RGBA, 1 for grayscale+alpha)
*/
Image.fullIndexedBlitWithTransparency = function( src , dst ) {
	console.warn( ".fullIndexedBlitWithTransparency() used" , src , dst ) ;
	var blitWidth = Math.min( dst.endX - dst.x , ( src.endX - src.x ) * src.scaleX ) ,
		blitHeight = Math.min( dst.endY - dst.y , ( src.endY - src.y ) * src.scaleY ) ;

	for ( let yOffset = 0 ; yOffset < blitHeight ; yOffset ++ ) {
		for ( let xOffset = 0 ; xOffset < blitWidth ; xOffset ++ ) {
			let iDst = ( ( dst.y + yOffset ) * dst.width + ( dst.x + xOffset ) ) * dst.bytesPerPixel ;
			let iSrc = ( Math.floor( src.y + yOffset / src.scaleY ) * src.width + Math.floor( src.x + xOffset / src.scaleX ) ) * src.bytesPerPixel ;

			// If alpha > 0 ...
			if ( src.palette[ src.buffer[ iSrc ] ][ src.alphaChannel ] ) {
				dst.buffer[ iDst ] = src.buffer[ iSrc ] ;
			}
		}
	}
} ;



// Optimized Blit for RGB-compatible to RGBA
Image.prototype.isoRgbCompatibleToRgbaBlit = function( dst ) {
	//console.warn( ".isoRgbCompatibleToRgbaBlit() used" , dst ) ;
	for ( let i = 0 , imax = this.width * this.height ; i < imax ; i ++ ) {
		let iSrc = i * this.channelDef.bytesPerPixel ;
		let iDst = i * 4 ;

		dst[ iDst ] = this.pixelBuffer[ iSrc ] ;			// Red
		dst[ iDst + 1 ] = this.pixelBuffer[ iSrc + 1 ] ;	// Green
		dst[ iDst + 2 ] = this.pixelBuffer[ iSrc + 2 ] ;	// Blue
		dst[ iDst + 3 ] = 255 ;	// Alpha
	}
} ;



// Optimized Blit for RGBA-compatible to RGBA
Image.prototype.isoRgbaCompatibleToRgbaBlit = function( dst ) {
	//console.warn( ".isoRgbaCompatibleToRgbaBlit() used" , dst , this ) ;
	for ( let i = 0 , imax = this.width * this.height ; i < imax ; i ++ ) {
		let iSrc = i * this.channelDef.bytesPerPixel ;
		let iDst = i * 4 ;

		dst[ iDst ] = this.pixelBuffer[ iSrc ] ;			// Red
		dst[ iDst + 1 ] = this.pixelBuffer[ iSrc + 1 ] ;	// Green
		dst[ iDst + 2 ] = this.pixelBuffer[ iSrc + 2 ] ;	// Blue
		dst[ iDst + 3 ] = this.pixelBuffer[ iSrc + 3 ] ;	// Alpha
	}
} ;



// Optimized Blit for Indexed RGB-compatible to RGBA
Image.prototype.isoIndexedRgbCompatibleToRgbaBlit = function( dst ) {
	//console.warn( ".isoIndexedRgbCompatibleToRgbaBlit() used" , dst ) ;
	for ( let i = 0 , imax = this.width * this.height ; i < imax ; i ++ ) {
		let iSrc = i * this.channelDef.bytesPerPixel ;
		let iDst = i * 4 ;
		let paletteEntry = this.channelDef.palette[ this.pixelBuffer[ iSrc ] ] ;

		dst[ iDst ] = paletteEntry[ 0 ] ;		// Red
		dst[ iDst + 1 ] = paletteEntry[ 1 ] ;	// Green
		dst[ iDst + 2 ] = paletteEntry[ 2 ] ;	// Blue
		dst[ iDst + 3 ] = 255 ;	// Alpha
	}
} ;



// Optimized Blit for Indexed RGBA-compatible to RGBA
Image.prototype.isoIndexedRgbaCompatibleToRgbaBlit = function( dst ) {
	//console.warn( ".isoIndexedRgbaCompatibleToRgbaBlit() used" , dst ) ;
	for ( let i = 0 , imax = this.width * this.height ; i < imax ; i ++ ) {
		let iSrc = i * this.channelDef.bytesPerPixel ;
		let iDst = i * 4 ;
		let paletteEntry = this.channelDef.palette[ this.pixelBuffer[ iSrc ] ] ;

		dst[ iDst ] = paletteEntry[ 0 ] ;		// Red
		dst[ iDst + 1 ] = paletteEntry[ 1 ] ;	// Green
		dst[ iDst + 2 ] = paletteEntry[ 2 ] ;	// Blue
		dst[ iDst + 3 ] = paletteEntry[ 3 ] ;	// Alpha
	}
} ;



Image.prototype.updateFromImageData = function( imageData , mapping ) {
	throw new Error( "Not coded!" ) ;

	// /!\ TODO /!\
	/*

	if ( ! mapping ) {
		if ( this.channelDef.isRgbaCompatible ) { mapping = ChannelDef.Mapping.RGBA_COMPATIBLE_TO_RGBA ; }
		else if ( this.channelDef.isRgbCompatible ) { mapping = ChannelDef.Mapping.RGB_COMPATIBLE_TO_RGBA ; }
		else { throw new Error( "ChannelDef.Mapping required for image that are not RGB/RGBA compatible" ) ; }
	}

	if ( imageData.width !== this.width || imageData.height !== this.height ) {
		throw new Error( ".updateFromImageData(): width and/or height mismatch" ) ;
	}

	for ( let i = 0 , imax = this.width * this.height ; i < imax ; i ++ ) {
		let iDst = i * this.channelDef.bytesPerPixel ;
		let iSrc = i * 4 ;

		if ( this.channelDef.indexed ) {
			let channelValues = [] ;
			channelValues[ iDst + mapping[ 0 ] ] = imageData[ iSrc ] ;
			channelValues[ iDst + mapping[ 1 ] ] = imageData[ iSrc + 1 ] ;
			channelValues[ iDst + mapping[ 2 ] ] = imageData[ iSrc + 2 ] ;
			channelValues[ iDst + mapping[ 3 ] ] = imageData[ iSrc + 3 ] ;

			this.pixelBuffer[ iDst ] = this.getClosestPaletteIndex( channelValues ) ;
		}

		this.pixelBuffer[ iDst + mapping[ 0 ] ] = imageData[ iSrc ] ;
		this.pixelBuffer[ iDst + mapping[ 1 ] ] = imageData[ iSrc + 1 ] ;
		this.pixelBuffer[ iDst + mapping[ 2 ] ] = imageData[ iSrc + 2 ] ;
		this.pixelBuffer[ iDst + mapping[ 3 ] ] = imageData[ iSrc + 3 ] ;
	}
	*/
} ;

