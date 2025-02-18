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

