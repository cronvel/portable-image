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



function Frame( sprite , params = {} ) {
	Object.defineProperty( this , 'sprite' , { value: sprite } ) ;
	this.duration = params.duration ;	// in ms
	this.flattenLayers = [] ;
	this.cels = [] ;
}

module.exports = Frame ;

const Sprite = require( './Sprite.js' ) ;
const Layer = require( './Layer.js' ) ;
const PortableImage = require( './PortableImage.js' ) ;



Frame.prototype.toImage = function( PortableImageClass = misc.PortableImage ) {
	var params = this.ase.getPortableImageParams( PortableImageClass ) ;
	var portableImage = new PortableImageClass( params ) ;
	
	for ( let cel of this.cels ) {
		if ( ! cel.layer.visible ) { continue ; }
		let celPortableImage = cel.toImage( PortableImageClass ) ;
		celPortableImage.copyTo( portableImage , {
			compositing: PortableImageClass.compositing.binaryOver ,
			x: cel.x , y: cel.y
		} ) ;
		console.log( "Copy from/to:" , portableImage , celPortableImage , " --- cel: " , cel ) ;
	}
	
	return portableImage ;
} ;

