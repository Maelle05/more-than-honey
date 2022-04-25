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
import mapRGBA from '../elementsLocations/outsideOne/rgba.json'
import Map from '../elementsLocations/outsideOne/Map.png'

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

    this.instancedMesh = new InstancedMesh(geometry, this.leavesMaterial, this.instanceNumber)

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

    const canvas = document.createElement('canvas')
    this.ctx = canvas.getContext('2d')
    const img = new Image()
    img.src = window.location.protocol + '//' + window.location.host + Map
    img.addEventListener('load', () => {
      this.ctx.canvas.width  = img.width
      this.ctx.canvas.height = img.height
      this.ctx.drawImage(img, 0, 0)

      // Position and scale the grass blade instances randomly.
      for (let i = 0; i < this.instanceNumber; i++) {
      // for (let i = 0; i < 1; i++) {
        const randomX = Math.random() - 0.5
        const randomZ = Math.random() - 0.5
        this.dummy.position.set(
          (randomX) * mapSetting[0].right / this.property.map.ratio,
          0,
          (randomZ) * (mapSetting[0].bottom / this.property.map.ratio ) - mapSetting[0].bottom / (this.property.map.ratio * 2)
        )
        const raportX = Math.floor(this.dummy.position.x * this.property.map.ratio + mapSetting[0].right / 2)
        const raportY = Math.floor(this.dummy.position.z * this.property.map.ratio + mapSetting[0].bottom)
        const pixel = this.ctx.getImageData(raportX, raportY, 1, 1)
        const data = pixel.data
        const result =  { r: data[0] , g: data[1], b: data[2], a: data[3] }

        this.dummy.scale.setScalar(0.5 + Math.random() * 1)
        this.dummy.rotation.y = Math.random() * Math.PI
        this.dummy.updateMatrix()
        if (result.b < result.g && result.r < result.g) {
          this.instancedMesh.setMatrixAt(i, this.dummy.matrix)
        }
      }
      this.add(this.instancedMesh)

    }, false)
    
  }

  update() {
    // Hand a time variable to vertex shader for wind displacement.
    this.leavesMaterial.uniforms.time.value = this.clock.elapsed / 5000
    this.leavesMaterial.uniformsNeedUpdate = true
  }
}
