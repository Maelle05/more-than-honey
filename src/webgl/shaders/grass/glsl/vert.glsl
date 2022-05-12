uniform float time;
uniform vec3 uMaxMapBounds;
uniform vec3 uMinMapBounds;
uniform sampler2D uNoiseTexture;

varying vec2 vUv;

float map(float value, float start1, float stop1, float start2, float stop2) {
  return start2 + (stop2 - start2) * ((value - start1) / (stop1 - start1));
}

void main() {

  vUv = uv;
  
  // VERTEX POSITION
  
  vec4 mvPosition = vec4( position, 1.0 );
  #ifdef USE_INSTANCING
    mvPosition = instanceMatrix * mvPosition;
  #endif

  vec4 worldPosition = modelMatrix * instanceMatrix * vec4(position, 1.);

  // DISPLACEMENT
  
  // here the displacement is made stronger on the blades tips.
  float dispPower = 1.0 - cos( uv.y * 3.1416 / 2.0 );
  
  float displacement = sin( mvPosition.z + time * 10.0 ) * ( 0.1 * dispPower );
  mvPosition.z += displacement;

  // POSITION OF MESH
  vec2 scaledCoords = vec2(map(worldPosition.x, uMinMapBounds.x, uMaxMapBounds.x, .0, 1.), map(worldPosition.z, uMinMapBounds.z, uMaxMapBounds.z, .0, 1.));

  float elevation = texture2D(uNoiseTexture, scaledCoords).r * 5.;
  mvPosition.y -= elevation;
  
  vec4 modelViewPosition = modelViewMatrix * mvPosition;
  gl_Position = projectionMatrix * modelViewPosition;

}