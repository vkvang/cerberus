// this defines the global list of objects
    // if it exists already, this is a redundant definition
    // if it isn't create a new array
var grobjects = grobjects || [];

// Constructor Cube
var Tree = undefined;
var image = new Image();
image.src = "https://goo.gl/yRquzF";

// Adding object to list
(function() {
	"use strict";

	var shaderProgram = undefined;
	var bufferHead = undefined;
	var bufferStump = undefined;
	var bufferTex = undefined;

	var treeNum = 0;

	// Creating Tree Stump
	Tree = function Tree(position, size) {
		this.name= "tree"+treeNum++;
		this.position= position || [0,0.25,0];
		this.size = size || 1.0;
		this.colrLeaf = [0.0,1.7,1.4];
		this.colrTrunk = [1.0,1.0,0.0];
	}
	Tree.prototype.init = function(drawingState) {
		var gl=drawingState.gl;
		// impliment shader so can knows draw style
		if (!shaderProgram) {
			shaderProgram = twgl.createProgramInfo(gl, ["general-vs", "general-fs"]);
		}
		if (!bufferStump) {
			var arraystump = {
				vpos : { numComponents: 3, data: [
                    -.25,-.25,-.25,  .25,-.25,-.25,  .25, .25,-.25,        -.25,-.25,-.25,  .25, .25,-.25, -.25, .25,-.25,    // z = 0
                    -.25,-.25, .25,  .25,-.25, .25,  .25, .25, .25,        -.25,-.25, .25,  .25, .25, .25, -.25, .25, .25,    // z = 1
                    -.25,-.25,-.25,  .25,-.25,-.25,  .25,-.25, .25,        -.25,-.25,-.25,  .25,-.25, .25, -.25,-.25, .25,    // y = 0
                    -.25, .25,-.25,  .25, .25,-.25,  .25, .25, .25,        -.25, .25,-.25,  .25, .25, .25, -.25, .25, .25,    // y = 1
                    -.25,-.25,-.25, -.25, .25,-.25, -.25, .25, .25,        -.25,-.25,-.25, -.25, .25, .25, -.25,-.25, .25,    // x = 0
                     .25,-.25,-.25,  .25, .25,-.25,  .25, .25, .25,         .25,-.25,-.25,  .25, .25, .25,  .25,-.25, .25     // x = 1
                ] },
                vnormal : {numComponents:3, data: [
                    0,0,-1, 0,0,-1, 0,0,-1,     0,0,-1, 0,0,-1, 0,0,-1,
                    0,0,1, 0,0,1, 0,0,1,        0,0,1, 0,0,1, 0,0,1,
                    0,-1,0, 0,-1,0, 0,-1,0,     0,-1,0, 0,-1,0, 0,-1,0,
                    0,1,0, 0,1,0, 0,1,0,        0,1,0, 0,1,0, 0,1,0,
                    -1,0,0, -1,0,0, -1,0,0,     -1,0,0, -1,0,0, -1,0,0,
                    1,0,0, 1,0,0, 1,0,0,        1,0,0, 1,0,0, 1,0,0,
                ]}
			};
			bufferStump = twgl.createBufferInfoFromArrays(drawingState.gl, arraystump);

			var arrayhead = {
				vpos : { numComponents: 3, data: [
					// Bottom Triangular Head
					    -0.625, 0.25, -0.625, // triangle 1
					    0.625, 0.25, -0.625,
					    0.0, 1.5, 0.0,

					    0.625, 0.25, -0.625, // triangle 2
					    0.625, 0.25, 0.625,
					    0.0, 1.5, 0.0,

					    0.625, 0.25, 0.625, // triangle 3
					    -0.625, 0.25, 0.625,
				        0.0, 1.5, 0.0,

				        -0.625, 0.25, 0.625, // triangle 4
				        -0.625, 0.25, -0.625,
				        0.0, 1.5, 0.0,

				    // Top Triangular Head
				        -0.5, 0.75, -0.5, // triangle 1
				        0.5, 0.75, -0.5,
				        0.0, 1.75, 0.0,

				        0.5, 0.75, -0.5, // triangle 2
				        0.5, 0.75, 0.5,
				        0.0, 1.75, 0.0,

				        0.5, 0.75, 0.5, // triangle 3
				        -0.5, 0.75, 0.5,
				        0.0, 1.75, 0.0,

				        -0.5, 0.75, 0.5, // triangle 4
				        -0.5, 0.75, -0.5,
				        0.0, 1.75, 0.0
                ]},
                vnormal : {numComponents:3, data: [
                	// Bottom Head
                		0.0, -1.0, 0.0,
                		0.0, -1.0, 0.0,
                		0.0, -1.0, 0.0,

                		0.0, -1.0, 0.0,
                		0.0, -1.0, 0.0,
                		0.0, -1.0, 0.0,

                		0.0, -1.0, 0.0,
                		0.0, -1.0, 0.0,
                		0.0, -1.0, 0.0,

                		0.0, -1.0, 0.0,
                		0.0, -1.0, 0.0,
                		0.0, -1.0, 0.0,
                	// Top Head
                		0.0, -1.0, 0.0,
                		0.0, -1.0, 0.0,
                		0.0, -1.0, 0.0,

                		0.0, -1.0, 0.0,
                		0.0, -1.0, 0.0,
                		0.0, -1.0, 0.0,

                		0.0, -1.0, 0.0,
                		0.0, -1.0, 0.0,
                		0.0, -1.0, 0.0,

                		0.0, -1.0, 0.0,
                		0.0, -1.0, 0.0,
                		0.0, -1.0, 0.0,
                ]},
                vtexture : {numComponents:2, data: [
                	// Texture Buffer
                		0, 0,	1, 0,	0.5, 1,
                		1, 0,	0.5, 1,	0, 0,
                		0.5, 1,	0, 0,	1, 0,

                		0, 0,	1, 0,	0.5, 1,
                		0.5, 1,	1, 0,	0, 0,
                		1, 0,	0, 0,	0.5, 1
                ]}
			};
			bufferHead = twgl.createBufferInfoFromArrays(drawingState.gl, arrayhead);
		}
	};




	Tree.prototype.draw = function(drawingState) {
		var modelM = twgl.m4.scaling([this.size,this.size,this.size]);
		twgl.m4.setTranslation(modelM,this.position,modelM);

		var gl = drawingState.gl;
		// var texcoord = gl.getAttribLocation(program, tex_coord);

		// 	var textureBuffer = gl.createBuffer();


		// 	// Set up Texture
		// 	function initTexture() {
		// 	    image1.onload = function() {
		// 	        loadTexture(image1, texture1);
		// 	    };
		// 	    image1.crossOrigin = "anonymous";
		// 	    image1.src = "Libraries/treeTex.jpg";

		// 	    window.setTimeout(draw, 200);
		// 	}

		// 	function loadTexture(image, texture) {
		// 	    gl.bindTexture(gl.TEXTURE_2D, texture);
		// 	    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);

		// 	    gl.generateMipmap(gl.TEXTURE_2D);
		// 	    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
		// 	}

		// Tree Leaves
		gl.useProgram(shaderProgram.program);
		twgl.setUniforms(shaderProgram, {
			view:drawingState.view, proj:drawingState.proj, lightdir:drawingState.sunDirection,
			color:this.colrLeaf, model:modelM });
		twgl.setBuffersAndAttributes(gl,shaderProgram,bufferHead); 
		twgl.drawBufferInfo(gl, gl.TRIANGLES, bufferHead);

		// Tree Trunk
		gl.useProgram(shaderProgram.program);

		twgl.setUniforms(shaderProgram,{
			view:drawingState.view, proj:drawingState.proj, lightdir:drawingState.sunDirection,
			color:this.colrTrunk, model:modelM });
		twgl.setBuffersAndAttributes(gl,shaderProgram,bufferStump);
		twgl.drawBufferInfo(gl, gl.TRIANGLES, bufferStump);
	};
	Tree.prototype.center = function(drawingState) {
		return this.position;
	}
})();

// Render the objects

// Tree at orgin
grobjects.push(new Tree([0,0.25,0],1.5));

