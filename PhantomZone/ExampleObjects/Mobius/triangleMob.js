// this defines the global list of objects
    // if it exists already, this is a redundant definition
    // if it isn't create a new array
var grobjects = grobjects || [];

// Constructor Cube
var Triangle = undefined;

// Adding object to list
(function() {
	"use strict";

	var shaderProgram = undefined;
	var buffers = undefined;

	Triangle = function Triangle(name, position, size, color) {
		this.name= name;
		this.position= position || [0,0,0];
		this.size = size || 1.0;
		this.color = color || [1.0,1.0,1.0];
	}
	Triangle.prototype.init = function(drawingState) {
		var gl=drawingState.gl;
		// impliment shader so can knows draw style
		if (!shaderProgram) {
			shaderProgram = twgl.createProgramInfo(gl, ["general-vs", "general-fs"]);
		}
		if (!buffers) {
			var arrays = {
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
                ] }
			};
			buffers = twgl.createBufferInfoFromArrays(drawingState.gl, arrays);
		}
	};
	Triangle.prototype.draw = function(drawingState) {
		var modelM = twgl.m4.scaling([this.size,this.size,this.size]);
		twgl.m4.setTranslation(modelM,this.position,modelM);

		var gl = drawingState.gl;
		gl.useProgram(shaderProgram.program);
		twgl.setBuffersAndAttributes(gl,shaderProgram,buffers);
		twgl.setUniforms(shaderProgram,{
			view:drawingState.view, proj:drawingState.proj, lightdir:drawingState.sunDirection,
			trianglecolor:this.color, model:modelM });
		twgl.drawBufferInfo(gl, gl.TRIANGLES, buffers);
	};
	Triangle.prototype.center = function(drawingState) {
		return this.position;
	}
})();

// Render the objects
// Totem 1
grobjects.push(new Triangle("totem1",[2.0,1.0,  2.0],0.5, [2.0,2.3,0.4]));
// Totem 2
grobjects.push(new Triangle("totem2",[-2.0,1.0,  2.0],0.5, [0.0,2.0,4.4]));
// Totem 3
grobjects.push(new Triangle("totem3",[-2.0,1.0,  -2.0],0.5, [0.0,0.3,0.4]));
// Totem 4
grobjects.push(new Triangle("totem4",[2.0,1.0,  -2.0],0.5, [4.0,0.0,2.4]));

