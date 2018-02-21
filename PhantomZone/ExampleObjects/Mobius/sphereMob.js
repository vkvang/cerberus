// this defines the global list of objects
    // if it exists already, this is a redundant definition
    // if it isn't create a new array
var grobjects = grobjects || [];

// Constructor
var Sphere = undefined;

// Adding object to list
(function() {
	"use strict";

	var shaderProgram = undefined;

	var latBands = 30;
	var longBands = 30;
	var radius = 0.3;

	var buffers;

	Sphere = function Sphere(name, position, size, color) {
		this.name= name;
		this.position= position || [0,0,0];
		this.size = size || 1.0;
		this.color = color || [0.0,0.0,0.0];
	}

	var vertPosData = [];
	var normData = [];
	var textData = [];

	for (var latN = 0; latN <= latBands; latN++) {
		var theta = latN * Math.PI / latBands;
		var sinTheta = Math.sin(theta);
		var cosTheta = Math.cos(theta);

		for (var longN = 0; longN <= longBands; longN++) {
			var phi = longN * 2 * Math.PI / longBands;
			var sinPhi = Math.sin(phi);
			var cosPhi = Math.cos(phi);

			var x = cosPhi * sinTheta;
			var y = cosTheta;
			var z = sinPhi * sinTheta;
			var u = 1- (longN/longBands);
			var v = latN/latBands;

			normData.push(x);
			normData.push(y);
			normData.push(z);
			textData.push(u);
			textData.push(v);
			vertPosData.push(radius * x);
			vertPosData.push(radius * y);
			vertPosData.push(radius * z);
		}
	}
	var indexData = [];
	for (var latN = 0; latN < latBands; latN++) {
	    for (var longN = 0; longN < longBands; longN++) {
	        var first = (latN * (longBands + 1)) + longN;
	        var second = first + longBands + 1;
	        indexData.push(first);
	        indexData.push(second);
	       	indexData.push(first+1);
	        indexData.push(second);
	        indexData.push(second+1);
	       	indexData.push(first+1);
	    }
	}

	Sphere.prototype.init = function(drawingState) {
		var gl=drawingState.gl;
		// impliment shader so can knows draw style
		if (!shaderProgram) {
			shaderProgram = twgl.createProgramInfo(gl, ["sphere-vs", "sphere-fs"]);
		}
		if (!buffers) {
			var arrays = {
				vText : { numComponents: 2, data: textData
				},
				vpos : { numComponents: 3, data: vertPosData
				},
                vnormal : { numComponents: 3, data: normData
                },
                vindex : { numComponents: 3, data: indexData
                },
			};
			buffers = twgl.createBufferInfoFromArrays(drawingState.gl, arrays);
		}
	};
	Sphere.prototype.draw = function(drawingState) {
		var modelM = twgl.m4.scaling([this.size,this.size,this.size]);
		twgl.m4.setTranslation(modelM,this.position,modelM);

		var gl = drawingState.gl;
		gl.useProgram(shaderProgram.program);
		twgl.setBuffersAndAttributes(gl,shaderProgram,buffers);
		twgl.setUniforms(shaderProgram,{
			view:drawingState.view, proj:drawingState.proj, lightdir:drawingState.sunDirection,
			spherecolor:this.color, model:modelM });
		twgl.drawBufferInfo(gl, gl.TRIANGLE_FAN, buffers);
	};
	Sphere.prototype.center = function(drawingState) {
		return this.position;
	}
})();

// Render the objects
grobjects.push(new Sphere("origin",[0.0,2.0,0.0],0.9, [0.65,0.0,0.65]));

