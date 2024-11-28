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



const Frame = require( './Frame.js' ) ;
const Layer = require( './Layer.js' ) ;
const PortableImage = require( './PortableImage.js' ) ;



function Sprite( params = {} ) {

	// This part contains the same properties than PortableImage instances.

	this.width = params.width ;
	this.height = params.height ;
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

	// Sprite-specific properties
	
    this.images = [] ;	// PortableImage instances
    this.layers = [] ;	// Layer instances
    this.frames = [] ;	// Frame instances
    this.animations = {} ;	// Animations instances by name
}

module.exports = Sprite ;



Sprite.prototype.toImage = function( PortableImageClass = misc.PortableImage ) {
	// Only the first frame
	return this.frames[ 0 ].toImage( PortableImageClass ) ;
} ;

