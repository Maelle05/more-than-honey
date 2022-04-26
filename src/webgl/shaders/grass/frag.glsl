varying vec2 vUv;

void main() {
  vec3 baseColor = vec3( 0, 0.5, 1.1 );
  float clarity = vUv.y * 0.1 + 0.05;
  gl_FragColor = vec4( baseColor * clarity, 1 );
}