// this defines the global list of objects
    // if it exists already, this is a redundant definition
    // if it isn't create a new array
var grobjects = grobjects || [];

// Constructor Cube
var Cube = undefined;

// Adding object to list
(function() {
	"use strict";

	var shaderProgram = undefined;
	var buffers = undefined;

	Cube = function Cube(name, position, size, color) {
		this.name= name;
		this.position= position || [0,0,0];
		this.size = size || 1.0;
		this.color = color || [1.0,1.0,1.0];
	}
	Cube.prototype.init = function(drawingState) {
		var gl=drawingState.gl;
		// impliment shader so can knows draw style
		if (!shaderProgram) {
			shaderProgram = twgl.createProgramInfo(gl, ["cube-vs", "cube-fs"]);
		}
		if (!buffers) {
			var arrays = {
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
			buffers = twgl.createBufferInfoFromArrays(drawingState.gl, arrays);
		}
	};
	Cube.prototype.draw = function(drawingState) {
		var modelM = twgl.m4.scaling([this.size,this.size,this.size]);
		twgl.m4.setTranslation(modelM,this.position,modelM);

		var gl = drawingState.gl;
		gl.useProgram(shaderProgram.program);
		twgl.setBuffersAndAttributes(gl,shaderProgram,buffers);
		twgl.setUniforms(shaderProgram,{
			view:drawingState.view, proj:drawingState.proj, lightdir:drawingState.sunDirection,
			cubecolor:this.color, model:modelM });
		twgl.drawBufferInfo(gl, gl.TRIANGLES, buffers);
	};
	Cube.prototype.center = function(drawingState) {
		return this.position;
	}
})();

// Render the objects

// Totem1 [Pink]
grobjects.push(new Cube("cube1",[2.0,0.35,  2.0],0.75, [2.0,2.3,0.4]));
grobjects.push(new Cube("cube1-2",[2.0,0.7,  2.0],0.5, [2.0,2.3,0.4]));
grobjects.push(new Cube("cube1-3",[2.0,0.95,  2.0],0.25, [2.0,2.3,0.4]));
// Totem2 [Blue]
grobjects.push(new Cube("cube2",[-2.0,0.35,  2.0],0.75, [0.0,2.0,5.4]));
grobjects.push(new Cube("cube2-2",[-2.0,0.7,  2.0],0.5, [0.0,2.0,5.4]));
grobjects.push(new Cube("cube2-3",[-2.0,0.95,  2.0],0.25, [0.0,2.0,5.4]));
// Totem3 [Black]
grobjects.push(new Cube("cube3",[-2.0,0.35,  -2.0],0.75, [0.0,0.3,0.4]));
grobjects.push(new Cube("cube3-2",[-2.0,0.7,  -2.0],0.5, [0.0,0.3,0.4]));
grobjects.push(new Cube("cube3-3",[-2.0,0.95,  -2.0],0.25, [0.0,0.3,0.4]));
// Totem4 [Yellow]
grobjects.push(new Cube("cube4",[2.0,0.35,  -2.0],0.75, [3.0,1.0,2.4]));
grobjects.push(new Cube("cube4-2",[2.0,0.7,  -2.0],0.5, [3.0,1.0,2.4]));
grobjects.push(new Cube("cube4-3",[2.0,0.95,  -2.0],0.25, [3.0,1.0,2.4]));

