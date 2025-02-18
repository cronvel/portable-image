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



Sprite.prototype.toImage = function( ImageClass ) {
	// Only the first frame
	return this.frames[ 0 ].toImage( ImageClass ) ;
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

