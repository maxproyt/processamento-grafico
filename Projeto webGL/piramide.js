

var vertexShaderText = 
[
'precision mediump float;',
'',
'attribute vec3 vertPosition;',
'attribute vec3 vertColor;',
'varying vec3 fragColor;',
'uniform mat4 mWorld;',
'uniform mat4 mView;',
'uniform mat4 mProj;',
'',
'void main()',
'{',
' fragColor = vertColor;',
' gl_Position = mProj * mView * mWorld * vec4(vertPosition, 1.0);',
'}'
].join('\n');

var fragmentShaderText =
[
'precision mediump float;',
'',
'varying vec3 fragColor;',
'void main()',
'{',
' gl_FragColor = vec4(fragColor, 1.0);',
'}'
].join('\n');

var InitDemo = function (){
    console.log('This is working');

    var canvas = document.getElementById('game-surface');
    var gl = canvas.getContext('webgl');
    
    if (!gl){
    	console.log('webgl not supported');
    	gl = canvas.getContext('experimental-webgl');
    }
    
    if (!gl){
    	alert('Does not support webgl');
    }
    
    var mat4 = glMatrix.mat4;
    
    var matrix = mat4.create();
    console.log(matrix);
    
    gl.clearColor(0.75, 0.8, 0.85, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.enable(gl.DEPTH_TEST);
    gl.disable(gl.CULL_FACE); // Desativar culling
    
    var vertexShader = gl.createShader(gl.VERTEX_SHADER);
    var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
    
    gl.shaderSource(vertexShader, vertexShaderText);
    gl.shaderSource(fragmentShader, fragmentShaderText);
    
    gl.compileShader(vertexShader);
    if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)){
    	console.error('ERROR compiling', gl.getShaderInfoLog(vertexShader));
    	return;
    }
    gl.compileShader(fragmentShader);
    if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)){
    	console.error('ERROR compiling', gl.getShaderInfoLog(fragmentShader));
    	return;
    }
    
    var program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    
    if(!gl.getProgramParameter(program, gl.LINK_STATUS)){
    	console.error('ERROR compiling program');
    	return;
    }
    
    gl.validateProgram(program);
    if(!gl.getProgramParameter(program, gl.VALIDATE_STATUS)){
    	console.error('ERROR validating program');
    	return;
    }
    
    var pyramidVertices = 
    	[ // X, Y, Z           R, G, B
		// Base (square)
		-1.0, -1.0, -1.0,   0.5, 0.5, 0.5,
		1.0, -1.0, -1.0,    0.5, 0.5, 0.5,
		1.0, -1.0, 1.0,     0.5, 0.5, 0.5,
		-1.0, -1.0, 1.0,    0.5, 0.5, 0.5,

		// Apex
		0.0, 1.0, 0.0,      1.0, 0.0, 0.0, // Top point (red)
	];
	
	var pyramidIndices =
	[
		// Base
		0, 1, 2,
		0, 2, 3,

		// Sides
		0, 1, 4, // Side 1
		1, 2, 4, // Side 2
		2, 3, 4, // Side 3
		3, 0, 4  // Side 4
	];
	
    var pyramidVertexBufferObject = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, pyramidVertexBufferObject);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(pyramidVertices), gl.STATIC_DRAW);
    
    var pyramidIndexBufferObject = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, pyramidIndexBufferObject);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(pyramidIndices), gl.STATIC_DRAW);
    
    var positionAttribLocation = gl.getAttribLocation(program, 'vertPosition');
    var colorAttribLocation = gl.getAttribLocation(program, 'vertColor');
    gl.vertexAttribPointer(
        positionAttribLocation,
        3,
        gl.FLOAT,
        gl.FALSE,
        6 * Float32Array.BYTES_PER_ELEMENT,
        0    
    );
    
    gl.vertexAttribPointer(
        colorAttribLocation,
        3,
        gl.FLOAT,
        gl.FALSE,
        6 * Float32Array.BYTES_PER_ELEMENT,
        3 * Float32Array.BYTES_PER_ELEMENT,  
    );

    gl.enableVertexAttribArray(positionAttribLocation); 
    gl.enableVertexAttribArray(colorAttribLocation); 
    
    gl.useProgram(program);

    var matWorldUniformLocation = gl.getUniformLocation(program, 'mWorld');
    var matViewUniformLocation = gl.getUniformLocation(program, 'mView');
    var matProjUniformLocation = gl.getUniformLocation(program, 'mProj');

    var worldMatrix = new Float32Array(16);
    var viewMatrix = new Float32Array(16);
    var projMatrix = new Float32Array(16);
    mat4.identity(worldMatrix);
    mat4.lookAt(viewMatrix, [0, 0, -6], [0,0,0], [0, 1, 0]);
    mat4.perspective(projMatrix, glMatrix.glMatrix.toRadian(45), canvas.width / canvas.height, 0.1, 1000.0);
    
    gl.uniformMatrix4fv(matWorldUniformLocation, gl.FALSE, worldMatrix);
    gl.uniformMatrix4fv(matViewUniformLocation, gl.FALSE, viewMatrix);
    gl.uniformMatrix4fv(matProjUniformLocation, gl.FALSE, projMatrix);
    
    var xRotationMatrix = new Float32Array(16);
    var yRotationMatrix = new Float32Array(16);
    
    var identityMatrix = new Float32Array(16);
    mat4.identity(identityMatrix);
    var angle = 0;
    
    var loop = function (){
        angle = performance.now() / 1000 / 6 * 2 * Math.PI;
        mat4.rotate(yRotationMatrix, identityMatrix, angle * 4, [0,1,0]);
        mat4.rotate(xRotationMatrix, identityMatrix, angle * 2, [1,0,0]);
        mat4.mul(worldMatrix, xRotationMatrix, yRotationMatrix);
        gl.uniformMatrix4fv(matWorldUniformLocation, gl.FALSE, worldMatrix);
        
        gl.clearColor(0.75, 0.85, 0.8, 1.0);
        gl.clear(gl.DEPTH_BUFFER_BIT | gl.COLOR_BUFFER_BIT);
        gl.drawElements(gl.TRIANGLES, pyramidIndices.length, gl.UNSIGNED_SHORT, 0);
        
        requestAnimationFrame(loop);
    };
    requestAnimationFrame(loop);
};

