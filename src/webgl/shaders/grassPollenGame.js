import {
  DoubleSide,
  InstancedMesh,
  Object3D,
  ConeGeometry,
  ShaderMaterial,
  Group,
  Mesh, MeshStandardMaterial, PlaneGeometry, Vector3
} from 'three'
import WebGl from '../webglManager'
import vertexShader from './grass/vert.glsl'
import fragmentShader from './grass/frag.glsl'

export default class Grass extends Group {
  constructor() {
    super()

    this.webGl = new WebGl()
    this.scene = this.webGl.scene
    this.renderer = this.webGl.renderer
    this.camera = this.webGl.camera
    this.clock = this.webGl.time

    this.property = {
      map: {
        ratio: 5,
      }
    }

    const uniforms = {
      time: {
        value: 0
      },
      uNoiseTexture: {
        value: this.webGl.resources.items.noiseTexture
      },
      uMinMapBounds: { value : new Vector3()},
      uMaxMapBounds: { value : new Vector3()}
    }

    this.leavesMaterial = new ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms,
      side: DoubleSide
    })

    this.instanceNumber = 2600
    this.dummy = new Object3D()

      this.setup()
  }

  setup() {
    // Mesh
    const geometry = new ConeGeometry(0.05, 0.6, 2, 1)
    geometry.translate(0, 0.5, 0) // move grass blade geometry lowest point at 0

    // Floor
    this.floorGeometry = new PlaneGeometry(30 / this.property.map.ratio, 30 / this.property.map.ratio, 68, 68)
    this.floorMaterial = new MeshStandardMaterial({
      color: 'black',
      side: DoubleSide,
      wireframe: false,
      displacementMap: this.webGl.resources.items.noiseTexture,
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
    this.floor.translateZ(-30 / (this.property.map.ratio * 2))
    this.floor.rotateX(Math.PI/2)

    this.add(this.floor)

    // Position and scale the grass blade instances randomly
    for (let i = 0; i < this.instanceNumber; i++) {
      const randomX = Math.random() - 0.5
      const randomZ = Math.random() - 0.5
      this.dummy.position.x = (randomX) * 30 / this.property.map.ratio
      this.dummy.position.z = (randomZ) * (30 / this.property.map.ratio ) - 30 / (this.property.map.ratio * 2)
      this.dummy.scale.setScalar(0.5 + Math.random() * 1)
      this.dummy.rotation.y = Math.random() * Math.PI
      this.dummy.updateMatrix()
      this.instancedMesh.setMatrixAt(i, this.dummy.matrix)
    }
    // Add grass
    this.add(this.instancedMesh)

  }

  update() {
    // Wind displacement
    this.leavesMaterial.uniforms.time.value = this.clock.elapsed / 3000
    this.leavesMaterial.uniformsNeedUpdate = true
  }
}
