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

