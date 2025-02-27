(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.PortableImage = f()}})(function(){var define,module,exports;return (function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
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



function Animation() {
	this.name = '' ;
	this.loop = false ;
	this.startFrame = 0 ;
	this.endFrame = 0 ;
	//this.frameIndexes = [] ;
}

module.exports = Animation ;


},{}],2:[function(require,module,exports){
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
	Autoplay an animation.
*/

function Animator( sprite , params = {} ) {
	this.sprite = sprite ;
	this.startFrame = + params.startFrame || 0 ;
	this.endFrame = params.endFrame ?? sprite.frames.length ;
	this.useCache = !! params.useCache ;

	this.scaleX = params.scaleX ?? params.scale ?? 1 ;
	this.scaleY = params.scaleY ?? params.scale ?? 1 ;
	this.blitParams = { scaleX: this.scaleX , scaleY: this.scaleY } ;

	this.x = + params.x || 0 ;
	this.y = + params.y || 0 ;

	this.imageData = this.sprite.prepareImageData( this.blitParams ) ;
	this.ctx = params.ctx ;

	this.running = false ;
	this.frameIndex = 0 ;
}

module.exports = Animator ;



Animator.prototype.start = function() {
	if ( this.running ) { return ; }
	this.running = true ;

	this.runLoop() ;
} ;



Animator.prototype.stop = function() {
	this.running = false ;
} ;



Animator.prototype.runLoop = function() {
	if ( ! this.running ) { return ; }

	//console.log( "******* about to render frame #" + this.frameIndex ) ;
	var imageData ,
		frame = this.sprite.frames[ this.frameIndex ] ;

	if ( this.useCache ) {
		if ( ! frame.imageDataCache ) { frame.updateImageData( null , this.blitParams ) ; }
		imageData = frame.imageDataCache ;
	}
	else {
		if ( this.imageData ) {
			frame.updateImageData( this.imageData , this.blitParams ) ;
		}
		else {
			this.imageData = frame.createImageData( this.blitParams ) ;
		}

		imageData = this.imageData ;
	}

	this.ctx.putImageData( imageData , this.x , this.y ) ;

	this.frameIndex ++ ;
	if ( this.frameIndex >= this.endFrame ) { this.frameIndex = this.startFrame ; }

	setTimeout( () => this.runLoop() , frame.duration ) ;
} ;


},{}],3:[function(require,module,exports){
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
	A Sprite is a sort-of 2-dimensional array of images, with frames as the top-header and layers as the left-header.
	A Cell is an element of this 2-dimensional array.
*/

function Cell( params = {} ) {
	this.imageIndex = + params.imageIndex || 0 ;	// The index of the image stored in Sprite.images
	this.x = + params.x || 0 ;
	this.y = + params.y || 0 ;
}

module.exports = Cell ;


},{}],4:[function(require,module,exports){
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
		channels: the channels, default to [ 'red' , 'green' , 'blue' , 'alpha' ] or PortableImage.RGBA
		indexed: (boolean) it uses a palette, up to 256 entries, each pixel is a 1-Byte index
		palette: (array of array of integers) force indexed a pass an array of array of channel value
*/
function ChannelDef( params = {} ) {
	this.channels = Array.isArray( params.channels ) ? params.channels : ChannelDef.RGBA ;
	this.indexed = !! params.indexed || Array.isArray( params.palette ) ;
	this.bytesPerPixel = this.indexed ? 1 : this.channels.length ;
	this.palette = this.indexed ? [] : null ;

	if ( Array.isArray( params.palette ) ) {
		this.setPalette( params.palette ) ;
	}

	this.channelIndex = {} ;
	for ( let i = 0 ; i < this.channels.length ; i ++ ) {
		this.channelIndex[ this.channels[ i ] ] = i ;
	}

	this.isRgbCompatible = this.channels.length >= 3 && this.channels[ 0 ] === 'red' && this.channels[ 1 ] === 'green' && this.channels[ 2 ] === 'blue' ;
	this.isRgbaCompatible = this.channels.length >= 4 && this.isRgbCompatible && this.channels[ 3 ] === 'alpha' ;
	this.isRgb = this.isRgbCompatible && this.channels.length === 3 ;
	this.isRgba = this.isRgbaCompatible && this.channels.length === 4 ;

	this.isGrayCompatible = this.channels.length >= 1 && this.channels[ 0 ] === 'gray' ;
	this.isGrayAlphaCompatible = this.channels.length >= 2 && this.isGrayCompatible && this.channels[ 1 ] === 'alpha' ;
	this.isGray = this.isGrayCompatible && this.channels.length === 1 ;
	this.isGrayAlpha = this.isGrayAlphaCompatible && this.channels.length === 2 ;
}

module.exports = ChannelDef ;



const Mapping = ChannelDef.Mapping = require( './Mapping.js' ) ;
ChannelDef.Mapping = Mapping ;
ChannelDef.DirectChannelMapping = Mapping.DirectChannelMapping ;
ChannelDef.DirectChannelMappingWithDefault = Mapping.DirectChannelMappingWithDefault ;
ChannelDef.MatrixChannelMapping = Mapping.MatrixChannelMapping ;

ChannelDef.compositing = require( './compositing.js' ) ;



ChannelDef.RGB = [ 'red' , 'green' , 'blue' ] ;
ChannelDef.RGBA = [ 'red' , 'green' , 'blue' , 'alpha' ] ;
ChannelDef.GRAY = [ 'gray' ] ;
ChannelDef.GRAY_ALPHA = [ 'gray' , 'alpha' ] ;



ChannelDef.prototype.clone = function() {
	return new ChannelDef( {
		channels: [ ... this.channels ] ,
		indexed: this.indexed ,
		palette: this.palette
	} ) ;
} ;



ChannelDef.prototype.setPalette = function( palette ) {
	if ( ! this.indexed ) { throw new Error( "This is not an indexed image" ) ; }

	this.palette.length = 0 ;

	for ( let index = 0 ; index < palette.length ; index ++ ) {
		this.setPaletteEntry( index , palette[ index ] ) ;
	}
} ;



ChannelDef.prototype.setPaletteEntry = function( index , entry ) {
	if ( this.isRgb || this.isRgba ) { return this.setPaletteColor( index , entry ) ; }

	if ( ! this.indexed ) { throw new Error( "This is not an indexed image" ) ; }
	if ( ! entry ) { return ; }

	var currentEntry = this.palette[ index ] ;
	if ( ! currentEntry ) { currentEntry = this.palette[ index ] = [] ; }

	if ( Array.isArray( entry ) ) {
		for ( let i = 0 ; i < this.channels.length ; i ++ ) {
			currentEntry[ i ] = entry[ i ] ?? 0 ;
		}
	}
	else if ( typeof entry === 'object' ) {
		for ( let i = 0 ; i < this.channels.length ; i ++ ) {
			currentEntry[ i ] = entry[ this.channels[ i ] ] ?? 0 ;
		}
	}
} ;



const LESSER_BYTE_MASK = 0xff ;

ChannelDef.prototype.setPaletteColor = function( index , color ) {
	if ( ! this.indexed ) { throw new Error( "This is not an indexed image" ) ; }
	if ( ! color ) { return ; }

	var currentColor = this.palette[ index ] ;
	if ( ! currentColor ) { currentColor = this.palette[ index ] = [] ; }

	if ( Array.isArray( color ) ) {
		currentColor[ 0 ] = color[ 0 ] ?? 0 ;
		currentColor[ 1 ] = color[ 1 ] ?? 0 ;
		currentColor[ 2 ] = color[ 2 ] ?? 0 ;
		if ( this.isRgba ) { currentColor[ 3 ] = color[ 3 ] ?? 255 ; }
	}
	else if ( typeof color === 'object' ) {
		currentColor[ 0 ] = color.R ?? color.r ?? 0 ;
		currentColor[ 1 ] = color.G ?? color.g ?? 0 ;
		currentColor[ 2 ] = color.B ?? color.b ?? 0 ;
		if ( this.isRgba ) { currentColor[ 3 ] = color.A ?? color.a ?? 255 ; }
	}
	else if ( typeof color === 'string' && color[ 0 ] === '#' ) {
		color = color.slice( 1 ) ;
		if ( color.length === 3 ) {
			color = color[ 0 ] + color[ 0 ] + color[ 1 ] + color[ 1 ] + color[ 2 ] + color[ 2 ] ;
		}

		let code = Number.parseInt( color , 16 ) ;

		if ( color.length === 6 ) {
			currentColor[ 0 ] = ( code >> 16 ) & LESSER_BYTE_MASK ;
			currentColor[ 1 ] = ( code >> 8 ) & LESSER_BYTE_MASK ;
			currentColor[ 2 ] = code & LESSER_BYTE_MASK ;
			if ( this.isRgba ) { currentColor[ 3 ] = 255 ; }
		}
		else if ( color.length === 8 ) {
			currentColor[ 0 ] = ( code >> 24 ) & LESSER_BYTE_MASK ;
			currentColor[ 1 ] = ( code >> 16 ) & LESSER_BYTE_MASK ;
			currentColor[ 2 ] = ( code >> 8 ) & LESSER_BYTE_MASK ;
			if ( this.isRgba ) { currentColor[ 3 ] = code & LESSER_BYTE_MASK ; }
		}
	}
} ;



ChannelDef.prototype.hasSamePalette = function( channelDef ) {
	if ( ! this.palette || ! channelDef.palette ) { return false ; }
	if ( this.palette.length !== channelDef.palette.length ) { return false ; }

	for ( let index = 0 ; index < this.palette.length ; index ++ ) {
		let values = this.palette[ index ] ;

		for ( let c = 0 ; c < values.length ; c ++ ) {
			if ( values[ c ] !== channelDef.palette[ index ][ c ] ) { return false ; }
		}
	}

	return true ;
} ;



ChannelDef.DEFAULT_CHANNEL_VALUES = {
	red: 0 ,
	green: 0 ,
	blue: 0 ,
	alpha: 255
} ;

ChannelDef.prototype.getAutoMappingToChannels = function( toChannels , defaultChannelValues = ChannelDef.DEFAULT_CHANNEL_VALUES ) {
	var matrix = new Array( toChannels.length * 2 ) ;

	for ( let index = 0 ; index < toChannels.length ; index ++ ) {
		let channel = toChannels[ index ] ;

		if ( Object.hasOwn( this.channelIndex , channel ) ) {
			matrix[ index * 2 ] = this.channelIndex[ channel ] ;
			matrix[ index * 2 + 1 ] = null ;
		}
		else {
			matrix[ index * 2 ] = null ;
			matrix[ index * 2 + 1 ] = defaultChannelValues[ channel ] ?? 0 ;
		}
	}

	return new ChannelDef.DirectChannelMappingWithDefault( matrix ) ;
} ;

ChannelDef.getAutoMapping = function( fromChannels , toChannels , defaultChannelValues = ChannelDef.DEFAULT_CHANNEL_VALUES ) {
	var matrix = new Array( toChannels.length * 2 ) ;

	for ( let index = 0 ; index < toChannels.length ; index ++ ) {
		let channel = toChannels[ index ] ;
		let indexOf = fromChannels.indexOf( channel ) ;

		if ( indexOf >= 0 ) {
			matrix[ index * 2 ] = indexOf ;
			matrix[ index * 2 + 1 ] = null ;
		}
		else {
			matrix[ index * 2 ] = null ;
			matrix[ index * 2 + 1 ] = defaultChannelValues[ channel ] ?? 0 ;
		}
	}

	return new ChannelDef.DirectChannelMappingWithDefault( matrix ) ;
} ;



// Simple color matcher
ChannelDef.prototype.getClosestPaletteIndex = ( channelValues ) => {
	var cMax = Math.min( this.channels.length , channelValues.length ) ,
		minDist = Infinity ,
		minIndex = 0 ;

	for ( let index = 0 ; index < this.palette.length ; index ++ ) {
		let dist = 0 ;

		for ( let c = 0 ; c < cMax ; c ++ ) {
			let delta = this.palette[ index ][ c ] - channelValues[ c ] ;
			dist += delta * delta ;

			if ( dist < minDist ) {
				minDist = dist ;
				minIndex = index ;
			}
		}
	}

	return minIndex ;
} ;


},{"./Mapping.js":8,"./compositing.js":10}],5:[function(require,module,exports){
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



function Frame( params = {} , sprite = null ) {
	Object.defineProperty( this , 'sprite' , { configurable: true , value: sprite } ) ;
	this.duration = params.duration ;	// in ms
	this.cells = [] ;	// Cells are ordered so that indexes are the than Sprite.layers indexes
	this.imageDataCache = null ;
}

module.exports = Frame ;

const Sprite = require( './Sprite.js' ) ;
const Layer = require( './Layer.js' ) ;
const Cell = require( './Cell.js' ) ;
const Image = require( './Image.js' ) ;



Frame.prototype.setParent = function( sprite ) {
	Object.defineProperty( this , 'sprite' , { value: sprite } ) ;
} ;



Frame.prototype.clearCache = function() {
	this.imageDataCache = null ;
} ;



Frame.prototype.addCell = function( cell ) {
	this.cells.push( cell ) ;
	return this.cells.length - 1 ;
} ;



Frame.prototype.toImage = function( ImageClass = Image , internal = false ) {
	var image = new Image( {
		width: this.sprite.width ,
		height: this.sprite.height ,
		channelDef: internal ? this.sprite.channelDef : this.sprite.channelDef.clone()
	} ) ;

	for ( let cell of this.cells ) {
		let cellImage = this.sprite.images[ cell.imageIndex ] ;

		cellImage.copyTo( image , {
			compositing: Image.compositing.binaryOver ,
			x: cell.x ,
			y: cell.y
		} ) ;
		console.log( "Copy from/to:" , image , cellImage , " --- cell: " , cell ) ;
	}

	return image ;
} ;



// Internal
Frame.prototype.flatten = function() {
	var image = this.toImage( Image , true ) ;
	var imageIndex = this.sprite.addImage( image ) ;
	this.cells[ 0 ] = new Cell( { imageIndex } ) ;
	this.cells.length = 1 ;
	return image ;
} ;



// Just for consistency...
Frame.prototype.prepareImageData = function( params = {} ) { return this.sprite.prepareImageData( params ) ; } ;



Frame.prototype.createImageData = function( params = {} ) {
	var imageData = this.sprite.prepareImageData( params ) ;
	this.updateImageData( imageData , params , true ) ;
	return imageData ;
} ;



Frame.prototype.updateImageData = function( imageData , params , noClear = false ) {
	params = params ? Object.assign( {} , params ) : {} ;

	if ( ! imageData ) {
		if ( this.imageDataCache ) {
			imageData = this.imageDataCache ;
			if ( ! noClear ) { imageData.data.fill( 0 ) ; }
		}
		else {
			imageData = this.imageDataCache = this.sprite.prepareImageData( params ) ;
		}
	}
	else if ( ! noClear ) {
		imageData.data.fill( 0 ) ;
	}

	for ( let cell of this.cells ) {
		let cellImage = this.sprite.images[ cell.imageIndex ] ;

		// .innerX/Y are like .x/y except that it is multiplied by scaling,
		// it's important to use that for Cells instead of .x/y, or the Cells' positions would be wrong
		params.innerX = cell.x ;
		params.innerY = cell.y ;

		params.compositing = Image.compositing.binaryOver ;
		cellImage.updateImageData( imageData , params , true ) ;
	}
} ;


},{"./Cell.js":3,"./Image.js":6,"./Layer.js":7,"./Sprite.js":9}],6:[function(require,module,exports){
(function (Buffer){(function (){
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
		//x: params.x < 0 ? - params.x / scaleX : 0 ,
		x: Math.max( 0 , - ( ( + params.x || 0 ) / scaleX + ( + params.innerX || 0 ) ) ) ,
		//y: params.y < 0 ? - params.y / scaleY : 0 ,
		y: Math.max( 0 , - ( ( + params.y || 0 ) / scaleY + ( + params.innerY || 0 ) ) ) ,
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
		//x: params.x > 0 ? params.x : 0 ,
		x: Math.max( 0 , ( + params.x || 0 ) + ( + params.innerX || 0 ) * scaleX ) ,
		//y: params.y > 0 ? params.y : 0 ,
		y: Math.max( 0 , ( + params.y || 0 ) + ( + params.innerY || 0 ) * scaleY ) ,
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



// Prepare, but do not copy any pixels
Image.prototype.prepareImageData = function( params = {} ) {
	var scaleX = params.scaleX ?? params.scale ?? 1 ,
		scaleY = params.scaleY ?? params.scale ?? 1 ;

	return new ImageData( this.width * scaleX , this.height * scaleY ) ;
} ;



// Create an ImageData and copy pixels to it
Image.prototype.createImageData = function( params = {} ) {
	var imageData = this.prepareImageData( params ) ;
	this.updateImageData( imageData , params , true ) ;
	return imageData ;
} ;



// Copy pixels to an existing ImageData
Image.prototype.updateImageData = function( imageData , params = {} , noClear = false ) {
	var mapping = params.mapping ,
		scaleX = params.scaleX ?? params.scale ?? 1 ,
		scaleY = params.scaleY ?? params.scale ?? 1 ;

	if ( ! noClear ) { imageData.data.fill( 0 ) ; }

	//console.log( "Image.prototype.updateImageData() params:" , params ) ;

	if ( ! mapping ) {
		if ( imageData.width === this.width && imageData.height === this.height && ! params.x && ! params.y && scaleX === 1 && scaleY === 1 ) {
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
		//x: params.x < 0 ? - params.x / scaleX : 0 ,
		x: Math.max( 0 , - ( ( + params.x || 0 ) / scaleX + ( + params.innerX || 0 ) ) ) ,
		//y: params.y < 0 ? - params.y / scaleY : 0 ,
		y: Math.max( 0 , - ( ( + params.y || 0 ) / scaleY + ( + params.innerY || 0 ) ) ) ,
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
		//x: params.x > 0 ? params.x : 0 ,
		x: Math.max( 0 , ( + params.x || 0 ) + ( + params.innerX || 0 ) * scaleX ) ,
		//y: params.y > 0 ? params.y : 0 ,
		y: Math.max( 0 , ( + params.y || 0 ) + ( + params.innerY || 0 ) * scaleY ) ,
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
	//console.warn( ".blitFromIndexed() used" , src , dst ) ;
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
	//console.warn( ".fullIndexedBlitWithTransparency() used" , src , dst ) ;
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


}).call(this)}).call(this,require("buffer").Buffer)
},{"./ChannelDef.js":4,"./compositing.js":10,"buffer":13}],7:[function(require,module,exports){
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



function Layer( name , params = {} ) {
	this.name = name || '' ;
	this.visible = params.visible ?? true ;
	this.compositing = params.compositing ?? null ;	// Compositing mode
	this.opacity = params.opacity ?? 1 ;
	this.order = params.order ?? 0 ;	// The order of the layer, rendered from lower to greater
}

module.exports = Layer ;


},{}],8:[function(require,module,exports){
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



// Base class
function Mapping( matrix , alphaChannelDst ) {
	this.matrix = matrix ;
	this.alphaChannelDst = alphaChannelDst ?? null ;
	this.composeChannelOrder = null ;

	if ( this.alphaChannelDst === null ) {
		this.compose = this.map ;
	}
	else {
		this.composeChannelOrder = [ this.alphaChannelDst ] ;
		for ( let i = 0 ; i < this.dstChannels ; i ++ ) {
			if ( i !== this.alphaChannelDst ) { this.composeChannelOrder.push( i ) ; }
		}
	}
}

Mapping.prototype.map = function() {} ;
Mapping.prototype.compose = function() {} ;
module.exports = Mapping ;



function clampUint8( value ) { return Math.max( 0 , Math.min( 255 , Math.round( value ) ) ) ; }
function normalizedToUint8( value ) { return Math.max( 0 , Math.min( 255 , Math.round( 255 * value ) ) ) ; }
function uint8ToNormalized( value ) { return Math.max( 0 , Math.min( 1 , value / 255 ) ) ; }

const NO_COMPOSITING = {
	alpha: ( alphaSrc /*, alphaDst */ ) => alphaSrc ,
	channel: ( alphaSrc , alphaDst , channelSrc /*, channelDst */ ) => channelSrc
} ;



/*
	Direct mapping of dst to src, each dst channel is copied from a src channel.
	Each entry is a src channel index.
*/
function DirectChannelMapping( matrix , alphaChannelDst ) {
	this.dstChannels = matrix.length ;
	Mapping.call( this , matrix , alphaChannelDst ) ;
}

DirectChannelMapping.prototype = Object.create( Mapping.prototype ) ;
DirectChannelMapping.prototype.constructor = DirectChannelMapping ;
Mapping.DirectChannelMapping = DirectChannelMapping ;

DirectChannelMapping.prototype.map = function( src , dst , iSrc , iDst , srcBuffer = src.buffer ) {
	for ( let cDst = 0 ; cDst < dst.channels ; cDst ++ ) {
		dst.buffer[ iDst + cDst ] = srcBuffer[ iSrc + this.matrix[ cDst ] ] ;
	}
} ;

DirectChannelMapping.prototype.compose = function( src , dst , iSrc , iDst , compositing = NO_COMPOSITING , srcBuffer = src.buffer ) {
	let alphaDst = dst.buffer[ iDst + this.alphaChannelDst ] / 255 ;
	let alphaSrc = 1 ;

	for ( let cDst of this.composeChannelOrder ) {
		if ( cDst === this.alphaChannelDst ) {
			alphaSrc = srcBuffer[ iSrc + this.matrix[ cDst ] ] / 255 ;
			dst.buffer[ iDst + cDst ] = normalizedToUint8( compositing.alpha( alphaSrc , alphaDst ) ) ;
		}
		else {
			dst.buffer[ iDst + cDst ] = normalizedToUint8( compositing.channel(
				alphaSrc ,
				alphaDst ,
				srcBuffer[ iSrc + this.matrix[ cDst ] ] / 255 ,
				dst.buffer[ iDst + cDst ] / 255
			) ) ;
		}
	}
} ;



/*
	Direct mapping of dst to src, each dst channel is copied from a src channel OR have a default value.
	There are 2 entries per dst channel, the first one is a src channel index, the second one is a default value.
	The default value is used unless its value is null.
*/
function DirectChannelMappingWithDefault( matrix , alphaChannelDst ) {
	this.dstChannels = Math.floor( matrix.length / 2 ) ;
	Mapping.call( this , matrix , alphaChannelDst ) ;
}

DirectChannelMappingWithDefault.prototype = Object.create( Mapping.prototype ) ;
DirectChannelMappingWithDefault.prototype.constructor = DirectChannelMappingWithDefault ;
Mapping.DirectChannelMappingWithDefault = DirectChannelMappingWithDefault ;

DirectChannelMappingWithDefault.prototype.map = function( src , dst , iSrc , iDst , srcBuffer = src.buffer ) {
	for ( let cDst = 0 ; cDst < dst.channels ; cDst ++ ) {
		dst.buffer[ iDst + cDst ] = this.matrix[ cDst * 2 + 1 ] ?? srcBuffer[ iSrc + this.matrix[ cDst * 2 ] ] ;
	}
} ;

DirectChannelMappingWithDefault.prototype.compose = function( src , dst , iSrc , iDst , compositing = NO_COMPOSITING , srcBuffer = src.buffer ) {
	let alphaDst = dst.buffer[ iDst + this.alphaChannelDst ] / 255 ;
	let alphaSrc = 1 ;

	for ( let cDst of this.composeChannelOrder ) {
		if ( cDst === this.alphaChannelDst ) {
			alphaSrc = ( this.matrix[ cDst * 2 + 1 ] ?? srcBuffer[ iSrc + this.matrix[ cDst * 2 ] ] ) / 255 ;
			dst.buffer[ iDst + cDst ] = normalizedToUint8( compositing.alpha( alphaSrc , alphaDst ) ) ;
		}
		else {
			dst.buffer[ iDst + cDst ] = normalizedToUint8( compositing.channel(
				alphaSrc ,
				alphaDst ,
				( this.matrix[ cDst * 2 + 1 ] ?? srcBuffer[ iSrc + this.matrix[ cDst * 2 ] ] ) / 255 ,
				dst.buffer[ iDst + cDst ] / 255
			) ) ;
		}
	}
} ;



/*
	Matrix mapping of the dst to src, each dst channel is composed by all src channels + one additional value.
	There are ( srcChannelsUsed + 1 ) entries per dst channel, the last one is the additionnal value.
*/
function MatrixChannelMapping( matrix , srcChannelsUsed , alphaChannelDst ) {
	this.dstChannels = Math.floor( matrix.length / ( srcChannelsUsed + 1 ) ) ;
	this.srcChannelsUsed = srcChannelsUsed ;
	Mapping.call( this , matrix , alphaChannelDst ) ;
}

MatrixChannelMapping.prototype = Object.create( Mapping.prototype ) ;
MatrixChannelMapping.prototype.constructor = MatrixChannelMapping ;
Mapping.MatrixChannelMapping = MatrixChannelMapping ;

MatrixChannelMapping.prototype.map = function( src , dst , iSrc , iDst , srcBuffer = src.buffer ) {
	let matrixIndex = 0 ;

	for ( let cDst = 0 ; cDst < dst.channels ; cDst ++ ) {
		let value = 0 ;

		for ( let cSrc = 0 ; cSrc < this.srcChannelsUsed ; cSrc ++ ) {
			value += srcBuffer[ iSrc + cSrc ] * this.matrix[ matrixIndex ++ ] ;
		}

		value += this.matrix[ matrixIndex ++ ] ;	// This is the additionnal value

		dst.buffer[ iDst + cDst ] = clampUint8( value ) ;
	}
} ;

MatrixChannelMapping.prototype.compose = function( src , dst , iSrc , iDst , compositing = NO_COMPOSITING , srcBuffer = src.buffer ) {
	let alphaDst = dst.buffer[ iDst + this.alphaChannelDst ] / 255 ;
	let alphaSrc = 1 ;

	for ( let cDst of this.composeChannelOrder ) {
		let matrixIndex = cDst * ( this.srcChannelsUsed + 1 ) ;
		let value = 0 ;

		for ( let cSrc = 0 ; cSrc < this.srcChannelsUsed ; cSrc ++ ) {
			value += srcBuffer[ iSrc + cSrc ] * this.matrix[ matrixIndex ++ ] ;
		}

		value += this.matrix[ matrixIndex ++ ] ;	// This is the additionnal value
		value = uint8ToNormalized( value ) ;

		if ( cDst === this.alphaChannelDst ) {
			// Always executed at the first loop iteration
			dst.buffer[ iDst + cDst ] = normalizedToUint8( compositing.alpha( value , alphaDst ) ) ;
		}
		else {
			dst.buffer[ iDst + cDst ] = normalizedToUint8( compositing.channel(
				alphaSrc ,
				alphaDst ,
				value ,
				dst.buffer[ iDst + cDst ] / 255
			) ) ;
		}
	}
} ;



/*
	Built-in channel mapping.
	Should come after prototype definition, because of *.prototype = Object.create(...)
*/

Mapping.INDEXED_TO_INDEXED = new DirectChannelMapping( [ 0 ] ) ;

Mapping.RGBA_COMPATIBLE_TO_RGBA = new DirectChannelMapping( [ 0 , 1 , 2 , 3 ] , 3 ) ;

Mapping.RGB_COMPATIBLE_TO_RGBA = new DirectChannelMappingWithDefault(
	[
		0 , null ,
		1 , null ,
		2 , null ,
		null , 255
	] ,
	3
) ;

Mapping.GRAY_ALPHA_COMPATIBLE_TO_RGBA = new DirectChannelMapping( [ 0 , 0 , 0 , 1 ] , 3 ) ;

Mapping.GRAY_COMPATIBLE_TO_RGBA = new DirectChannelMappingWithDefault(
	[
		0 , null ,
		0 , null ,
		0 , null ,
		null , 255
	] ,
	3
) ;

Mapping.RGBA_COMPATIBLE_TO_GRAY_ALPHA = new MatrixChannelMapping(
	[
		1 / 3 , 1 / 3 , 1 / 3 , 0 , 0 ,
		0 , 0 , 0 , 1 , 0
	] ,
	4 ,
	1
) ;

Mapping.RGB_COMPATIBLE_TO_GRAY_ALPHA = new MatrixChannelMapping(
	[
		1 / 3 , 1 / 3 , 1 / 3 , 0 ,
		0 , 0 , 0 , 255
	] ,
	3 ,
	1
) ;


},{}],9:[function(require,module,exports){
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
	A “Sprite” is a multi-layered image, with multiple frames and animation referencing those frames.
*/



function Sprite( params = {} ) {
	// Clipping size
	this.width = params.width ;
	this.height = params.height ;
	this.channelDef = params.channelDef ?? new ChannelDef( params ) ;

	this.images = [] ;	// Image instances
	this.layers = [] ;	// Layer instances
	this.frames = [] ;	// Frame instances
	this.animations = [] ;	// Animations instances

	this.orderedLayers = [] ;	// Store layer indexes
	this.animationByName = new Map() ;	// Animation name to animation index
}

module.exports = Sprite ;



const ChannelDef = Sprite.ChannelDef = Sprite.prototype.ChannelDef = require( './ChannelDef.js' ) ;

const Image = Sprite.Image = Sprite.prototype.Image = require( './Image.js' ) ;
const Frame = Sprite.Frame = Sprite.prototype.Frame = require( './Frame.js' ) ;
const Layer = Sprite.Layer = Sprite.prototype.Layer = require( './Layer.js' ) ;
const Cell = Sprite.Cell = Sprite.prototype.Cell = require( './Cell.js' ) ;
const Animation = Sprite.Animation = Sprite.prototype.Animation = require( './Animation.js' ) ;
const Animator = Sprite.Animator = Sprite.prototype.Animator = require( './Animator.js' ) ;



Sprite.prototype.addImage = function( image ) {
	this.images.push( image ) ;
	return this.images.length - 1 ;
} ;



Sprite.prototype.addFrame = function( frame ) {
	frame.setParent( this ) ;
	this.frames.push( frame ) ;
	return this.frames.length - 1 ;
} ;



Sprite.prototype.addLayer = function( layer ) {
	this.layers.push( layer ) ;

	// For instance, we force a layer order
	var index = this.layers.length - 1 ;
	layer.order = index ;
	this.orderedLayers.push( index ) ;
	return index ;
} ;



Sprite.prototype.toImage = function( ImageClass ) {
	// Only the first frame
	return this.frames[ 0 ].toImage( ImageClass ) ;
} ;



Sprite.prototype.flatten = function() {
	for ( let frame of this.frames ) { frame.flatten() ; }
	this.cleanImageIndexes() ;
} ;



// Removed unused images and re-index
Sprite.prototype.cleanImageIndexes = function() {

	// First, mark which image is used or unused

	var isUsed = new Array( this.images.length ).fill( false ) ;

	for ( let frame of this.frames ) {
		for ( let cell of frame.cells ) {
			isUsed[ cell.imageIndex ] = true ;
		}
	}

	// Now remove and re-index images, and map the index changes

	var newIndex = 0 ,
		indexMap = new Array( this.images.length ) ;
	
	for ( let currentIndex = 0 ; currentIndex < isUsed.length ; currentIndex ++ ) {
		if ( isUsed[ currentIndex ] ) {
			if ( currentIndex !== newIndex ) {
				this.images[ newIndex ] = this.images[ currentIndex ] ;
			}

			indexMap[ currentIndex ] = newIndex ;
			newIndex ++ ;
		}
	}

	this.images.length = newIndex ;

	// Finally, update the new indexes everywhere
	
	for ( let frame of this.frames ) {
		for ( let cell of frame.cells ) {
			cell.imageIndex = indexMap[ cell.imageIndex ] ;
		}
	}
} ;



// Prepare, but do not copy any pixels
Sprite.prototype.prepareImageData = function( params = {} ) {
	var scaleX = params.scaleX ?? params.scale ?? 1 ,
		scaleY = params.scaleY ?? params.scale ?? 1 ;

	return new ImageData( this.width * scaleX , this.height * scaleY ) ;
} ;



Sprite.prototype.createAnimator = function( params = {} ) {
	return new Animator( this , params ) ;
} ;



Sprite.prototype.clearCache = function() {
	for ( let frame of this.frames ) { frame.clearCache() ; }
} ;


},{"./Animation.js":1,"./Animator.js":2,"./Cell.js":3,"./ChannelDef.js":4,"./Frame.js":5,"./Image.js":6,"./Layer.js":7}],10:[function(require,module,exports){
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



const compositing = {} ;
module.exports = compositing ;



// The normal alpha-blending mode, a “top” layer replacing a “bottom” one.
compositing.normal = compositing.over = {
	id: 'over' ,
	alpha: ( alphaSrc , alphaDst ) => alphaSrc + alphaDst * ( 1 - alphaSrc ) ,
	channel: ( alphaSrc , alphaDst , channelSrc , channelDst ) =>
		( channelSrc * alphaSrc + channelDst * alphaDst * ( 1 - alphaSrc ) ) / ( alphaSrc + alphaDst * ( 1 - alphaSrc ) ) || 0
} ;

// Like normal/over, but alpha is considered fully transparent (=0) or fully opaque (≥1).
compositing.binaryOver = {
	id: 'binaryOver' ,
	alpha: ( alphaSrc , alphaDst ) => alphaSrc ? 1 : alphaDst ,
	channel: ( alphaSrc , alphaDst , channelSrc , channelDst ) => alphaSrc ? channelSrc : channelDst
} ;

// This intersect the src and the dst for alpha, while using the same method than “over” for the channel.
// The result is opaque only where both are opaque.
compositing.in = {
	id: 'in' ,
	alpha: ( alphaSrc , alphaDst ) => alphaSrc * alphaDst ,
	channel: compositing.normal.channel
} ;

// Src is only copied where dst is transparent, it's like a “in” with dst alpha inverted.
compositing.out = {
	id: 'out' ,
	alpha: ( alphaSrc , alphaDst ) => alphaSrc * ( 1 - alphaDst ) ,
	channel: ( alphaSrc , alphaDst , channelSrc , channelDst ) =>
		( channelSrc * alphaSrc + channelDst * ( 1 - alphaDst ) * ( 1 - alphaSrc ) ) / ( alphaSrc + ( 1 - alphaDst ) * ( 1 - alphaSrc ) ) || 0
} ;

// Src is only copied where both src and dst are opaque, opaque dst area are left untouched where src is transparent.
// It uses the same method than “over” for the channel.
compositing.atop = {
	id: 'atop' ,
	alpha: ( alphaSrc , alphaDst ) => compositing.normal.alpha( alphaSrc , alphaDst ) * alphaDst ,
	channel: compositing.normal.channel
} ;

// This use an analogic xor for alpha, while using the same method than “over” for the channel.
// The result is opaque only where only one is opaque.
compositing.xor = {
	id: 'xor' ,
	alpha: ( alphaSrc , alphaDst ) => alphaSrc * ( 1 - alphaDst ) + alphaDst * ( 1 - alphaSrc ) ,
	channel: compositing.normal.channel
} ;



// Advanced compositing methods.
// See: https://en.wikipedia.org/wiki/Alpha_compositing

// Multiply, always produce darker output
compositing.multiply = {
	id: 'multiply' ,
	alpha: compositing.normal.alpha ,
	channel: ( alphaSrc , alphaDst , channelSrc , channelDst ) => compositing.normal.channel(
		alphaSrc ,
		alphaDst ,
		channelSrc * ( 1 + ( channelDst - 1 ) * alphaDst ) ,
		channelDst
	)
} ;

// Inverse of multiply, always produce brighter output
compositing.screen = {
	id: 'screen' ,
	alpha: compositing.normal.alpha ,
	channel: ( alphaSrc , alphaDst , channelSrc , channelDst ) => compositing.normal.channel(
		alphaSrc ,
		alphaDst ,
		1 - ( 1 - channelSrc ) * ( 1 - channelDst * alphaDst ) ,
		channelDst
	)
} ;

// Overlay, either a screen or a multiply, with a factor 2.
compositing.overlay = {
	id: 'overlay' ,
	alpha: compositing.normal.alpha ,
	channel: ( alphaSrc , alphaDst , channelSrc , channelDst ) => compositing.normal.channel(
		alphaSrc ,
		alphaDst ,
		// Got trouble making it work with dst alpha channel, the original resources just check if dst < 0.5,
		// I made it three-way to solve issues when dst has low or transparency alpha, so that is color info
		// doesn't affect the blending color.
		1 + ( channelDst - 1 ) * alphaDst < 0.5   ?   2 * channelSrc * ( 1 + ( channelDst - 1 ) * alphaDst )       :
		channelDst * alphaDst > 0.5               ?   1 - 2 * ( 1 - channelSrc ) * ( 1 - channelDst * alphaDst )   :
		channelSrc ,
		channelDst
	)
} ;


},{}],11:[function(require,module,exports){
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



const lib = {} ;
module.exports = lib ;

lib.Image = require( './Image.js' ) ;
lib.Sprite = require( './Sprite.js' ) ;
lib.Mapping = require( './Mapping.js' ) ;
lib.compositing = require( './compositing.js' ) ;


},{"./Image.js":6,"./Mapping.js":8,"./Sprite.js":9,"./compositing.js":10}],12:[function(require,module,exports){
'use strict'

exports.byteLength = byteLength
exports.toByteArray = toByteArray
exports.fromByteArray = fromByteArray

var lookup = []
var revLookup = []
var Arr = typeof Uint8Array !== 'undefined' ? Uint8Array : Array

var code = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'
for (var i = 0, len = code.length; i < len; ++i) {
  lookup[i] = code[i]
  revLookup[code.charCodeAt(i)] = i
}

// Support decoding URL-safe base64 strings, as Node.js does.
// See: https://en.wikipedia.org/wiki/Base64#URL_applications
revLookup['-'.charCodeAt(0)] = 62
revLookup['_'.charCodeAt(0)] = 63

function getLens (b64) {
  var len = b64.length

  if (len % 4 > 0) {
    throw new Error('Invalid string. Length must be a multiple of 4')
  }

  // Trim off extra bytes after placeholder bytes are found
  // See: https://github.com/beatgammit/base64-js/issues/42
  var validLen = b64.indexOf('=')
  if (validLen === -1) validLen = len

  var placeHoldersLen = validLen === len
    ? 0
    : 4 - (validLen % 4)

  return [validLen, placeHoldersLen]
}

// base64 is 4/3 + up to two characters of the original data
function byteLength (b64) {
  var lens = getLens(b64)
  var validLen = lens[0]
  var placeHoldersLen = lens[1]
  return ((validLen + placeHoldersLen) * 3 / 4) - placeHoldersLen
}

function _byteLength (b64, validLen, placeHoldersLen) {
  return ((validLen + placeHoldersLen) * 3 / 4) - placeHoldersLen
}

function toByteArray (b64) {
  var tmp
  var lens = getLens(b64)
  var validLen = lens[0]
  var placeHoldersLen = lens[1]

  var arr = new Arr(_byteLength(b64, validLen, placeHoldersLen))

  var curByte = 0

  // if there are placeholders, only get up to the last complete 4 chars
  var len = placeHoldersLen > 0
    ? validLen - 4
    : validLen

  var i
  for (i = 0; i < len; i += 4) {
    tmp =
      (revLookup[b64.charCodeAt(i)] << 18) |
      (revLookup[b64.charCodeAt(i + 1)] << 12) |
      (revLookup[b64.charCodeAt(i + 2)] << 6) |
      revLookup[b64.charCodeAt(i + 3)]
    arr[curByte++] = (tmp >> 16) & 0xFF
    arr[curByte++] = (tmp >> 8) & 0xFF
    arr[curByte++] = tmp & 0xFF
  }

  if (placeHoldersLen === 2) {
    tmp =
      (revLookup[b64.charCodeAt(i)] << 2) |
      (revLookup[b64.charCodeAt(i + 1)] >> 4)
    arr[curByte++] = tmp & 0xFF
  }

  if (placeHoldersLen === 1) {
    tmp =
      (revLookup[b64.charCodeAt(i)] << 10) |
      (revLookup[b64.charCodeAt(i + 1)] << 4) |
      (revLookup[b64.charCodeAt(i + 2)] >> 2)
    arr[curByte++] = (tmp >> 8) & 0xFF
    arr[curByte++] = tmp & 0xFF
  }

  return arr
}

function tripletToBase64 (num) {
  return lookup[num >> 18 & 0x3F] +
    lookup[num >> 12 & 0x3F] +
    lookup[num >> 6 & 0x3F] +
    lookup[num & 0x3F]
}

function encodeChunk (uint8, start, end) {
  var tmp
  var output = []
  for (var i = start; i < end; i += 3) {
    tmp =
      ((uint8[i] << 16) & 0xFF0000) +
      ((uint8[i + 1] << 8) & 0xFF00) +
      (uint8[i + 2] & 0xFF)
    output.push(tripletToBase64(tmp))
  }
  return output.join('')
}

function fromByteArray (uint8) {
  var tmp
  var len = uint8.length
  var extraBytes = len % 3 // if we have 1 byte left, pad 2 bytes
  var parts = []
  var maxChunkLength = 16383 // must be multiple of 3

  // go through the array every three bytes, we'll deal with trailing stuff later
  for (var i = 0, len2 = len - extraBytes; i < len2; i += maxChunkLength) {
    parts.push(encodeChunk(uint8, i, (i + maxChunkLength) > len2 ? len2 : (i + maxChunkLength)))
  }

  // pad the end with zeros, but make sure to not forget the extra bytes
  if (extraBytes === 1) {
    tmp = uint8[len - 1]
    parts.push(
      lookup[tmp >> 2] +
      lookup[(tmp << 4) & 0x3F] +
      '=='
    )
  } else if (extraBytes === 2) {
    tmp = (uint8[len - 2] << 8) + uint8[len - 1]
    parts.push(
      lookup[tmp >> 10] +
      lookup[(tmp >> 4) & 0x3F] +
      lookup[(tmp << 2) & 0x3F] +
      '='
    )
  }

  return parts.join('')
}

},{}],13:[function(require,module,exports){
(function (Buffer){(function (){
/*!
 * The buffer module from node.js, for the browser.
 *
 * @author   Feross Aboukhadijeh <https://feross.org>
 * @license  MIT
 */
/* eslint-disable no-proto */

'use strict'

var base64 = require('base64-js')
var ieee754 = require('ieee754')

exports.Buffer = Buffer
exports.SlowBuffer = SlowBuffer
exports.INSPECT_MAX_BYTES = 50

var K_MAX_LENGTH = 0x7fffffff
exports.kMaxLength = K_MAX_LENGTH

/**
 * If `Buffer.TYPED_ARRAY_SUPPORT`:
 *   === true    Use Uint8Array implementation (fastest)
 *   === false   Print warning and recommend using `buffer` v4.x which has an Object
 *               implementation (most compatible, even IE6)
 *
 * Browsers that support typed arrays are IE 10+, Firefox 4+, Chrome 7+, Safari 5.1+,
 * Opera 11.6+, iOS 4.2+.
 *
 * We report that the browser does not support typed arrays if the are not subclassable
 * using __proto__. Firefox 4-29 lacks support for adding new properties to `Uint8Array`
 * (See: https://bugzilla.mozilla.org/show_bug.cgi?id=695438). IE 10 lacks support
 * for __proto__ and has a buggy typed array implementation.
 */
Buffer.TYPED_ARRAY_SUPPORT = typedArraySupport()

if (!Buffer.TYPED_ARRAY_SUPPORT && typeof console !== 'undefined' &&
    typeof console.error === 'function') {
  console.error(
    'This browser lacks typed array (Uint8Array) support which is required by ' +
    '`buffer` v5.x. Use `buffer` v4.x if you require old browser support.'
  )
}

function typedArraySupport () {
  // Can typed array instances can be augmented?
  try {
    var arr = new Uint8Array(1)
    arr.__proto__ = { __proto__: Uint8Array.prototype, foo: function () { return 42 } }
    return arr.foo() === 42
  } catch (e) {
    return false
  }
}

Object.defineProperty(Buffer.prototype, 'parent', {
  enumerable: true,
  get: function () {
    if (!Buffer.isBuffer(this)) return undefined
    return this.buffer
  }
})

Object.defineProperty(Buffer.prototype, 'offset', {
  enumerable: true,
  get: function () {
    if (!Buffer.isBuffer(this)) return undefined
    return this.byteOffset
  }
})

function createBuffer (length) {
  if (length > K_MAX_LENGTH) {
    throw new RangeError('The value "' + length + '" is invalid for option "size"')
  }
  // Return an augmented `Uint8Array` instance
  var buf = new Uint8Array(length)
  buf.__proto__ = Buffer.prototype
  return buf
}

/**
 * The Buffer constructor returns instances of `Uint8Array` that have their
 * prototype changed to `Buffer.prototype`. Furthermore, `Buffer` is a subclass of
 * `Uint8Array`, so the returned instances will have all the node `Buffer` methods
 * and the `Uint8Array` methods. Square bracket notation works as expected -- it
 * returns a single octet.
 *
 * The `Uint8Array` prototype remains unmodified.
 */

function Buffer (arg, encodingOrOffset, length) {
  // Common case.
  if (typeof arg === 'number') {
    if (typeof encodingOrOffset === 'string') {
      throw new TypeError(
        'The "string" argument must be of type string. Received type number'
      )
    }
    return allocUnsafe(arg)
  }
  return from(arg, encodingOrOffset, length)
}

// Fix subarray() in ES2016. See: https://github.com/feross/buffer/pull/97
if (typeof Symbol !== 'undefined' && Symbol.species != null &&
    Buffer[Symbol.species] === Buffer) {
  Object.defineProperty(Buffer, Symbol.species, {
    value: null,
    configurable: true,
    enumerable: false,
    writable: false
  })
}

Buffer.poolSize = 8192 // not used by this implementation

function from (value, encodingOrOffset, length) {
  if (typeof value === 'string') {
    return fromString(value, encodingOrOffset)
  }

  if (ArrayBuffer.isView(value)) {
    return fromArrayLike(value)
  }

  if (value == null) {
    throw TypeError(
      'The first argument must be one of type string, Buffer, ArrayBuffer, Array, ' +
      'or Array-like Object. Received type ' + (typeof value)
    )
  }

  if (isInstance(value, ArrayBuffer) ||
      (value && isInstance(value.buffer, ArrayBuffer))) {
    return fromArrayBuffer(value, encodingOrOffset, length)
  }

  if (typeof value === 'number') {
    throw new TypeError(
      'The "value" argument must not be of type number. Received type number'
    )
  }

  var valueOf = value.valueOf && value.valueOf()
  if (valueOf != null && valueOf !== value) {
    return Buffer.from(valueOf, encodingOrOffset, length)
  }

  var b = fromObject(value)
  if (b) return b

  if (typeof Symbol !== 'undefined' && Symbol.toPrimitive != null &&
      typeof value[Symbol.toPrimitive] === 'function') {
    return Buffer.from(
      value[Symbol.toPrimitive]('string'), encodingOrOffset, length
    )
  }

  throw new TypeError(
    'The first argument must be one of type string, Buffer, ArrayBuffer, Array, ' +
    'or Array-like Object. Received type ' + (typeof value)
  )
}

/**
 * Functionally equivalent to Buffer(arg, encoding) but throws a TypeError
 * if value is a number.
 * Buffer.from(str[, encoding])
 * Buffer.from(array)
 * Buffer.from(buffer)
 * Buffer.from(arrayBuffer[, byteOffset[, length]])
 **/
Buffer.from = function (value, encodingOrOffset, length) {
  return from(value, encodingOrOffset, length)
}

// Note: Change prototype *after* Buffer.from is defined to workaround Chrome bug:
// https://github.com/feross/buffer/pull/148
Buffer.prototype.__proto__ = Uint8Array.prototype
Buffer.__proto__ = Uint8Array

function assertSize (size) {
  if (typeof size !== 'number') {
    throw new TypeError('"size" argument must be of type number')
  } else if (size < 0) {
    throw new RangeError('The value "' + size + '" is invalid for option "size"')
  }
}

function alloc (size, fill, encoding) {
  assertSize(size)
  if (size <= 0) {
    return createBuffer(size)
  }
  if (fill !== undefined) {
    // Only pay attention to encoding if it's a string. This
    // prevents accidentally sending in a number that would
    // be interpretted as a start offset.
    return typeof encoding === 'string'
      ? createBuffer(size).fill(fill, encoding)
      : createBuffer(size).fill(fill)
  }
  return createBuffer(size)
}

/**
 * Creates a new filled Buffer instance.
 * alloc(size[, fill[, encoding]])
 **/
Buffer.alloc = function (size, fill, encoding) {
  return alloc(size, fill, encoding)
}

function allocUnsafe (size) {
  assertSize(size)
  return createBuffer(size < 0 ? 0 : checked(size) | 0)
}

/**
 * Equivalent to Buffer(num), by default creates a non-zero-filled Buffer instance.
 * */
Buffer.allocUnsafe = function (size) {
  return allocUnsafe(size)
}
/**
 * Equivalent to SlowBuffer(num), by default creates a non-zero-filled Buffer instance.
 */
Buffer.allocUnsafeSlow = function (size) {
  return allocUnsafe(size)
}

function fromString (string, encoding) {
  if (typeof encoding !== 'string' || encoding === '') {
    encoding = 'utf8'
  }

  if (!Buffer.isEncoding(encoding)) {
    throw new TypeError('Unknown encoding: ' + encoding)
  }

  var length = byteLength(string, encoding) | 0
  var buf = createBuffer(length)

  var actual = buf.write(string, encoding)

  if (actual !== length) {
    // Writing a hex string, for example, that contains invalid characters will
    // cause everything after the first invalid character to be ignored. (e.g.
    // 'abxxcd' will be treated as 'ab')
    buf = buf.slice(0, actual)
  }

  return buf
}

function fromArrayLike (array) {
  var length = array.length < 0 ? 0 : checked(array.length) | 0
  var buf = createBuffer(length)
  for (var i = 0; i < length; i += 1) {
    buf[i] = array[i] & 255
  }
  return buf
}

function fromArrayBuffer (array, byteOffset, length) {
  if (byteOffset < 0 || array.byteLength < byteOffset) {
    throw new RangeError('"offset" is outside of buffer bounds')
  }

  if (array.byteLength < byteOffset + (length || 0)) {
    throw new RangeError('"length" is outside of buffer bounds')
  }

  var buf
  if (byteOffset === undefined && length === undefined) {
    buf = new Uint8Array(array)
  } else if (length === undefined) {
    buf = new Uint8Array(array, byteOffset)
  } else {
    buf = new Uint8Array(array, byteOffset, length)
  }

  // Return an augmented `Uint8Array` instance
  buf.__proto__ = Buffer.prototype
  return buf
}

function fromObject (obj) {
  if (Buffer.isBuffer(obj)) {
    var len = checked(obj.length) | 0
    var buf = createBuffer(len)

    if (buf.length === 0) {
      return buf
    }

    obj.copy(buf, 0, 0, len)
    return buf
  }

  if (obj.length !== undefined) {
    if (typeof obj.length !== 'number' || numberIsNaN(obj.length)) {
      return createBuffer(0)
    }
    return fromArrayLike(obj)
  }

  if (obj.type === 'Buffer' && Array.isArray(obj.data)) {
    return fromArrayLike(obj.data)
  }
}

function checked (length) {
  // Note: cannot use `length < K_MAX_LENGTH` here because that fails when
  // length is NaN (which is otherwise coerced to zero.)
  if (length >= K_MAX_LENGTH) {
    throw new RangeError('Attempt to allocate Buffer larger than maximum ' +
                         'size: 0x' + K_MAX_LENGTH.toString(16) + ' bytes')
  }
  return length | 0
}

function SlowBuffer (length) {
  if (+length != length) { // eslint-disable-line eqeqeq
    length = 0
  }
  return Buffer.alloc(+length)
}

Buffer.isBuffer = function isBuffer (b) {
  return b != null && b._isBuffer === true &&
    b !== Buffer.prototype // so Buffer.isBuffer(Buffer.prototype) will be false
}

Buffer.compare = function compare (a, b) {
  if (isInstance(a, Uint8Array)) a = Buffer.from(a, a.offset, a.byteLength)
  if (isInstance(b, Uint8Array)) b = Buffer.from(b, b.offset, b.byteLength)
  if (!Buffer.isBuffer(a) || !Buffer.isBuffer(b)) {
    throw new TypeError(
      'The "buf1", "buf2" arguments must be one of type Buffer or Uint8Array'
    )
  }

  if (a === b) return 0

  var x = a.length
  var y = b.length

  for (var i = 0, len = Math.min(x, y); i < len; ++i) {
    if (a[i] !== b[i]) {
      x = a[i]
      y = b[i]
      break
    }
  }

  if (x < y) return -1
  if (y < x) return 1
  return 0
}

Buffer.isEncoding = function isEncoding (encoding) {
  switch (String(encoding).toLowerCase()) {
    case 'hex':
    case 'utf8':
    case 'utf-8':
    case 'ascii':
    case 'latin1':
    case 'binary':
    case 'base64':
    case 'ucs2':
    case 'ucs-2':
    case 'utf16le':
    case 'utf-16le':
      return true
    default:
      return false
  }
}

Buffer.concat = function concat (list, length) {
  if (!Array.isArray(list)) {
    throw new TypeError('"list" argument must be an Array of Buffers')
  }

  if (list.length === 0) {
    return Buffer.alloc(0)
  }

  var i
  if (length === undefined) {
    length = 0
    for (i = 0; i < list.length; ++i) {
      length += list[i].length
    }
  }

  var buffer = Buffer.allocUnsafe(length)
  var pos = 0
  for (i = 0; i < list.length; ++i) {
    var buf = list[i]
    if (isInstance(buf, Uint8Array)) {
      buf = Buffer.from(buf)
    }
    if (!Buffer.isBuffer(buf)) {
      throw new TypeError('"list" argument must be an Array of Buffers')
    }
    buf.copy(buffer, pos)
    pos += buf.length
  }
  return buffer
}

function byteLength (string, encoding) {
  if (Buffer.isBuffer(string)) {
    return string.length
  }
  if (ArrayBuffer.isView(string) || isInstance(string, ArrayBuffer)) {
    return string.byteLength
  }
  if (typeof string !== 'string') {
    throw new TypeError(
      'The "string" argument must be one of type string, Buffer, or ArrayBuffer. ' +
      'Received type ' + typeof string
    )
  }

  var len = string.length
  var mustMatch = (arguments.length > 2 && arguments[2] === true)
  if (!mustMatch && len === 0) return 0

  // Use a for loop to avoid recursion
  var loweredCase = false
  for (;;) {
    switch (encoding) {
      case 'ascii':
      case 'latin1':
      case 'binary':
        return len
      case 'utf8':
      case 'utf-8':
        return utf8ToBytes(string).length
      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return len * 2
      case 'hex':
        return len >>> 1
      case 'base64':
        return base64ToBytes(string).length
      default:
        if (loweredCase) {
          return mustMatch ? -1 : utf8ToBytes(string).length // assume utf8
        }
        encoding = ('' + encoding).toLowerCase()
        loweredCase = true
    }
  }
}
Buffer.byteLength = byteLength

function slowToString (encoding, start, end) {
  var loweredCase = false

  // No need to verify that "this.length <= MAX_UINT32" since it's a read-only
  // property of a typed array.

  // This behaves neither like String nor Uint8Array in that we set start/end
  // to their upper/lower bounds if the value passed is out of range.
  // undefined is handled specially as per ECMA-262 6th Edition,
  // Section 13.3.3.7 Runtime Semantics: KeyedBindingInitialization.
  if (start === undefined || start < 0) {
    start = 0
  }
  // Return early if start > this.length. Done here to prevent potential uint32
  // coercion fail below.
  if (start > this.length) {
    return ''
  }

  if (end === undefined || end > this.length) {
    end = this.length
  }

  if (end <= 0) {
    return ''
  }

  // Force coersion to uint32. This will also coerce falsey/NaN values to 0.
  end >>>= 0
  start >>>= 0

  if (end <= start) {
    return ''
  }

  if (!encoding) encoding = 'utf8'

  while (true) {
    switch (encoding) {
      case 'hex':
        return hexSlice(this, start, end)

      case 'utf8':
      case 'utf-8':
        return utf8Slice(this, start, end)

      case 'ascii':
        return asciiSlice(this, start, end)

      case 'latin1':
      case 'binary':
        return latin1Slice(this, start, end)

      case 'base64':
        return base64Slice(this, start, end)

      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return utf16leSlice(this, start, end)

      default:
        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
        encoding = (encoding + '').toLowerCase()
        loweredCase = true
    }
  }
}

// This property is used by `Buffer.isBuffer` (and the `is-buffer` npm package)
// to detect a Buffer instance. It's not possible to use `instanceof Buffer`
// reliably in a browserify context because there could be multiple different
// copies of the 'buffer' package in use. This method works even for Buffer
// instances that were created from another copy of the `buffer` package.
// See: https://github.com/feross/buffer/issues/154
Buffer.prototype._isBuffer = true

function swap (b, n, m) {
  var i = b[n]
  b[n] = b[m]
  b[m] = i
}

Buffer.prototype.swap16 = function swap16 () {
  var len = this.length
  if (len % 2 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 16-bits')
  }
  for (var i = 0; i < len; i += 2) {
    swap(this, i, i + 1)
  }
  return this
}

Buffer.prototype.swap32 = function swap32 () {
  var len = this.length
  if (len % 4 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 32-bits')
  }
  for (var i = 0; i < len; i += 4) {
    swap(this, i, i + 3)
    swap(this, i + 1, i + 2)
  }
  return this
}

Buffer.prototype.swap64 = function swap64 () {
  var len = this.length
  if (len % 8 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 64-bits')
  }
  for (var i = 0; i < len; i += 8) {
    swap(this, i, i + 7)
    swap(this, i + 1, i + 6)
    swap(this, i + 2, i + 5)
    swap(this, i + 3, i + 4)
  }
  return this
}

Buffer.prototype.toString = function toString () {
  var length = this.length
  if (length === 0) return ''
  if (arguments.length === 0) return utf8Slice(this, 0, length)
  return slowToString.apply(this, arguments)
}

Buffer.prototype.toLocaleString = Buffer.prototype.toString

Buffer.prototype.equals = function equals (b) {
  if (!Buffer.isBuffer(b)) throw new TypeError('Argument must be a Buffer')
  if (this === b) return true
  return Buffer.compare(this, b) === 0
}

Buffer.prototype.inspect = function inspect () {
  var str = ''
  var max = exports.INSPECT_MAX_BYTES
  str = this.toString('hex', 0, max).replace(/(.{2})/g, '$1 ').trim()
  if (this.length > max) str += ' ... '
  return '<Buffer ' + str + '>'
}

Buffer.prototype.compare = function compare (target, start, end, thisStart, thisEnd) {
  if (isInstance(target, Uint8Array)) {
    target = Buffer.from(target, target.offset, target.byteLength)
  }
  if (!Buffer.isBuffer(target)) {
    throw new TypeError(
      'The "target" argument must be one of type Buffer or Uint8Array. ' +
      'Received type ' + (typeof target)
    )
  }

  if (start === undefined) {
    start = 0
  }
  if (end === undefined) {
    end = target ? target.length : 0
  }
  if (thisStart === undefined) {
    thisStart = 0
  }
  if (thisEnd === undefined) {
    thisEnd = this.length
  }

  if (start < 0 || end > target.length || thisStart < 0 || thisEnd > this.length) {
    throw new RangeError('out of range index')
  }

  if (thisStart >= thisEnd && start >= end) {
    return 0
  }
  if (thisStart >= thisEnd) {
    return -1
  }
  if (start >= end) {
    return 1
  }

  start >>>= 0
  end >>>= 0
  thisStart >>>= 0
  thisEnd >>>= 0

  if (this === target) return 0

  var x = thisEnd - thisStart
  var y = end - start
  var len = Math.min(x, y)

  var thisCopy = this.slice(thisStart, thisEnd)
  var targetCopy = target.slice(start, end)

  for (var i = 0; i < len; ++i) {
    if (thisCopy[i] !== targetCopy[i]) {
      x = thisCopy[i]
      y = targetCopy[i]
      break
    }
  }

  if (x < y) return -1
  if (y < x) return 1
  return 0
}

// Finds either the first index of `val` in `buffer` at offset >= `byteOffset`,
// OR the last index of `val` in `buffer` at offset <= `byteOffset`.
//
// Arguments:
// - buffer - a Buffer to search
// - val - a string, Buffer, or number
// - byteOffset - an index into `buffer`; will be clamped to an int32
// - encoding - an optional encoding, relevant is val is a string
// - dir - true for indexOf, false for lastIndexOf
function bidirectionalIndexOf (buffer, val, byteOffset, encoding, dir) {
  // Empty buffer means no match
  if (buffer.length === 0) return -1

  // Normalize byteOffset
  if (typeof byteOffset === 'string') {
    encoding = byteOffset
    byteOffset = 0
  } else if (byteOffset > 0x7fffffff) {
    byteOffset = 0x7fffffff
  } else if (byteOffset < -0x80000000) {
    byteOffset = -0x80000000
  }
  byteOffset = +byteOffset // Coerce to Number.
  if (numberIsNaN(byteOffset)) {
    // byteOffset: it it's undefined, null, NaN, "foo", etc, search whole buffer
    byteOffset = dir ? 0 : (buffer.length - 1)
  }

  // Normalize byteOffset: negative offsets start from the end of the buffer
  if (byteOffset < 0) byteOffset = buffer.length + byteOffset
  if (byteOffset >= buffer.length) {
    if (dir) return -1
    else byteOffset = buffer.length - 1
  } else if (byteOffset < 0) {
    if (dir) byteOffset = 0
    else return -1
  }

  // Normalize val
  if (typeof val === 'string') {
    val = Buffer.from(val, encoding)
  }

  // Finally, search either indexOf (if dir is true) or lastIndexOf
  if (Buffer.isBuffer(val)) {
    // Special case: looking for empty string/buffer always fails
    if (val.length === 0) {
      return -1
    }
    return arrayIndexOf(buffer, val, byteOffset, encoding, dir)
  } else if (typeof val === 'number') {
    val = val & 0xFF // Search for a byte value [0-255]
    if (typeof Uint8Array.prototype.indexOf === 'function') {
      if (dir) {
        return Uint8Array.prototype.indexOf.call(buffer, val, byteOffset)
      } else {
        return Uint8Array.prototype.lastIndexOf.call(buffer, val, byteOffset)
      }
    }
    return arrayIndexOf(buffer, [ val ], byteOffset, encoding, dir)
  }

  throw new TypeError('val must be string, number or Buffer')
}

function arrayIndexOf (arr, val, byteOffset, encoding, dir) {
  var indexSize = 1
  var arrLength = arr.length
  var valLength = val.length

  if (encoding !== undefined) {
    encoding = String(encoding).toLowerCase()
    if (encoding === 'ucs2' || encoding === 'ucs-2' ||
        encoding === 'utf16le' || encoding === 'utf-16le') {
      if (arr.length < 2 || val.length < 2) {
        return -1
      }
      indexSize = 2
      arrLength /= 2
      valLength /= 2
      byteOffset /= 2
    }
  }

  function read (buf, i) {
    if (indexSize === 1) {
      return buf[i]
    } else {
      return buf.readUInt16BE(i * indexSize)
    }
  }

  var i
  if (dir) {
    var foundIndex = -1
    for (i = byteOffset; i < arrLength; i++) {
      if (read(arr, i) === read(val, foundIndex === -1 ? 0 : i - foundIndex)) {
        if (foundIndex === -1) foundIndex = i
        if (i - foundIndex + 1 === valLength) return foundIndex * indexSize
      } else {
        if (foundIndex !== -1) i -= i - foundIndex
        foundIndex = -1
      }
    }
  } else {
    if (byteOffset + valLength > arrLength) byteOffset = arrLength - valLength
    for (i = byteOffset; i >= 0; i--) {
      var found = true
      for (var j = 0; j < valLength; j++) {
        if (read(arr, i + j) !== read(val, j)) {
          found = false
          break
        }
      }
      if (found) return i
    }
  }

  return -1
}

Buffer.prototype.includes = function includes (val, byteOffset, encoding) {
  return this.indexOf(val, byteOffset, encoding) !== -1
}

Buffer.prototype.indexOf = function indexOf (val, byteOffset, encoding) {
  return bidirectionalIndexOf(this, val, byteOffset, encoding, true)
}

Buffer.prototype.lastIndexOf = function lastIndexOf (val, byteOffset, encoding) {
  return bidirectionalIndexOf(this, val, byteOffset, encoding, false)
}

function hexWrite (buf, string, offset, length) {
  offset = Number(offset) || 0
  var remaining = buf.length - offset
  if (!length) {
    length = remaining
  } else {
    length = Number(length)
    if (length > remaining) {
      length = remaining
    }
  }

  var strLen = string.length

  if (length > strLen / 2) {
    length = strLen / 2
  }
  for (var i = 0; i < length; ++i) {
    var parsed = parseInt(string.substr(i * 2, 2), 16)
    if (numberIsNaN(parsed)) return i
    buf[offset + i] = parsed
  }
  return i
}

function utf8Write (buf, string, offset, length) {
  return blitBuffer(utf8ToBytes(string, buf.length - offset), buf, offset, length)
}

function asciiWrite (buf, string, offset, length) {
  return blitBuffer(asciiToBytes(string), buf, offset, length)
}

function latin1Write (buf, string, offset, length) {
  return asciiWrite(buf, string, offset, length)
}

function base64Write (buf, string, offset, length) {
  return blitBuffer(base64ToBytes(string), buf, offset, length)
}

function ucs2Write (buf, string, offset, length) {
  return blitBuffer(utf16leToBytes(string, buf.length - offset), buf, offset, length)
}

Buffer.prototype.write = function write (string, offset, length, encoding) {
  // Buffer#write(string)
  if (offset === undefined) {
    encoding = 'utf8'
    length = this.length
    offset = 0
  // Buffer#write(string, encoding)
  } else if (length === undefined && typeof offset === 'string') {
    encoding = offset
    length = this.length
    offset = 0
  // Buffer#write(string, offset[, length][, encoding])
  } else if (isFinite(offset)) {
    offset = offset >>> 0
    if (isFinite(length)) {
      length = length >>> 0
      if (encoding === undefined) encoding = 'utf8'
    } else {
      encoding = length
      length = undefined
    }
  } else {
    throw new Error(
      'Buffer.write(string, encoding, offset[, length]) is no longer supported'
    )
  }

  var remaining = this.length - offset
  if (length === undefined || length > remaining) length = remaining

  if ((string.length > 0 && (length < 0 || offset < 0)) || offset > this.length) {
    throw new RangeError('Attempt to write outside buffer bounds')
  }

  if (!encoding) encoding = 'utf8'

  var loweredCase = false
  for (;;) {
    switch (encoding) {
      case 'hex':
        return hexWrite(this, string, offset, length)

      case 'utf8':
      case 'utf-8':
        return utf8Write(this, string, offset, length)

      case 'ascii':
        return asciiWrite(this, string, offset, length)

      case 'latin1':
      case 'binary':
        return latin1Write(this, string, offset, length)

      case 'base64':
        // Warning: maxLength not taken into account in base64Write
        return base64Write(this, string, offset, length)

      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return ucs2Write(this, string, offset, length)

      default:
        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
        encoding = ('' + encoding).toLowerCase()
        loweredCase = true
    }
  }
}

Buffer.prototype.toJSON = function toJSON () {
  return {
    type: 'Buffer',
    data: Array.prototype.slice.call(this._arr || this, 0)
  }
}

function base64Slice (buf, start, end) {
  if (start === 0 && end === buf.length) {
    return base64.fromByteArray(buf)
  } else {
    return base64.fromByteArray(buf.slice(start, end))
  }
}

function utf8Slice (buf, start, end) {
  end = Math.min(buf.length, end)
  var res = []

  var i = start
  while (i < end) {
    var firstByte = buf[i]
    var codePoint = null
    var bytesPerSequence = (firstByte > 0xEF) ? 4
      : (firstByte > 0xDF) ? 3
        : (firstByte > 0xBF) ? 2
          : 1

    if (i + bytesPerSequence <= end) {
      var secondByte, thirdByte, fourthByte, tempCodePoint

      switch (bytesPerSequence) {
        case 1:
          if (firstByte < 0x80) {
            codePoint = firstByte
          }
          break
        case 2:
          secondByte = buf[i + 1]
          if ((secondByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0x1F) << 0x6 | (secondByte & 0x3F)
            if (tempCodePoint > 0x7F) {
              codePoint = tempCodePoint
            }
          }
          break
        case 3:
          secondByte = buf[i + 1]
          thirdByte = buf[i + 2]
          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0xF) << 0xC | (secondByte & 0x3F) << 0x6 | (thirdByte & 0x3F)
            if (tempCodePoint > 0x7FF && (tempCodePoint < 0xD800 || tempCodePoint > 0xDFFF)) {
              codePoint = tempCodePoint
            }
          }
          break
        case 4:
          secondByte = buf[i + 1]
          thirdByte = buf[i + 2]
          fourthByte = buf[i + 3]
          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80 && (fourthByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0xF) << 0x12 | (secondByte & 0x3F) << 0xC | (thirdByte & 0x3F) << 0x6 | (fourthByte & 0x3F)
            if (tempCodePoint > 0xFFFF && tempCodePoint < 0x110000) {
              codePoint = tempCodePoint
            }
          }
      }
    }

    if (codePoint === null) {
      // we did not generate a valid codePoint so insert a
      // replacement char (U+FFFD) and advance only 1 byte
      codePoint = 0xFFFD
      bytesPerSequence = 1
    } else if (codePoint > 0xFFFF) {
      // encode to utf16 (surrogate pair dance)
      codePoint -= 0x10000
      res.push(codePoint >>> 10 & 0x3FF | 0xD800)
      codePoint = 0xDC00 | codePoint & 0x3FF
    }

    res.push(codePoint)
    i += bytesPerSequence
  }

  return decodeCodePointsArray(res)
}

// Based on http://stackoverflow.com/a/22747272/680742, the browser with
// the lowest limit is Chrome, with 0x10000 args.
// We go 1 magnitude less, for safety
var MAX_ARGUMENTS_LENGTH = 0x1000

function decodeCodePointsArray (codePoints) {
  var len = codePoints.length
  if (len <= MAX_ARGUMENTS_LENGTH) {
    return String.fromCharCode.apply(String, codePoints) // avoid extra slice()
  }

  // Decode in chunks to avoid "call stack size exceeded".
  var res = ''
  var i = 0
  while (i < len) {
    res += String.fromCharCode.apply(
      String,
      codePoints.slice(i, i += MAX_ARGUMENTS_LENGTH)
    )
  }
  return res
}

function asciiSlice (buf, start, end) {
  var ret = ''
  end = Math.min(buf.length, end)

  for (var i = start; i < end; ++i) {
    ret += String.fromCharCode(buf[i] & 0x7F)
  }
  return ret
}

function latin1Slice (buf, start, end) {
  var ret = ''
  end = Math.min(buf.length, end)

  for (var i = start; i < end; ++i) {
    ret += String.fromCharCode(buf[i])
  }
  return ret
}

function hexSlice (buf, start, end) {
  var len = buf.length

  if (!start || start < 0) start = 0
  if (!end || end < 0 || end > len) end = len

  var out = ''
  for (var i = start; i < end; ++i) {
    out += toHex(buf[i])
  }
  return out
}

function utf16leSlice (buf, start, end) {
  var bytes = buf.slice(start, end)
  var res = ''
  for (var i = 0; i < bytes.length; i += 2) {
    res += String.fromCharCode(bytes[i] + (bytes[i + 1] * 256))
  }
  return res
}

Buffer.prototype.slice = function slice (start, end) {
  var len = this.length
  start = ~~start
  end = end === undefined ? len : ~~end

  if (start < 0) {
    start += len
    if (start < 0) start = 0
  } else if (start > len) {
    start = len
  }

  if (end < 0) {
    end += len
    if (end < 0) end = 0
  } else if (end > len) {
    end = len
  }

  if (end < start) end = start

  var newBuf = this.subarray(start, end)
  // Return an augmented `Uint8Array` instance
  newBuf.__proto__ = Buffer.prototype
  return newBuf
}

/*
 * Need to make sure that buffer isn't trying to write out of bounds.
 */
function checkOffset (offset, ext, length) {
  if ((offset % 1) !== 0 || offset < 0) throw new RangeError('offset is not uint')
  if (offset + ext > length) throw new RangeError('Trying to access beyond buffer length')
}

Buffer.prototype.readUIntLE = function readUIntLE (offset, byteLength, noAssert) {
  offset = offset >>> 0
  byteLength = byteLength >>> 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var val = this[offset]
  var mul = 1
  var i = 0
  while (++i < byteLength && (mul *= 0x100)) {
    val += this[offset + i] * mul
  }

  return val
}

Buffer.prototype.readUIntBE = function readUIntBE (offset, byteLength, noAssert) {
  offset = offset >>> 0
  byteLength = byteLength >>> 0
  if (!noAssert) {
    checkOffset(offset, byteLength, this.length)
  }

  var val = this[offset + --byteLength]
  var mul = 1
  while (byteLength > 0 && (mul *= 0x100)) {
    val += this[offset + --byteLength] * mul
  }

  return val
}

Buffer.prototype.readUInt8 = function readUInt8 (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 1, this.length)
  return this[offset]
}

Buffer.prototype.readUInt16LE = function readUInt16LE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 2, this.length)
  return this[offset] | (this[offset + 1] << 8)
}

Buffer.prototype.readUInt16BE = function readUInt16BE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 2, this.length)
  return (this[offset] << 8) | this[offset + 1]
}

Buffer.prototype.readUInt32LE = function readUInt32LE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 4, this.length)

  return ((this[offset]) |
      (this[offset + 1] << 8) |
      (this[offset + 2] << 16)) +
      (this[offset + 3] * 0x1000000)
}

Buffer.prototype.readUInt32BE = function readUInt32BE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset] * 0x1000000) +
    ((this[offset + 1] << 16) |
    (this[offset + 2] << 8) |
    this[offset + 3])
}

Buffer.prototype.readIntLE = function readIntLE (offset, byteLength, noAssert) {
  offset = offset >>> 0
  byteLength = byteLength >>> 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var val = this[offset]
  var mul = 1
  var i = 0
  while (++i < byteLength && (mul *= 0x100)) {
    val += this[offset + i] * mul
  }
  mul *= 0x80

  if (val >= mul) val -= Math.pow(2, 8 * byteLength)

  return val
}

Buffer.prototype.readIntBE = function readIntBE (offset, byteLength, noAssert) {
  offset = offset >>> 0
  byteLength = byteLength >>> 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var i = byteLength
  var mul = 1
  var val = this[offset + --i]
  while (i > 0 && (mul *= 0x100)) {
    val += this[offset + --i] * mul
  }
  mul *= 0x80

  if (val >= mul) val -= Math.pow(2, 8 * byteLength)

  return val
}

Buffer.prototype.readInt8 = function readInt8 (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 1, this.length)
  if (!(this[offset] & 0x80)) return (this[offset])
  return ((0xff - this[offset] + 1) * -1)
}

Buffer.prototype.readInt16LE = function readInt16LE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 2, this.length)
  var val = this[offset] | (this[offset + 1] << 8)
  return (val & 0x8000) ? val | 0xFFFF0000 : val
}

Buffer.prototype.readInt16BE = function readInt16BE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 2, this.length)
  var val = this[offset + 1] | (this[offset] << 8)
  return (val & 0x8000) ? val | 0xFFFF0000 : val
}

Buffer.prototype.readInt32LE = function readInt32LE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset]) |
    (this[offset + 1] << 8) |
    (this[offset + 2] << 16) |
    (this[offset + 3] << 24)
}

Buffer.prototype.readInt32BE = function readInt32BE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset] << 24) |
    (this[offset + 1] << 16) |
    (this[offset + 2] << 8) |
    (this[offset + 3])
}

Buffer.prototype.readFloatLE = function readFloatLE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 4, this.length)
  return ieee754.read(this, offset, true, 23, 4)
}

Buffer.prototype.readFloatBE = function readFloatBE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 4, this.length)
  return ieee754.read(this, offset, false, 23, 4)
}

Buffer.prototype.readDoubleLE = function readDoubleLE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 8, this.length)
  return ieee754.read(this, offset, true, 52, 8)
}

Buffer.prototype.readDoubleBE = function readDoubleBE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 8, this.length)
  return ieee754.read(this, offset, false, 52, 8)
}

function checkInt (buf, value, offset, ext, max, min) {
  if (!Buffer.isBuffer(buf)) throw new TypeError('"buffer" argument must be a Buffer instance')
  if (value > max || value < min) throw new RangeError('"value" argument is out of bounds')
  if (offset + ext > buf.length) throw new RangeError('Index out of range')
}

Buffer.prototype.writeUIntLE = function writeUIntLE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset >>> 0
  byteLength = byteLength >>> 0
  if (!noAssert) {
    var maxBytes = Math.pow(2, 8 * byteLength) - 1
    checkInt(this, value, offset, byteLength, maxBytes, 0)
  }

  var mul = 1
  var i = 0
  this[offset] = value & 0xFF
  while (++i < byteLength && (mul *= 0x100)) {
    this[offset + i] = (value / mul) & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeUIntBE = function writeUIntBE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset >>> 0
  byteLength = byteLength >>> 0
  if (!noAssert) {
    var maxBytes = Math.pow(2, 8 * byteLength) - 1
    checkInt(this, value, offset, byteLength, maxBytes, 0)
  }

  var i = byteLength - 1
  var mul = 1
  this[offset + i] = value & 0xFF
  while (--i >= 0 && (mul *= 0x100)) {
    this[offset + i] = (value / mul) & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeUInt8 = function writeUInt8 (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 1, 0xff, 0)
  this[offset] = (value & 0xff)
  return offset + 1
}

Buffer.prototype.writeUInt16LE = function writeUInt16LE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
  this[offset] = (value & 0xff)
  this[offset + 1] = (value >>> 8)
  return offset + 2
}

Buffer.prototype.writeUInt16BE = function writeUInt16BE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
  this[offset] = (value >>> 8)
  this[offset + 1] = (value & 0xff)
  return offset + 2
}

Buffer.prototype.writeUInt32LE = function writeUInt32LE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
  this[offset + 3] = (value >>> 24)
  this[offset + 2] = (value >>> 16)
  this[offset + 1] = (value >>> 8)
  this[offset] = (value & 0xff)
  return offset + 4
}

Buffer.prototype.writeUInt32BE = function writeUInt32BE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
  this[offset] = (value >>> 24)
  this[offset + 1] = (value >>> 16)
  this[offset + 2] = (value >>> 8)
  this[offset + 3] = (value & 0xff)
  return offset + 4
}

Buffer.prototype.writeIntLE = function writeIntLE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) {
    var limit = Math.pow(2, (8 * byteLength) - 1)

    checkInt(this, value, offset, byteLength, limit - 1, -limit)
  }

  var i = 0
  var mul = 1
  var sub = 0
  this[offset] = value & 0xFF
  while (++i < byteLength && (mul *= 0x100)) {
    if (value < 0 && sub === 0 && this[offset + i - 1] !== 0) {
      sub = 1
    }
    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeIntBE = function writeIntBE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) {
    var limit = Math.pow(2, (8 * byteLength) - 1)

    checkInt(this, value, offset, byteLength, limit - 1, -limit)
  }

  var i = byteLength - 1
  var mul = 1
  var sub = 0
  this[offset + i] = value & 0xFF
  while (--i >= 0 && (mul *= 0x100)) {
    if (value < 0 && sub === 0 && this[offset + i + 1] !== 0) {
      sub = 1
    }
    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeInt8 = function writeInt8 (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 1, 0x7f, -0x80)
  if (value < 0) value = 0xff + value + 1
  this[offset] = (value & 0xff)
  return offset + 1
}

Buffer.prototype.writeInt16LE = function writeInt16LE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
  this[offset] = (value & 0xff)
  this[offset + 1] = (value >>> 8)
  return offset + 2
}

Buffer.prototype.writeInt16BE = function writeInt16BE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
  this[offset] = (value >>> 8)
  this[offset + 1] = (value & 0xff)
  return offset + 2
}

Buffer.prototype.writeInt32LE = function writeInt32LE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
  this[offset] = (value & 0xff)
  this[offset + 1] = (value >>> 8)
  this[offset + 2] = (value >>> 16)
  this[offset + 3] = (value >>> 24)
  return offset + 4
}

Buffer.prototype.writeInt32BE = function writeInt32BE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
  if (value < 0) value = 0xffffffff + value + 1
  this[offset] = (value >>> 24)
  this[offset + 1] = (value >>> 16)
  this[offset + 2] = (value >>> 8)
  this[offset + 3] = (value & 0xff)
  return offset + 4
}

function checkIEEE754 (buf, value, offset, ext, max, min) {
  if (offset + ext > buf.length) throw new RangeError('Index out of range')
  if (offset < 0) throw new RangeError('Index out of range')
}

function writeFloat (buf, value, offset, littleEndian, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) {
    checkIEEE754(buf, value, offset, 4, 3.4028234663852886e+38, -3.4028234663852886e+38)
  }
  ieee754.write(buf, value, offset, littleEndian, 23, 4)
  return offset + 4
}

Buffer.prototype.writeFloatLE = function writeFloatLE (value, offset, noAssert) {
  return writeFloat(this, value, offset, true, noAssert)
}

Buffer.prototype.writeFloatBE = function writeFloatBE (value, offset, noAssert) {
  return writeFloat(this, value, offset, false, noAssert)
}

function writeDouble (buf, value, offset, littleEndian, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) {
    checkIEEE754(buf, value, offset, 8, 1.7976931348623157E+308, -1.7976931348623157E+308)
  }
  ieee754.write(buf, value, offset, littleEndian, 52, 8)
  return offset + 8
}

Buffer.prototype.writeDoubleLE = function writeDoubleLE (value, offset, noAssert) {
  return writeDouble(this, value, offset, true, noAssert)
}

Buffer.prototype.writeDoubleBE = function writeDoubleBE (value, offset, noAssert) {
  return writeDouble(this, value, offset, false, noAssert)
}

// copy(targetBuffer, targetStart=0, sourceStart=0, sourceEnd=buffer.length)
Buffer.prototype.copy = function copy (target, targetStart, start, end) {
  if (!Buffer.isBuffer(target)) throw new TypeError('argument should be a Buffer')
  if (!start) start = 0
  if (!end && end !== 0) end = this.length
  if (targetStart >= target.length) targetStart = target.length
  if (!targetStart) targetStart = 0
  if (end > 0 && end < start) end = start

  // Copy 0 bytes; we're done
  if (end === start) return 0
  if (target.length === 0 || this.length === 0) return 0

  // Fatal error conditions
  if (targetStart < 0) {
    throw new RangeError('targetStart out of bounds')
  }
  if (start < 0 || start >= this.length) throw new RangeError('Index out of range')
  if (end < 0) throw new RangeError('sourceEnd out of bounds')

  // Are we oob?
  if (end > this.length) end = this.length
  if (target.length - targetStart < end - start) {
    end = target.length - targetStart + start
  }

  var len = end - start

  if (this === target && typeof Uint8Array.prototype.copyWithin === 'function') {
    // Use built-in when available, missing from IE11
    this.copyWithin(targetStart, start, end)
  } else if (this === target && start < targetStart && targetStart < end) {
    // descending copy from end
    for (var i = len - 1; i >= 0; --i) {
      target[i + targetStart] = this[i + start]
    }
  } else {
    Uint8Array.prototype.set.call(
      target,
      this.subarray(start, end),
      targetStart
    )
  }

  return len
}

// Usage:
//    buffer.fill(number[, offset[, end]])
//    buffer.fill(buffer[, offset[, end]])
//    buffer.fill(string[, offset[, end]][, encoding])
Buffer.prototype.fill = function fill (val, start, end, encoding) {
  // Handle string cases:
  if (typeof val === 'string') {
    if (typeof start === 'string') {
      encoding = start
      start = 0
      end = this.length
    } else if (typeof end === 'string') {
      encoding = end
      end = this.length
    }
    if (encoding !== undefined && typeof encoding !== 'string') {
      throw new TypeError('encoding must be a string')
    }
    if (typeof encoding === 'string' && !Buffer.isEncoding(encoding)) {
      throw new TypeError('Unknown encoding: ' + encoding)
    }
    if (val.length === 1) {
      var code = val.charCodeAt(0)
      if ((encoding === 'utf8' && code < 128) ||
          encoding === 'latin1') {
        // Fast path: If `val` fits into a single byte, use that numeric value.
        val = code
      }
    }
  } else if (typeof val === 'number') {
    val = val & 255
  }

  // Invalid ranges are not set to a default, so can range check early.
  if (start < 0 || this.length < start || this.length < end) {
    throw new RangeError('Out of range index')
  }

  if (end <= start) {
    return this
  }

  start = start >>> 0
  end = end === undefined ? this.length : end >>> 0

  if (!val) val = 0

  var i
  if (typeof val === 'number') {
    for (i = start; i < end; ++i) {
      this[i] = val
    }
  } else {
    var bytes = Buffer.isBuffer(val)
      ? val
      : Buffer.from(val, encoding)
    var len = bytes.length
    if (len === 0) {
      throw new TypeError('The value "' + val +
        '" is invalid for argument "value"')
    }
    for (i = 0; i < end - start; ++i) {
      this[i + start] = bytes[i % len]
    }
  }

  return this
}

// HELPER FUNCTIONS
// ================

var INVALID_BASE64_RE = /[^+/0-9A-Za-z-_]/g

function base64clean (str) {
  // Node takes equal signs as end of the Base64 encoding
  str = str.split('=')[0]
  // Node strips out invalid characters like \n and \t from the string, base64-js does not
  str = str.trim().replace(INVALID_BASE64_RE, '')
  // Node converts strings with length < 2 to ''
  if (str.length < 2) return ''
  // Node allows for non-padded base64 strings (missing trailing ===), base64-js does not
  while (str.length % 4 !== 0) {
    str = str + '='
  }
  return str
}

function toHex (n) {
  if (n < 16) return '0' + n.toString(16)
  return n.toString(16)
}

function utf8ToBytes (string, units) {
  units = units || Infinity
  var codePoint
  var length = string.length
  var leadSurrogate = null
  var bytes = []

  for (var i = 0; i < length; ++i) {
    codePoint = string.charCodeAt(i)

    // is surrogate component
    if (codePoint > 0xD7FF && codePoint < 0xE000) {
      // last char was a lead
      if (!leadSurrogate) {
        // no lead yet
        if (codePoint > 0xDBFF) {
          // unexpected trail
          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
          continue
        } else if (i + 1 === length) {
          // unpaired lead
          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
          continue
        }

        // valid lead
        leadSurrogate = codePoint

        continue
      }

      // 2 leads in a row
      if (codePoint < 0xDC00) {
        if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
        leadSurrogate = codePoint
        continue
      }

      // valid surrogate pair
      codePoint = (leadSurrogate - 0xD800 << 10 | codePoint - 0xDC00) + 0x10000
    } else if (leadSurrogate) {
      // valid bmp char, but last char was a lead
      if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
    }

    leadSurrogate = null

    // encode utf8
    if (codePoint < 0x80) {
      if ((units -= 1) < 0) break
      bytes.push(codePoint)
    } else if (codePoint < 0x800) {
      if ((units -= 2) < 0) break
      bytes.push(
        codePoint >> 0x6 | 0xC0,
        codePoint & 0x3F | 0x80
      )
    } else if (codePoint < 0x10000) {
      if ((units -= 3) < 0) break
      bytes.push(
        codePoint >> 0xC | 0xE0,
        codePoint >> 0x6 & 0x3F | 0x80,
        codePoint & 0x3F | 0x80
      )
    } else if (codePoint < 0x110000) {
      if ((units -= 4) < 0) break
      bytes.push(
        codePoint >> 0x12 | 0xF0,
        codePoint >> 0xC & 0x3F | 0x80,
        codePoint >> 0x6 & 0x3F | 0x80,
        codePoint & 0x3F | 0x80
      )
    } else {
      throw new Error('Invalid code point')
    }
  }

  return bytes
}

function asciiToBytes (str) {
  var byteArray = []
  for (var i = 0; i < str.length; ++i) {
    // Node's code seems to be doing this and not & 0x7F..
    byteArray.push(str.charCodeAt(i) & 0xFF)
  }
  return byteArray
}

function utf16leToBytes (str, units) {
  var c, hi, lo
  var byteArray = []
  for (var i = 0; i < str.length; ++i) {
    if ((units -= 2) < 0) break

    c = str.charCodeAt(i)
    hi = c >> 8
    lo = c % 256
    byteArray.push(lo)
    byteArray.push(hi)
  }

  return byteArray
}

function base64ToBytes (str) {
  return base64.toByteArray(base64clean(str))
}

function blitBuffer (src, dst, offset, length) {
  for (var i = 0; i < length; ++i) {
    if ((i + offset >= dst.length) || (i >= src.length)) break
    dst[i + offset] = src[i]
  }
  return i
}

// ArrayBuffer or Uint8Array objects from other contexts (i.e. iframes) do not pass
// the `instanceof` check but they should be treated as of that type.
// See: https://github.com/feross/buffer/issues/166
function isInstance (obj, type) {
  return obj instanceof type ||
    (obj != null && obj.constructor != null && obj.constructor.name != null &&
      obj.constructor.name === type.name)
}
function numberIsNaN (obj) {
  // For IE11 support
  return obj !== obj // eslint-disable-line no-self-compare
}

}).call(this)}).call(this,require("buffer").Buffer)
},{"base64-js":12,"buffer":13,"ieee754":14}],14:[function(require,module,exports){
/*! ieee754. BSD-3-Clause License. Feross Aboukhadijeh <https://feross.org/opensource> */
exports.read = function (buffer, offset, isLE, mLen, nBytes) {
  var e, m
  var eLen = (nBytes * 8) - mLen - 1
  var eMax = (1 << eLen) - 1
  var eBias = eMax >> 1
  var nBits = -7
  var i = isLE ? (nBytes - 1) : 0
  var d = isLE ? -1 : 1
  var s = buffer[offset + i]

  i += d

  e = s & ((1 << (-nBits)) - 1)
  s >>= (-nBits)
  nBits += eLen
  for (; nBits > 0; e = (e * 256) + buffer[offset + i], i += d, nBits -= 8) {}

  m = e & ((1 << (-nBits)) - 1)
  e >>= (-nBits)
  nBits += mLen
  for (; nBits > 0; m = (m * 256) + buffer[offset + i], i += d, nBits -= 8) {}

  if (e === 0) {
    e = 1 - eBias
  } else if (e === eMax) {
    return m ? NaN : ((s ? -1 : 1) * Infinity)
  } else {
    m = m + Math.pow(2, mLen)
    e = e - eBias
  }
  return (s ? -1 : 1) * m * Math.pow(2, e - mLen)
}

exports.write = function (buffer, value, offset, isLE, mLen, nBytes) {
  var e, m, c
  var eLen = (nBytes * 8) - mLen - 1
  var eMax = (1 << eLen) - 1
  var eBias = eMax >> 1
  var rt = (mLen === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0)
  var i = isLE ? 0 : (nBytes - 1)
  var d = isLE ? 1 : -1
  var s = value < 0 || (value === 0 && 1 / value < 0) ? 1 : 0

  value = Math.abs(value)

  if (isNaN(value) || value === Infinity) {
    m = isNaN(value) ? 1 : 0
    e = eMax
  } else {
    e = Math.floor(Math.log(value) / Math.LN2)
    if (value * (c = Math.pow(2, -e)) < 1) {
      e--
      c *= 2
    }
    if (e + eBias >= 1) {
      value += rt / c
    } else {
      value += rt * Math.pow(2, 1 - eBias)
    }
    if (value * c >= 2) {
      e++
      c /= 2
    }

    if (e + eBias >= eMax) {
      m = 0
      e = eMax
    } else if (e + eBias >= 1) {
      m = ((value * c) - 1) * Math.pow(2, mLen)
      e = e + eBias
    } else {
      m = value * Math.pow(2, eBias - 1) * Math.pow(2, mLen)
      e = 0
    }
  }

  for (; mLen >= 8; buffer[offset + i] = m & 0xff, i += d, m /= 256, mLen -= 8) {}

  e = (e << mLen) | m
  eLen += mLen
  for (; eLen > 0; buffer[offset + i] = e & 0xff, i += d, e /= 256, eLen -= 8) {}

  buffer[offset + i - d] |= s * 128
}

},{}]},{},[11])(11)
});
