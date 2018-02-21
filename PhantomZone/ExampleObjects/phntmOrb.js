// this defines the global list of objects
    // if it exists already, this is a redundant definition
    // if it isn't create a new array
var grobjects = grobjects || [];

// Constructor
var Sphere = undefined;
var Point = undefined;

// Adding object to list
(function() {
	"use strict";

	var shaderProgram = undefined;

	var latBands = 100;
	var longBands = 100;
	var radius = 0.3;

	var buffers = undefined;

	// For points of destination
	var ptBuffers = undefined;
	var numb = 0;

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
			shaderProgram = twgl.createProgramInfo(gl, ["general-vs", "general-fs"]);
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

		this.lastpt = randomPoint();
		this.position = twgl.v3.add(this.lastpt.center(),[0,0.1+this.lastpt.ptHeight,0]);
		this.state = 0;
		this.wait = getRandomInt(250,750);
		this.lastTime = 0;
	};
	Sphere.prototype.draw = function(drawingState) {

		advance(this,drawingState);

		var modelM = twgl.m4.scaling([this.size,this.size,this.size]);
		twgl.m4.setTranslation(modelM,this.position,modelM);

		var gl = drawingState.gl;
		gl.useProgram(shaderProgram.program);
		twgl.setBuffersAndAttributes(gl,shaderProgram,buffers);
		twgl.setUniforms(shaderProgram,{
			view:drawingState.view, proj:drawingState.proj, lightdir:drawingState.sunDirection,
			color:this.color, model:modelM });
		twgl.drawBufferInfo(gl, gl.TRIANGLE_FAN, buffers);
	};
	Sphere.prototype.center = function(drawingState) {
		return this.position;
	}

	// Constructor for points
	Point = function Point(position) {
		this.name = "point"+numb++;
		this.position = position || [0.75,0.0,0.0];
		this.size = 0.35;
		this.point = true;
		this.ptHeight = 0;
	}
	Point.prototype.init = function(drawingState) {
		var gl=drawingState.gl;
		var q = .25;

		// Point Set-up for shaders
		if (!shaderProgram) {
        shaderProgram = twgl.createProgramInfo(gl, ["general-vs", "general-fs"]);
    	}
    	if(!ptBuffers) {
    		var arrays = {
    			vpos : { numComponents: 3, data: [
                    -.5,-.5,-.5,  .5,-.5,-.5,  .5,-.5, .5,        
                    -.5,-.5,-.5,  .5,-.5, .5, -.5,-.5, .5,    // y = 0
                ] },
                vnormal : {numComponents:3, data: [
                    0,-1,0, 0,-1,0, 0,-1,0,     0,-1,0, 0,-1,0, 0,-1,0
                ]}
    		};
    		ptBuffers = twgl.createBufferInfoFromArrays(drawingState.gl,arrays);
    	}
	};
	Point.prototype.draw = function(drawingState) {
        var modelM = twgl.m4.scaling([this.size,this.size,this.size]);
        twgl.m4.setTranslation(modelM,this.position,modelM);

        var gl = drawingState.gl;
        gl.useProgram(shaderProgram.program);
        twgl.setUniforms(shaderProgram,{
            view:drawingState.view, proj:drawingState.proj, lightdir:drawingState.sunDirection,
            color:[0,1,13], model: modelM });
        twgl.setBuffersAndAttributes(gl,shaderProgram,ptBuffers);
        twgl.drawBufferInfo(gl, gl.TRIANGLES, ptBuffers);
	};
	Point.prototype.center = function(drawingState) {
		return this.position;
	}

// ===========  Moving around =========== //

// constant speed
	var height = 0.3;
	var speed = 3/ 1000;

	function getRandomInt(min,max) {
		return Math.floor(Math.random() * (max-min)) + min;
	}

	function randomPoint(exclude) {
		var points = grobjects.filter(function(obj) { return (obj.point && (obj!=exclude))});
		if (!points.length) {
			throw("No Points for traversal!");
		}
		var index = getRandomInt(0,points.length);
		return points[index];
	}

	function advance(pt, drawingState) {
		if (!pt.lastTime) {
			pt.lastTime = drawingState.realtime;
			return;
		}
		var delta = drawingState.realtime - pt.lastTime;
		pt.lastTime = drawingState.realtime;

		switch (pt.state) {
		    case 0: // Waiting at Point
		        if (pt.wait > 0) { pt.wait -= delta; 
		        } else {
		            pt.state = 1;
		            pt.wait = 0;
		        }
		        break;
		    case 1: // Taking off
		        if (pt.position[1] < height) {
		            pt.position[1] = height;
		        } else {
		            var dest = randomPoint(pt.lastpt);
		            pt.lastpt = dest;

		            pt.dx = dest.position[0] - pt.position[0];
		            pt.dz = dest.position[2] - pt.position[2];
		            pt.dst = Math.sqrt(pt.dx * pt.dx + pt.dz * pt.dz);
		            if (pt.dst < .01) {
		                pt.position[0] = dest.position[0];
		                pt.position[2] = dest.position[2];
		                pt.state = 3;
		            } else {
		                pt.vx = pt.dx / pt.dst;
		                pt.vz = pt.dz / pt.dst;
		            }
		            pt.state = 2;
		        }
		    case 2: // Fly towards goal
		        if (pt.dst > .01) {
		            var go = delta * speed;
		            // Don't exceed goal
		            go = Math.min(pt.dst, go);
		            pt.position[0] += pt.vx * go;
		            pt.position[2] += pt.vz * go;
		            pt.dst -= go;
		        } else { // Go small distance
		            pt.position[0] = pt.lastpt.position[0];
		            pt.position[2] = pt.lastpt.position[2];
		            pt.state = 3;
		        }
		        break;
		    case 3: // Reach goal
		        var dest = pt.lastpt.position[1] + 0.5 + pt.lastpt.height;
		        if (pt.position > dest) {
		            pt.position[1] = dest;
		        } else {
		            pt.state = 0;
		            pt.wait = getRandomInt(500, 1000);
		        }
		        break;
}
	}
})();

// Render the objects
grobjects.push(new Sphere("Homosapien",[],0.85, [4.65,0.0,0.0]));

grobjects.push(new Point([3.5,0.2,3.5]));
grobjects.push(new Point([3.5,0.2,-3.5]));
grobjects.push(new Point([-3.5,0.2,3.5]));
grobjects.push(new Point([-3.5,0.2,-3.5]));

