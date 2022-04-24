import {
  DoubleSide,
  InstancedMesh,
  Object3D,
  ConeGeometry,
  ShaderMaterial,
  Group,
  PlaneGeometry,
  MeshBasicMaterial,
  Mesh
} from 'three'
import WebGl from '../webglManager'
import vertexShader from './grass/vert.glsl'
import fragmentShader from './grass/frag.glsl'
import mapSetting from '../elementsLocations/outsideOne/mapSetting.json'

const uniforms = {
  time: {
    value: 0
  }
}

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

    this.leavesMaterial = new ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms,
      side: DoubleSide
    })

    this.instanceNumber = 160000
    this.dummy = new Object3D()

    this.setup()
  }

  setup() {
    // Mesh
    const geometry = new ConeGeometry(0.05, 0.6, 2, 1)
    geometry.translate(0, 0.5, 0) // move grass blade geometry lowest point at 0.

    const instancedMesh = new InstancedMesh(geometry, this.leavesMaterial, this.instanceNumber)
    this.add(instancedMesh)

    // Floor
    this.floor = new Mesh(
      new PlaneGeometry( mapSetting[0].right / this.property.map.ratio, mapSetting[0].bottom / this.property.map.ratio ),
      new MeshBasicMaterial({
        color: 'black',
        side: DoubleSide
      })
    )
    this.floor.name = 'floor'
    this.floor.translateZ(-mapSetting[0].bottom / (this.property.map.ratio * 2))
    this.floor.rotateX(Math.PI/2)
    this.add(this.floor)

    // Position and scale the grass blade instances randomly.
    for (let i = 0; i < this.instanceNumber; i++) {
      this.dummy.position.set(
        (Math.random() - 0.5) * mapSetting[0].right / this.property.map.ratio,
        0,
        (Math.random() - 0.5) * (mapSetting[0].bottom / this.property.map.ratio ) - mapSetting[0].bottom / (this.property.map.ratio * 2)
      )

      this.dummy.scale.setScalar(0.5 + Math.random() * 1)
      this.dummy.rotation.y = Math.random() * Math.PI
      this.dummy.updateMatrix()
      instancedMesh.setMatrixAt(i, this.dummy.matrix)

    }
  }

  update() {
    // Hand a time variable to vertex shader for wind displacement.
    this.leavesMaterial.uniforms.time.value = this.clock.elapsed / 5000
    this.leavesMaterial.uniformsNeedUpdate = true
  }
}
