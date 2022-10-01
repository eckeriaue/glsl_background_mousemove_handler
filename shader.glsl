precision mediump float;
varying vec2 a_pos; 
uniform float u_time;
uniform vec2 u_mouse;

void main(void) {
  gl_FragColor = vec4(
    (a_pos.x + a_pos.y) / 2.0,
    (u_mouse.x + u_mouse.y) / 2.0, 
    sin(u_time * 2.0), 
    1
  );
}