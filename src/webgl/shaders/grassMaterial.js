import {
  Clock, DoubleSide,
  InstancedMesh,
  Object3D,
  PerspectiveCamera,
  PlaneGeometry,
  Scene,
  ShaderMaterial,
  WebGLRenderer
} from 'three'
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js'

// const WIDTH = window.innerWidth
// const HEIGHT = window.innerHeight

// const scene = new Scene()
// const camera = new PerspectiveCamera( 75, WIDTH / HEIGHT, 0.1, 1000 )
// camera.position.set( 0, 5, 10 )

// const renderer = new WebGLRenderer({ antialias: true })
// renderer.setSize( window.innerWidth, window.innerHeight )
// document.body.appendChild( renderer.domElement )
//
// const controls = new OrbitControls( camera, renderer.domElement )

// const clock = new Clock()

////////////
// MATERIAL
////////////

export default class GrassMaterial {
  const vertexShader = `
  varying vec2 vUv;
  uniform float time;
  
	void main() {

    vUv = uv;
    
    // VERTEX POSITION
    
    vec4 mvPosition = vec4( position, 1.0 );
    #ifdef USE_INSTANCING
    	mvPosition = instanceMatrix * mvPosition;
    #endif
    
    // DISPLACEMENT
    
    // here the displacement is made stronger on the blades tips.
    float dispPower = 1.0 - cos( uv.y * 3.1416 / 2.0 );
    
    float displacement = sin( mvPosition.z + time * 10.0 ) * ( 0.1 * dispPower );
    mvPosition.z += displacement;
    
    //
    
    vec4 modelViewPosition = modelViewMatrix * mvPosition;
    gl_Position = projectionMatrix * modelViewPosition;

	}
`;

  const fragmentShader = `
  varying vec2 vUv;
  
  void main() {
  	vec3 baseColor = vec3( 0.41, 1.0, 0.5 );
    float clarity = ( vUv.y * 0.5 ) + 0.5;
    gl_FragColor = vec4( baseColor * clarity, 1 );
  }
`

  const uniforms = {
    time: {
      value: 0
    }
  }

  const leavesMaterial = new ShaderMaterial({
    vertexShader,
    fragmentShader,
    uniforms,
    side: DoubleSide
  })

/////////
// MESH
/////////

  const instanceNumber = 5000
  const dummy = new Object3D()

  const geometry = new PlaneGeometry( 0.1, 1, 1, 4 )
  geometry.translate( 0, 0.5, 0 ) // move grass blade geometry lowest point at 0.

  const instancedMesh = new InstancedMesh( geometry, leavesMaterial, instanceNumber )

  scene.add( instancedMesh )

// Position and scale the grass blade instances randomly.

  for ( let i=0 ; i<instanceNumber ; i++ ) {

  dummy.position.set(
( Math.random() - 0.5 ) * 10,
  0,
( Math.random() - 0.5 ) * 10
)

  dummy.scale.setScalar( 0.5 + Math.random() * 0.5 )

  dummy.rotation.y = Math.random() * Math.PI

  dummy.updateMatrix()
  instancedMesh.setMatrixAt( i, dummy.matrix )

}

//

const animate = function () {

  // Hand a time variable to vertex shader for wind displacement.
  leavesMaterial.uniforms.time.value = clock.getElapsedTime()
  leavesMaterial.uniformsNeedUpdate = true

  requestAnimationFrame( animate )

  renderer.render( scene, camera )
}

animate()
}