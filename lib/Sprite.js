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
const Image = require( './Image.js' ) ;



function Sprite( params = {} ) {
	// Clipping size
	this.width = params.width ;
	this.height = params.height ;

	this.images = [] ;	// Image instances
	this.layers = [] ;	// Layer instances
	this.frames = [] ;	// Frame instances
	this.animations = [] ;	// Animations instances

	this.orderedLayers = [] ;	// Store layer indexes
	this.animationByName = new Map() ;	// Animation name to animation index

	/*
	if ( Array.isArray( params.palette ) ) {
		this.setPalette( params.palette ) ;
	}

	this.channelIndex = {} ;
	for ( let i = 0 ; i < this.channels.length ; i ++ ) {
		this.channelIndex[ this.channels[ i ] ] = i ;
	}
	*/
}

module.exports = Sprite ;



Sprite.prototype.toImage = function( ImageClass ) {
	// Only the first frame
	return this.frames[ 0 ].toImage( ImageClass ) ;
} ;

