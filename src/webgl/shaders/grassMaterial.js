import {
  Clock, DoubleSide,
  InstancedMesh,
  Object3D,
  PlaneGeometry,
  Scene,
  ShaderMaterial,
  Group
} from 'three'
import WebGl from '../webglManager'


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
`

const fragmentShader = `
  varying vec2 vUv;

  void main() {
    vec3 baseColor = vec3( 0.41, 0, 0.5 );
    float clarity = vUv.y * 0.15 ;
    gl_FragColor = vec4( baseColor * clarity, 1 );
  }
`

const uniforms = {
  time: {
    value: 0
  }
}

export default class GrassMaterial extends Group{
  constructor() {
    super()

    this.webGl = new WebGl()
    this.scene = this.webGl.scene
    this.renderer = this.webGl.renderer
    this.camera = this.webGl.camera
    this.clock = this.webGl.time


    this.leavesMaterial = new ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms,
      side: DoubleSide
    })

      
    this.instanceNumber = 40000
    this.dummy = new Object3D()

    this.setup()
  }

  setup() {

    // MESH
    const geometry = new PlaneGeometry( 0.1, 1, 1, 4 )
    geometry.translate( 0, 0.5, 0 ) // move grass blade geometry lowest point at 0.

    const instancedMesh = new InstancedMesh( geometry, this.leavesMaterial, this.instanceNumber )

    this.add( instancedMesh )

    // Position and scale the grass blade instances randomly.
    for ( let i=0 ; i < this.instanceNumber ; i++ ) {

      this.dummy.position.set(
        ( Math.random() - 0.5 ) * 100,
          0,
        ( Math.random() - 0.5 ) * 100
      )

      this.dummy.scale.setScalar( 0.5 + Math.random() * 0.5 )
      this.dummy.rotation.y = Math.random() * Math.PI
      this.dummy.updateMatrix()
      instancedMesh.setMatrixAt( i, this.dummy.matrix )

    }
  }

  update() {
     // Hand a time variable to vertex shader for wind displacement.
    this.leavesMaterial.uniforms.time.value = this.clock.elapsed / 1000
    this.leavesMaterial.uniformsNeedUpdate = true
  }
}
