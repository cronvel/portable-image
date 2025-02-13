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
	this.channels = Array.isArray( params.channels ) ? params.channels : PortableImage.RGBA ;
	this.indexed = params.indexed || Array.isArray( params.palette ) ;
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



ChannelDef.prototype.hasSamePalette = function( portableImage ) {
	if ( ! this.palette || ! portableImage.palette ) { return false ; }
	if ( this.palette.length !== portableImage.palette.length ) { return false ; }

	for ( let index = 0 ; index < this.palette.length ; index ++ ) {
		let values = this.palette[ index ] ;

		for ( let c = 0 ; c < values.length ; c ++ ) {
			if ( values[ c ] !== portableImage.palette[ index ][ c ] ) { return false ; }
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

