// this defines the global list of objects
    // if it exists already, this is a redundant definition
    // if it isn't create a new array
var grobjects = grobjects || [];

// Constructor Cube
var Tree = undefined;

// Adding object to list
(function() {
	"use strict";

	var shaderProgramL = undefined;
	var shaderProgramT = undefined;
	var bufferHead = undefined;
	var bufferStump = undefined;

	var treeNum = 0;

	// Creating Tree Stump
	Tree = function Tree(position, size) {
		this.name= "tree"+treeNum++;
		this.position= position || [0,0,0];
		this.size = size || 1.0;
		this.colrLeaf = [0.0,1.7,1.4];
		this.colrTrunk = [1.0,1.0,0.0];
	}
	Tree.prototype.init = function(drawingState) {
		var gl=drawingState.gl;
		// impliment shader so can knows draw style
		if (!shaderProgramL) {
			shaderProgramL = twgl.createProgramInfo(gl, ["general-vs", "general-fs"]);
		}
		if (!shaderProgramT) {
			shaderProgramT = twgl.createProgramInfo(gl, ["general-vs", "general-fs"]);
		}
		if (!bufferStump) {
			var arraystump = {
				vpos : { numComponents: 3, data: [
                    -.5,-.5,-.5,  .5,-.5,-.5,  .5, .5,-.5,        -.5,-.5,-.5,  .5, .5,-.5, -.5, .5,-.5,    // z = 0
                    -.5,-.5, .5,  .5,-.5, .5,  .5, .5, .5,        -.5,-.5, .5,  .5, .5, .5, -.5, .5, .5,    // z = 1
                    -.5,-.5,-.5,  .5,-.5,-.5,  .5,-.5, .5,        -.5,-.5,-.5,  .5,-.5, .5, -.5,-.5, .5,    // y = 0
                    -.5, .5,-.5,  .5, .5,-.5,  .5, .5, .5,        -.5, .5,-.5,  .5, .5, .5, -.5, .5, .5,    // y = 1
                    -.5,-.5,-.5, -.5, .5,-.5, -.5, .5, .5,        -.5,-.5,-.5, -.5, .5, .5, -.5,-.5, .5,    // x = 0
                     .5,-.5,-.5,  .5, .5,-.5,  .5, .5, .5,         .5,-.5,-.5,  .5, .5, .5,  .5,-.5, .5     // x = 1
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
                ]}
			};
			bufferHead = twgl.createBufferInfoFromArrays(drawingState.gl, arrayhead);
		}
	};
	Tree.prototype.draw = function(drawingState) {
		var modelM = twgl.m4.scaling([this.size,this.size,this.size]);
		twgl.m4.setTranslation(modelM,this.position,modelM);

		var gl = drawingState.gl;

		// Tree Leaves
		gl.useProgram(shaderProgramL.program);
		twgl.setBuffersAndAttributes(gl,shaderProgramL,bufferHead);
		twgl.setUniforms(shaderProgramL, {
			view:drawingState.view, proj:drawingState.proj, lightdir:drawingState.sunDirection,
			trianglecolor:this.colrLeaf, model:modelM }); 
		twgl.drawBufferInfo(gl, gl.TRIANGLES, bufferHead);

		// Tree Trunk
		// gl.useProgram(shaderProgramT.program);
		// twgl.setBuffersAndAttributes(gl,shaderProgramT,bufferStump);
		// twgl.setUniforms(shaderProgramT,{
		// 	view:drawingState.view, proj:drawingState.proj, lightdir:drawingState.sunDirection,
		// 	color:this.colrTrunk, model:modelM });
		// twgl.drawBufferInfo(gl, gl.TRIANGLES, bufferStump);
	};
	Tree.prototype.center = function(drawingState) {
		return this.position;
	}
})();

// Render the objects

// Tree at orgin
grobjects.push(new Tree([0,0,0],0.5));

// Tree1


// Tree2


// Tree3


// Tree4


