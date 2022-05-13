import {
  DoubleSide,
  InstancedMesh,
  Object3D,
  ConeGeometry,
  ShaderMaterial,
  Group,
  Mesh, MeshStandardMaterial, PlaneGeometry, Vector3
} from 'three'
import WebGl from '../../webglManager'

export default class Grass extends Group {
  constructor(width, height, nbInstances) {
    super()

    this.webGl = new WebGl()
    this.scene = this.webGl.scene
    this.renderer = this.webGl.renderer
    this.camera = this.webGl.camera
    this.clock = this.webGl.time


    const uniforms = {
      time: {
        value: 0
      },
      uMinMapBounds: { value : new Vector3()},
      uMaxMapBounds: { value : new Vector3()}
    }

    this.leavesMaterial = new ShaderMaterial({
      vertexShader: /* glsl */ `
        uniform float time;
        uniform vec3 uMaxMapBounds;
        uniform vec3 uMinMapBounds;

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

          
          vec4 modelViewPosition = modelViewMatrix * mvPosition;
          gl_Position = projectionMatrix * modelViewPosition;

        }
      `,
      fragmentShader: /* glsl */ `
        varying vec2 vUv;

        void main() {
          vec3 baseColor = vec3( 0, 0.5, 1.1 );
          float clarity = vUv.y * 0.1 + 0.05;

          gl_FragColor = vec4( baseColor * clarity, 1. );
        }
      `,
      uniforms,
      side: DoubleSide
    })

    this.mapProperty = {
      width: width,
      height: height,
    }

    this.instanceNumber = nbInstances
    this.dummy = new Object3D()

    this.setup()
  }

  setup() {
    // Mesh
    const geometry = new ConeGeometry(0.05, 0.6, 2, 1)
    geometry.translate(0, 0.5, 0) // move grass blade geometry lowest point at 0

    // Floor
    this.floorGeometry = new PlaneGeometry(this.mapProperty.width, this.mapProperty.height, 68, 68)
    this.floorMaterial = new MeshStandardMaterial({
      color: 'black',
      side: DoubleSide,
      wireframe: false,
      displacementScale: 5
    })
    this.floor = new Mesh(this.floorGeometry, this.floorMaterial)

    this.floorGeometry.computeBoundingBox()


    this.leavesMaterial.uniforms.uMinMapBounds.value.copy(this.floorGeometry.boundingBox.min)
    this.leavesMaterial.uniforms.uMaxMapBounds.value.copy(this.floorGeometry.boundingBox.max)

    this.instancedMesh = new InstancedMesh(geometry, this.leavesMaterial, this.instanceNumber)


    // add bounding box to debug floor
    // this.add(new Box3Helper(this.floorGeometry.boundingBox, 0xffffff))

    this.floor.name = 'floor'
    this.floor.rotateX(Math.PI/2)

    this.add(this.floor)

    // Position and scale the grass blade instances randomly
    for (let i = 0; i < this.instanceNumber; i++) {
      const randomX = Math.random() - 0.5
      const randomZ = Math.random() - 0.5
      this.dummy.position.x = (randomX) * this.mapProperty.width
      this.dummy.position.z = (randomZ) * this.mapProperty.height
      const raportX = Math.floor(this.dummy.position.x + 30)
      const raportY = Math.floor(this.dummy.position.z + 30)

      this.dummy.scale.setScalar(0.5 + Math.random() * 1)
      this.dummy.rotation.y = Math.random() * Math.PI
      this.dummy.updateMatrix()
      this.instancedMesh.setMatrixAt(i, this.dummy.matrix)
    }
    // Add grass
    this.add(this.instancedMesh)

  }

  update() {
    // Wind effect
    this.leavesMaterial.uniforms.time.value = this.clock.elapsed / 6000
    this.leavesMaterial.uniformsNeedUpdate = true
  }
}
