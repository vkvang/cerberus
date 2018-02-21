/**
 A Very Simple Textured Plane using native WebGL. 

 Notice that it is possible to only use twgl for math. 

 Also, due to security restrictions the image was encoded as a Base64 string. 
 It is very simple to use somthing like this (http://dataurl.net/#dataurlmaker) to create one
 then its as simple as 
     var image = new Image()
     image.src = <base64string>


 **/

var grobjects = grobjects || [];


(function() {
    "use strict";

    var vertexSource = ""+
        // "precision highp float;" +
        // "attribute vec3 aPosition;" +
        // "attribute vec3 aNormal;" +
        // "attribute vec2 aTexCoord;" +
        // "varying vec2 vTexCoord;" +
        // "uniform mat4 pMatrix;" +
        // "uniform mat4 vMatrix;" +
        // "uniform mat4 mMatrix;" +
        // "void main(void) {" +
        // "  gl_Position = pMatrix * vMatrix * mMatrix * vec4(aPosition, 1.0);" +
        // "  vTexCoord = aTexCoord;" +
        // "}";

        "attribute vec3 vPos;"+
        "attribute vec3 vNorm;"+
        "attribute vec3 vColor;"+
        "attribute vec2 vTexCoord;"+

        "varying vec3 fPos;"+
        "varying vec3 fColor;"+
        "varying vec3 fNorm;"+
        "varying vec2 fTexCoord;"+

        "uniform mat4 uMV;"+
        "uniform mat4 uMVP;"+
        "void main(void) {"+
        "   gl_Position = uMVP * vec4(vPos, 1.0);"+
        "   fPos = (uMV * vec4(vPos, 1.0)).xyz;"+
        "   fColor = vColor;"+
        "   fNorm = vNorm;"+
        "   fTexCoord = vTexCoord;"+
        "}";

    var fragmentSource = "" +
        // "precision highp float;" +
        // "varying vec2 vTexCoord;" +
        // "uniform sampler2D uTexture;" +
        // "void main(void) {" +
        // "  vec4 texColor2D = texture2D(uTexture, vTexCoord);" +
        // // "  //gl_FragColor = texture2D(uTexture, vTexCoord);" +
        // "  gl_FragColor = vec4(texColor2D.xyz, 1.0);" +
        // "}";
      "precision highp float;"+
      "varying vec3 fPos;"+
      "varying vec3 fColor;"+
      "varying vec3 fNorm;"+
      "varying vec2 fTexCoord;"+
      "uniform mat4 uMVn;"+
      "uniform sampler2D texSampler1;"+
      "uniform sampler2D texSampler2;"+

      "const vec3  lightV    = vec3(0.0,0.0,1.0);"+
      "const float lightI    = 1.0;"+               // only for diffuse component
      "const float ambientC  = 0.15;"+
      "const float diffuseC  = 0.3;"+
      "const float specularC = 1.0;"+
      "const float specularE = 16.0;"+
      "const vec3  lightCol  = vec3(1.0,1.0,1.0);"+
      "const vec3  objectCol = vec3(1.0,0.6,0.0);"+ // yellow-ish orange
      "vec2 blinnPhongDir(vec3 lightDir, vec3 n, float lightInt, float Ka,"+
      "  float Kd, float Ks, float shininess) {"+
      "  vec3 s = normalize(lightDir);"+
      "  vec3 v = normalize(-fPos);"+
      "  vec3 h = normalize(v+s);"+
      "  float diffuse = Ka + Kd * lightInt * max(0.0, dot(n, s));"+
      "  float spec =  Ks * pow(max(0.0, dot(n,h)), shininess);"+
      "  return vec2(diffuse, spec);"+
      "}"+

      "void main(void) {"+
      "  vec3 dNormal=texture2D(texSampler2,fTexCoord).xyz;"+
      "  vec3 n_perturbed = normalize(dNormal+fNorm);"+
      "  vec3 n = (uMVn * vec4(n_perturbed, 0.0)).xyz;"+
      "  vec3 ColorS  = blinnPhongDir(lightV,n,0.0   ,0.0,     0.0,     specularC,specularE).y*lightCol;"+
      "  vec3 ColorAD = blinnPhongDir(lightV,n,lightI,ambientC,diffuseC,0.0,      1.0      ).x*fColor;"+
      "  gl_FragColor = vec4(ColorAD+ColorS,1.0);"+
      "}";


    var vPos = new Float32Array([
                    -.5,-.5,-.5,  .5,-.5,-.5,  .5, .5,-.5,        -.5,-.5,-.5,  .5, .5,-.5, -.5, .5,-.5,    // z = 0
                    -.5,-.5, .5,  .5,-.5, .5,  .5, .5, .5,        -.5,-.5, .5,  .5, .5, .5, -.5, .5, .5,    // z = 1
                    -.5,-.5,-.5,  .5,-.5,-.5,  .5,-.5, .5,        -.5,-.5,-.5,  .5,-.5, .5, -.5,-.5, .5,    // y = 0
                    -.5, .5,-.5,  .5, .5,-.5,  .5, .5, .5,        -.5, .5,-.5,  .5, .5, .5, -.5, .5, .5,    // y = 1

                    // Not being shown??
                    -.5,-.5,-.5, -.5, .5,-.5, -.5, .5, .5,        -.5,-.5,-.5, -.5, .5, .5, -.5,-.5, .5,    // x = 0
                     .5,-.5,-.5,  .5, .5,-.5,  .5, .5, .5,         .5,-.5,-.5,  .5, .5, .5,  .5,-.5, .5     // x = 1          
    ]);

    // For when implimenting the shading/lighting
    var vNormal = new Float32Array([
                    0,0,-1, 0,0,-1, 0,0,-1,     0,0,-1, 0,0,-1, 0,0,-1,
                    0,0,1, 0,0,1, 0,0,1,        0,0,1, 0,0,1, 0,0,1,
                    0,-1,0, 0,-1,0, 0,-1,0,     0,-1,0, 0,-1,0, 0,-1,0,
                    0,1,0, 0,1,0, 0,1,0,        0,1,0, 0,1,0, 0,1,0,
                    -1,0,0, -1,0,0, -1,0,0,     -1,0,0, -1,0,0, -1,0,0,
                    1,0,0, 1,0,0, 1,0,0,        1,0,0, 1,0,0, 1,0,0,
    ]);

    var vtexture = new Float32Array([
           0, 0,   1, 0,   1, 1,   0, 1,
           1, 0,   1, 1,   0, 1,   0, 0,
           0, 1,   0, 0,   1, 0,   1, 1,
           0, 0,   1, 0,   1, 1,   0, 1,
           1, 1,   0, 1,   0, 0,   1, 0,
           1, 1,   0, 1,   0, 0,   1, 0 
    ]);

    //useful util function to simplify shader creation. type is either gl.VERTEX_SHADER or gl.FRAGMENT_SHADER
    var createGLShader = function (gl, type, src) {
        var shader = gl.createShader(type)
        gl.shaderSource(shader, src);
        gl.compileShader(shader);
        if(!gl.getShaderParameter(shader, gl.COMPILE_STATUS)){
            console.log("warning: shader failed to compile!")
            console.log(gl.getShaderInfoLog(shader));
            return null;
        }

        return shader;
    }

    //see above comment on how this works. 
    var image = new Image();
    image.src = "data:image/png;base64,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"

    //useful util function to return a glProgram from just vertex and fragment shader source.
    var createGLProgram = function (gl, vSrc, fSrc) {
        var program = gl.createProgram();
        var vShader = createGLShader(gl, gl.VERTEX_SHADER, vSrc);
        var fShader = createGLShader(gl, gl.FRAGMENT_SHADER, fSrc);
        gl.attachShader(program, vShader);
        gl.attachShader(program, fShader);
        gl.linkProgram(program);

        if(!gl.getProgramParameter(program, gl.LINK_STATUS)){
            console.log("warning: program failed to link");
            return null;

        }
        return program;
    }

    //creates a gl buffer and unbinds it when done. 
    var createGLBuffer = function (gl, data, usage) {
        var buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        gl.bufferData(gl.ARRAY_BUFFER, data, usage);
        gl.bindBuffer(gl.ARRAY_BUFFER, null);
        return buffer;
    }

    var findAttribLocations = function (gl, program, attributes) {
        var out = {};
        for(var i = 0; i < attributes.length;i++){
            var attrib = attributes[i];
            out[attrib] = gl.getAttribLocation(program, attrib);
        }
        return out;
    }

    var findUniformLocations = function (gl, program, uniforms) {
        var out = {};
        for(var i = 0; i < uniforms.length;i++){
            var uniform = uniforms[i];
            out[uniform] = gl.getUniformLocation(program, uniform);
        }
        return out;
    }

    var enableLocations = function (gl, attributes) {
        for(var key in attributes){
            var location = attributes[key];
            gl.enableVertexAttribArray(location);
        }
    }

    //always a good idea to clean up your attrib location bindings when done. You wont regret it later. 
    var disableLocations = function (gl, attributes) {
        for(var key in attributes){
            var location = attributes[key];
            gl.disableVertexAttribArray(location);
        }
    }

    //creates a gl texture from an image object. Sometiems the image is upside down so flipY is passed to optionally flip the data.
    //it's mostly going to be a try it once, flip if you need to. 
    var createGLTexture = function (gl, image, flipY) {
        var texture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, texture);
        if(flipY){
            gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
        }
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER,  gl.NEAREST);
        gl.generateMipmap(gl.TEXTURE_2D);
        gl.bindTexture(gl.TEXTURE_2D, null);
        return texture;
    }

    var cnt = 0;

     var TexturedCube = function () {
        this.name = "TexturedCube"+cnt;
        this.position = new Float32Array([0, 0, 0]);
        this.scale = new Float32Array([1, 1, 1]);
        this.angle = 1;
        this.program = null;
        this.attributes = null;
        this.uniforms = null;
        this.buffers = [null, null, null];
        this.texture = null;
    }

    TexturedCube.prototype.init = function (drawingState) {
        var gl = drawingState.gl;

        this.program = createGLProgram(gl, vertexSource, fragmentSource);
        this.attributes = findAttribLocations(gl, this.program, ["aPosition", "aTexCoord"]);
        this.uniforms = findUniformLocations(gl, this.program, ["pMatrix", "vMatrix", "mMatrix", "uTexture"]);

        this.texture = createGLTexture(gl, image, true);

        this.buffers[0] = createGLBuffer(gl, vPos, gl.STATIC_DRAW);
        this.buffers[1] = createGLBuffer(gl, vNormal, gl.STATIC_DRAW);
        this.buffers[2] = createGLBuffer(gl, vtexture, gl.STATIC_DRAW);

    }

    TexturedCube.prototype.center = function () {
        return this.position;
    }

    TexturedCube.prototype.draw = function (drawingState) {
        var gl = drawingState.gl;

        gl.useProgram(this.program);
        gl.disable(gl.CULL_FACE);

        var modelM = twgl.m4.multiply(twgl.m4.scaling([this.scale[0],this.scale[1], this.scale[2], 1]),
            twgl.m4.axisRotation([0,1,0],this.angle));
        twgl.m4.setTranslation(modelM,this.position, modelM);

        gl.enable(gl.DEPTH_TEST);

        gl.uniformMatrix4fv(this.uniforms.pMatrix, gl.FALSE, drawingState.proj);
        gl.uniformMatrix4fv(this.uniforms.vMatrix, gl.FALSE, drawingState.view);
        gl.uniformMatrix4fv(this.uniforms.mMatrix, gl.FALSE, modelM);

        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, this.texture);
        gl.uniform1i(this.uniforms.uTexture, 0);


        enableLocations(gl, this.attributes);

        // vPos
        gl.bindBuffer(gl.ARRAY_BUFFER, this.buffers[0]);
        gl.vertexAttribPointer(this.attributes.aPosition, 3, gl.FLOAT, false, 0, 0);

        // // vNormal
         gl.bindBuffer(gl.ARRAY_BUFFER, this.buffers[1]);
         gl.vertexAttribPointer(this.attributes.aNormal, 3, gl.FLOAT, false, 0, 0);

        // vTexture
        gl.bindBuffer(gl.ARRAY_BUFFER, this.buffers[2]);
        gl.vertexAttribPointer(this.attributes.aTexCoord, 2, gl.FLOAT, false, 0, 0);


        gl.drawArrays(gl.TRIANGLES, 0, 24);
        //gl.drawArrays(gl.TRIANGLES, 25, 36);
        //gl.drawArrays(gl.TRIANGLES, 0, 36);
        
        //console.log(this.buffers)

        //twgl.setBuffersAndAttributes(gl, this.program, this.buffers);
        //twgl.drawBufferInfo(gl, gl.TRIANGLES, this.buffers);
        //gl.drawElements(gl.TRIANGLES, 24, gl.UNSIGNED_BYTE, 0);
        //gl.drawElements(gl.TRIANGLES, 36, gl.UNSIGNED_BYTE, 0);

        disableLocations(gl, this.attributes);
    }


    var test = new TexturedCube();
        test.position = [3,.3,2];
        test.scale = [1.25, .5, .5];
        test.angle = 4;
        cnt++;

    grobjects.push(test);

    var test = new TexturedCube();
        test.position = [-3,.3,-2];
        test.scale = [1.25, .5, .5];
        test.angle = 4;
        cnt++;
        
    grobjects.push(test);

    var test = new TexturedCube();
        test.position = [2,.3,-3];
        test.scale = [1.25, .5, .5];
        test.angle = -4;
        cnt++;
        
    grobjects.push(test);

    var test = new TexturedCube();
        test.position = [-2,.3,3];
        test.scale = [1.25, .5, .5];
        test.angle = -4;
        cnt++;
        
    grobjects.push(test);

})();