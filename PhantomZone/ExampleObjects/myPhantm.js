// this defines the global list of objects
    // if it exists already, this is a redundant definition
    // if it isn't create a new array
var grobjects = grobjects || [];

// Constructor
var Alien = undefined;

// Adding object to list
(function() {
	"use strict";

	var shaderProgram = undefined;

	var latBands = 30;
	var longBands = 30;
	var radius = 0.3;

	var buffers;
	var buffBod;
	var buffArm;
	var numb = 0;

	// Constructor for points
	Point = function Point(position) {
		this.name = "point"+numb++;
		this.position = position || [0.75,0.0,0.0];
		this.point = true;
		this.ptHeight = 0.9;
	}
	// Random Points
	var mylistCoord = [];

	for (var i = 0; i <= 10; i++){
		var posit = [getRandomInt(-4,4),
			getRandomInt(-4,4),getRandomInt(-4,4)];
		mylistCoord.push(new Point(posit));
	}

	Alien = function Alien(name, position, size, color) {
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

	Alien.prototype.init = function(drawingState) {
		var gl=drawingState.gl;
		// impliment shader so can knows draw style
		if (!shaderProgram) {
			shaderProgram = twgl.createProgramInfo(gl, ["general-vs", "general-fs"]);
		}
		if (!buffers) {
			// Head Points
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

			// Body Points
			var arrBod = {
				vpos : { numComponents: 3, data: [
					-0.2, -0.3, -0.2, // triangle 1
					 0.2, -0.3, -0.2,
					 0.0, -1.0, 0.0,

					 0.2, -0.3, -0.2, // triangle 2
					 0.2, -0.3, 0.2,
					 0.0, -1.0, 0.0,

					 0.2, -0.3, 0.2, // triangle 3
					-0.2, -0.3, 0.2,
					 0.0, -1.0, 0.0,

					-0.2, -0.3, 0.2, // triangle 4
					-0.2, -0.3, -0.2,
					 0.0, -1.0, 0.0,
				]},
				vnormal : { numComponents: 3, data: [
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
			};
			buffBod = twgl.createBufferInfoFromArrays(drawingState.gl, arrBod);
		}
		this.lastpt = randomPoint();
		this.state = 0;
		this.wait = getRandomInt(250,750);
		this.lastTime = 0;
	};


	Alien.prototype.draw = function(drawingState) {
		advance(this,drawingState);
		var modelM = twgl.m4.scaling([this.size,this.size,this.size]);
		twgl.m4.setTranslation(modelM,this.position,modelM);

		var gl = drawingState.gl;
		gl.useProgram(shaderProgram.program);
		twgl.setUniforms(shaderProgram,{
			view:drawingState.view, proj:drawingState.proj, lightdir:drawingState.sunDirection,
			color:this.color, model:modelM });
		// Head
		twgl.setBuffersAndAttributes(gl,shaderProgram,buffers);
		twgl.drawBufferInfo(gl, gl.TRIANGLE_FAN, buffers);
		// Body
		twgl.setBuffersAndAttributes(gl,shaderProgram,buffBod);
		twgl.drawBufferInfo(gl, gl.TRIANGLE_FAN, buffBod);
	};
	Alien.prototype.center = function(drawingState) {
		return this.position;
	}

	// ====== Add Mobility ====== //

	// constant speed
	var height = 0.3;
	var speed = 3/ 1000;

	function getRandomInt(min,max) {
		return Math.floor(Math.random() * (max-min)) + min;
	}

	function randomPoint(exclude) {

		var index = getRandomInt(0,10);
		if (index != exclude){
			return mylistCoord[index];
		} else {
			return randomPoint(exclude);
		}
		
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
grobjects.push(new Alien("alien",[-1.0,0.9,-1.0],0.9, [0.65,0.5,0.65]));






