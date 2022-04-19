varying vec2 vUv;

void main() {
  vec3 baseColor = vec3( 0.41, 0, 0.5 );
  float clarity = vUv.y * 0.15 ;
  gl_FragColor = vec4( baseColor * clarity, 1 );
}