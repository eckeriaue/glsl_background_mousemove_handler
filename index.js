fetch("shader.glsl")
    .then((res) => res.text())
    .then((fragCode) => {

        const canvas = document.querySelector("#shader");
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        const gl = canvas.getContext("webgl");

        const verts = [
            -1,  1,
            1,  1,
            1, -1,
            -1, -1,
        ];

        const indices = [0, 1, 3, 1, 2, 3];
        const vbuf = gl.createBuffer();

        gl.bindBuffer(gl.ARRAY_BUFFER, vbuf);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(verts), gl.STATIC_DRAW);
        gl.bindBuffer(gl.ARRAY_BUFFER, null);

        const ibuf = gl.createBuffer();

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ibuf);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);

        const vertCode =
        'attribute vec2 v_pos;' +
        'varying vec2 a_pos;' +
            
        'void main(void) {' +
            'a_pos = v_pos;' +
            'gl_Position = vec4(v_pos, 0.0, 1.0);' +
        '}';

        const vertShader = gl.createShader(gl.VERTEX_SHADER);
        gl.shaderSource(vertShader, vertCode);
        gl.compileShader(vertShader);

        const fragShader = gl.createShader(gl.FRAGMENT_SHADER);
        gl.shaderSource(fragShader, fragCode); 
        gl.compileShader(fragShader);

        const msg = gl.getShaderInfoLog(fragShader);

        if (msg) console.error(msg);

        const prog = gl.createProgram();

        gl.attachShader(prog, vertShader);
        gl.attachShader(prog, fragShader);
        gl.linkProgram(prog);
        gl.useProgram(prog);
        gl.bindBuffer(gl.ARRAY_BUFFER, vbuf);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ibuf);
        const coord = gl.getAttribLocation(prog, "v_pos");
        gl.vertexAttribPointer(coord, 2, gl.FLOAT, false, 0, 0); 
        gl.enableVertexAttribArray(coord);

        gl.clearColor(0, 0, 0, 1);
        gl.viewport(0, 0, canvas.width, canvas.height);
        gl.enable(gl.DEPTH_TEST);

        const timeLoc = gl.getUniformLocation(prog, "u_time");
        const mouseLoc = gl.getUniformLocation(prog, "u_mouse");
        let mouseX = 0;
        let mouseY = 0;

        canvas.addEventListener("mousemove", (e) => {
            mouseX = e.clientX / canvas.width;
            mouseY = 1.0 - e.clientY / canvas.height;
        })

        const frame = (t) => {
            gl.uniform1f(timeLoc, t / 1000);
            gl.uniform2f(mouseLoc, mouseX, mouseY);
            gl.clear(gl.COLOR_BUFFER_BIT);
            gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_SHORT, 0);
            requestAnimationFrame(frame);
        };

        frame();

    })
    .catch(console.error);
