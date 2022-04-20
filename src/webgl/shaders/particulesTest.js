import * as THREE from 'three'
import WebGl from '../webglManager'

export default class Particules extends THREE.Group {
  constructor(){
    super()

    this.webgl =  new WebGl()
    this.resources = this.webgl.resources
    this.time = this.webgl.time

    this.setup()
  }

  setup(){

    // Geometry
    this.particlesGeometry = new THREE.BufferGeometry()
    this.count = 2500

    this.positions = new Float32Array(this.count * 3)

    for(let i = 0; i < this.count * 3; i+=3){
      this.positions[i] = (Math.random() - 0.5) * 100
      this.positions[i+1] = (Math.random() - 0.5) * 15 + 7
      this.positions[i+2] = (Math.random() - 0.5) * 100
    }

    this.particlesGeometry.setAttribute('position', new THREE.BufferAttribute(this.positions, 3))

    const textureLoader = new THREE.TextureLoader()
    const particleTexture = textureLoader.load('/webgl/particles/smoke_03.png')

    // Material
    this.particlesMaterial = new THREE.PointsMaterial({
      size: 0.1,
      sizeAttenuation: true,
      // alphaMap: particleTexture,
      // alphaTest: 0.001, // to remove black on particle
      // depthTest: false // to remove black on particle
    })
    this.particlesMaterial.depthWrite = false
    this.particlesMaterial.blending = THREE.AdditiveBlending
    this.particlesMaterial.map = this.resources.items.particlesTexture

    this.particules = new THREE.Points(this.particlesGeometry, this.particlesMaterial)


    // Add to group
    this.add(this.particules)

  }

  update() {
      for(let i = 0; i < this.count * 3; i+=3){
        this.positions[i] = this.positions[i] - ((Math.random() - 0.5))
        this.positions[i+1] = this.positions[i+1] - ((Math.random() - 0.5)) 
        this.positions[i+2] = this.positions[i+2] - ((Math.random() - 0.5))
      }
      this.particules.geometry.attributes.position.needsUpdate = true
  }
}