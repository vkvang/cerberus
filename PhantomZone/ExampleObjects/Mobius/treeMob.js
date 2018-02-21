// this defines the global list of objects
    // if it exists already, this is a redundant definition
    // if it isn't create a new array
var grobjects = grobjects || [];

// Constructor Cube
var Cube = undefined;
var Triangle = undefined;

// Adding object to list
(function() {
	"use strict";

	var shaderProgramC = undefined;
	var shaderProgramT = undefined;
	var buffCube = undefined;
	var buffTria = undefined;

	// Creating Tree Stump
	Cube = function Cube(name, position, size, color) {
		this.name= name;
		this.position= position || [0,0,0];
		this.size = size || 1.0;
		this.color = color || [1.0,1.0,1.0];
	}
	Cube.prototype.init = function(drawingState) {
		var gl=drawingState.gl;
		// impliment shader so can knows draw style
		if (!shaderProgramC) {
			shaderProgramC = twgl.createProgramInfo(gl, ["cube-vs", "cube-fs"]);
		}
		if (!buffCube) {
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
			buffCube = twgl.createBufferInfoFromArrays(drawingState.gl, arrays);
		}
	};
	Cube.prototype.draw = function(drawingState) {
		var modelM = twgl.m4.scaling([this.size,this.size,this.size]);
		twgl.m4.setTranslation(modelM,this.position,modelM);

		var gl = drawingState.gl;
		gl.useProgram(shaderProgramC.program);
		twgl.setBuffersAndAttributes(gl,shaderProgramC,buffCube);
		twgl.setUniforms(shaderProgramC,{
			view:drawingState.view, proj:drawingState.proj, lightdir:drawingState.sunDirection,
			cubecolor:this.color, model:modelM });
		twgl.drawBufferInfo(gl, gl.TRIANGLES, buffCube);
	};
	Cube.prototype.center = function(drawingState) {
		return this.position;
	}
	
	// Creating Triangles for Tree Greens
	Triangle = function Triangle(name, position, size, color) {
		this.name= name;
		this.position= position || [0,0,0];
		this.size = size || 1.0;
		this.colorTri = color || [1.0,1.0,1.0];
	}
	Triangle.prototype.init = function(drawingState) {
		var gl=drawingState.gl;
		// impliment shader so can knows draw style
		if (!shaderProgramT) {
			shaderProgramT = twgl.createProgramInfo(gl, ["trig-vs", "trig-fs"]);
		}
		if (!buffTria) {
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
			buffTria = twgl.createBufferInfoFromArrays(drawingState.gl, arrays);
		}
	};
	Triangle.prototype.draw = function(drawingState) {
		var modelM = twgl.m4.scaling([this.size,this.size,this.size]);
		twgl.m4.setTranslation(modelM,this.position,modelM);

		var gl = drawingState.gl;
		gl.useProgram(shaderProgramT.program);
		twgl.setBuffersAndAttributes(gl,shaderProgramT,buffTria);
		twgl.setUniforms(shaderProgramT,{
			view:drawingState.view, proj:drawingState.proj, lightdir:drawingState.sunDirection,
			trianglecolor:this.colorTri, model:modelM });
		twgl.drawBufferInfo(gl, gl.TRIANGLES, buffTria);
	};
	Triangle.prototype.center = function(drawingState) {
		return this.position;
	}
})();

// Render the objects

// Tree at orgin
grobjects.push(new Cube("trunk",[0,0.25,  0],0.5, [1.0,1.0,0.0]));

grobjects.push(new Triangle("treebase",[0,0.50,  0],1.25, [0.0,1.7,1.4]));
grobjects.push(new Triangle("treetop",[0,1.15,  0],0.85, [0.0,1.8,1.4]));

// Tree1
grobjects.push(new Cube("trunk",[4.0 ,0.25,  4.0],0.5, [1.0,1.0,0.0]));

grobjects.push(new Triangle("treebase",[4.0,0.50,  4.0],1.25, [0.0,1.7,1.4]));
grobjects.push(new Triangle("treetop",[4.0,1.15,  4.0],0.85, [0.0,1.8,1.4]));

// Tree2
grobjects.push(new Cube("trunk",[4.0 ,0.25,  -4.0],0.5, [1.0,1.0,0.0]));

grobjects.push(new Triangle("treebase",[4.0,0.50,  -4.0],1.25, [0.0,1.7,1.4]));
grobjects.push(new Triangle("treetop",[4.0,1.15,  -4.0],0.85, [0.0,1.8,1.4]));

// Tree3
grobjects.push(new Cube("trunk",[-4.0 ,0.25,  -4.0],0.5, [1.0,1.0,0.0]));

grobjects.push(new Triangle("treebase",[-4.0,0.50,  -4.0],1.25, [0.0,1.7,1.4]));
grobjects.push(new Triangle("treetop",[-4.0,1.15,  -4.0],0.85, [0.0,1.8,1.4]));

// Tree4
grobjects.push(new Cube("trunk",[-4.0 ,0.25,  4.0],0.5, [1.0,1.0,0.0]));

grobjects.push(new Triangle("treebase",[-4.0,0.50,  4.0],1.25, [0.0,1.7,1.4]));
grobjects.push(new Triangle("treetop",[-4.0,1.15,  4.0],0.85, [0.0,1.8,1.4]));