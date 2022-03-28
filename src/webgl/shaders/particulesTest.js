import * as THREE from 'three'
import WebGl from '../webglManager'

export default class Particules extends THREE.Group {
  constructor(){
    super()

    this.webgl =  new WebGl()
    this.resources = this.webgl.resources

    this.setup()
  }

  setup(){

    // Geometry
    this.particlesGeometry = new THREE.BufferGeometry()
    const count = 2500

    const positions = new Float32Array(count * 3)

    for(let i = 0; i < count * 3; i++){
      positions[i] = (Math.random() - 0.5) * 10
    }

    this.particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3)) 

    // Material
    this.particlesMaterial = new THREE.PointsMaterial({
      size: 0.01,
      sizeAttenuation: true
    })
    this.particlesMaterial.depthWrite = false
    this.particlesMaterial.blending = THREE.AdditiveBlending
    this.particlesMaterial.map = this.resources.items.particlesTexture

    this.particules = new THREE.Points(this.particlesGeometry, this.particlesMaterial)


    // Add to group
    this.add(this.particules)

  }
}