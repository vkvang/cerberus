// this defines the global list of objects
    // if it exists already, this is a redundant definition
    // if it isn't create a new array
var grobjects = grobjects || [];

// Constructor Cube
var tree = undefined;

// Adding object to list
(function() {
	"use strict";

	var shaderProgram = undefined;
	var stumpBuffers = undefined;
	var leafBuffers = undefined;
	var headBuffers = undefined;

	// Creating Tree Stump
	Tree = function Tree(name, position, size, color) {
		this.name= name;
		this.position= position || [0,0,0];
		this.size = size || 1.0;
		this.color = color || [1.0,1.0,1.0];
	}
	Tree.prototype.init = function(drawingState) {
		var gl=drawingState.gl;
		// impliment shader so can knows draw style
		if (!shaderProgram) {
			shaderProgram = twgl.createProgramInfo(gl, ["tree-vs", "tree-fs"]);
		}
		if (!stumpBuffers) {
			var arrStump = {
				vposST : { numComponents: 3, data: [
                    -.5,-.5,-.5,  .5,-.5,-.5,  .5, .5,-.5,        -.5,-.5,-.5,  .5, .5,-.5, -.5, .5,-.5,    // z = 0
                    -.5,-.5, .5,  .5,-.5, .5,  .5, .5, .5,        -.5,-.5, .5,  .5, .5, .5, -.5, .5, .5,    // z = 1
                    -.5,-.5,-.5,  .5,-.5,-.5,  .5,-.5, .5,        -.5,-.5,-.5,  .5,-.5, .5, -.5,-.5, .5,    // y = 0
                    -.5, .5,-.5,  .5, .5,-.5,  .5, .5, .5,        -.5, .5,-.5,  .5, .5, .5, -.5, .5, .5,    // y = 1
                    -.5,-.5,-.5, -.5, .5,-.5, -.5, .5, .5,        -.5,-.5,-.5, -.5, .5, .5, -.5,-.5, .5,    // x = 0
                     .5,-.5,-.5,  .5, .5,-.5,  .5, .5, .5,         .5,-.5,-.5,  .5, .5, .5,  .5,-.5, .5     // x = 1
                ] },
                vnormalST : {numComponents:3, data: [
                    0,0,-1, 0,0,-1, 0,0,-1,     0,0,-1, 0,0,-1, 0,0,-1,
                    0,0,1, 0,0,1, 0,0,1,        0,0,1, 0,0,1, 0,0,1,
                    0,-1,0, 0,-1,0, 0,-1,0,     0,-1,0, 0,-1,0, 0,-1,0,
                    0,1,0, 0,1,0, 0,1,0,        0,1,0, 0,1,0, 0,1,0,
                    -1,0,0, -1,0,0, -1,0,0,     -1,0,0, -1,0,0, -1,0,0,
                    1,0,0, 1,0,0, 1,0,0,        1,0,0, 1,0,0, 1,0,0,
                ]}
			};
			stumpBuffers = twgl.createBufferInfoFromArrays(drawingState.gl, arrStump);
			var arrLeafs = {
				vposL : { numComponents: 3, data: [
					        -0.5, 0.0, -0.5, // triangle 1
					        0.5, 0.0, -0.5,
					        0.0, 1.0, 0.0,

					        0.5, 0.0, -0.5, // triangle 2
					        0.5, 0.0, 0.5,
					        0.0, 1.0, 0.0,

					        0.5, 0.0, 0.5, // triangle 3
					        -0.5, 0.0, 0.5,
					        0.0, 1.0, 0.0,

					        -0.5, 0.0, 0.5, // triangle 4
					        -0.5, 0.0, -0.5,
					        0.0, 1.0, 0.0,
                ] }
			};
			leafBuffers = twgl.createBufferInfoFromArrays(drawingState.gl, arrLeafs);
			var arrHead = {
				vposH : { numComponents: 3, data: [
					        -0.5, 0.0, -0.5, // triangle 1
					        0.5, 0.0, -0.5,
					        0.0, 1.0, 0.0,

					        0.5, 0.0, -0.5, // triangle 2
					        0.5, 0.0, 0.5,
					        0.0, 1.0, 0.0,

					        0.5, 0.0, 0.5, // triangle 3
					        -0.5, 0.0, 0.5,
					        0.0, 1.0, 0.0,

					        -0.5, 0.0, 0.5, // triangle 4
					        -0.5, 0.0, -0.5,
					        0.0, 1.0, 0.0,
                ] }
			};
			headBuffers = twgl.createBufferInfoFromArrays(drawingState.gl, arrHead);
		}
	};
	Tree.prototype.draw = function(drawingState) {
		var modelM = twgl.m4.scaling([this.size,this.size,this.size]);
		twgl.m4.setTranslation(modelM,this.position,modelM);

		var gl = drawingState.gl;
		gl.useProgram(shaderProgram.program);
		twgl.setBuffersAndAttributes(gl,shaderProgram,);
		twgl.setUniforms(shaderProgram,{
			view:drawingState.view, proj:drawingState.proj, lightdir:drawingState.sunDirection,
			treecolor:this.colorTri, model:modelM });
		twgl.drawBufferInfo(gl, gl.TRIANGLES, stumpBuffers);
		twgl.drawBufferInfo(gl, gl.TRIANGLES, leafBuffers);
		twgl.drawBufferInfo(gl, gl.TRIANGLES, headBuffers);

	};
	Tree.prototype.center = function(drawingState) {
		return this.position;
	}
})();

// Render the objects

// Tree at orgin

// Tree1

// Tree2

// Tree3

// Tree4
