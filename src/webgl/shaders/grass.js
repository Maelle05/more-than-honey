import {
  DoubleSide,
  InstancedMesh,
  Object3D,
  ConeGeometry,
  ShaderMaterial,
  Group,
  PlaneBufferGeometry,
  MeshBasicMaterial,
  Mesh, MeshStandardMaterial, PlaneGeometry, Vector3
} from 'three'
import WebGl from '../webglManager'
import vertexShader from './grass/vert.glsl'
import fragmentShader from './grass/frag.glsl'
import mapSetting from '../elementsLocations/outsideOne/mapSetting.json'
import simplexNoise from 'simplex-noise'
import {ImprovedNoise} from 'three/examples/jsm/math/ImprovedNoise'

const simplex = new simplexNoise('mama-leo')
console.log(simplex)

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
    // this.add(instancedMesh)

    // Floor
    this.floorGeometry = new PlaneGeometry(mapSetting[0].right / this.property.map.ratio, mapSetting[0].bottom / this.property.map.ratio, 32, 32)
    this.floorMaterial = new MeshStandardMaterial({
      color: 'black',
      side: DoubleSide,
      wireframe: true
    })

    this.floor = new Mesh(this.floorGeometry, this.floorMaterial)

    const vertices = this.floorGeometry.getAttribute("position")
    this.floorGeometry.verticesNeedUpdate = true

    console.log(vertices, 'vertices')

    for (let i = 0; i < vertices.array.length / 3; i++) {
      const i3 = i * 3
      const noise = simplex.noise2D(vertices[i3] * 30, vertices[i3 + 1] * 30) + 0.7
      vertices[i3 + 2] += noise * 0.004
    }


    for (let i = 0; i < vertices.array.length; i++) {
      let v = new Vector3(
        i,
        i + 1,
        i + 2
      )
      console.log(v)
      v.y = simplex.noise2D(v.x * 0.01, v.y * 0.01) * 30
      v.y += simplex.noise2D(v.x * 0.03, v.y * 0.03) * 5
      v.y += simplex.noise2D(v.x * 0.1, v.y * 0.125)
    }


    this.floor.name = 'floor'
    this.floor.translateZ(-mapSetting[0].bottom / (this.property.map.ratio * 2))
    // this.floor.translateY(150)
    this.floor.rotateX(Math.PI / 2)
    this.add(this.floor)

    // Position and scale the grass blade instances randomly.
    for (let i = 0; i < this.instanceNumber; i++) {
      this.dummy.position.set(
        (Math.random() - 0.5) * mapSetting[0].right / this.property.map.ratio,
        0,
        (Math.random() - 0.5) * (mapSetting[0].bottom / this.property.map.ratio) - mapSetting[0].bottom / (this.property.map.ratio * 2)
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
