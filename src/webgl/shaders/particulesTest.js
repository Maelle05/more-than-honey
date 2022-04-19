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

    for(let i = 0; i < count * 3; i+=3){
      positions[i] = (Math.random() - 0.5) * 100
      positions[i+1] = (Math.random() - 0.5) * 15 + 7
      positions[i+2] = (Math.random() - 0.5) * 100
    }

    this.particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))

    const textureLoader = new THREE.TextureLoader()
    const particleTexture = textureLoader.load('/webgl/particles/smoke_03.png')

    // Material
    this.particlesMaterial = new THREE.PointsMaterial({
      size: 0.1,
      sizeAttenuation: true,
      alphaMap: particleTexture,
      alphaTest: 0.001, // to remove black on particle
      depthTest: false // to remove black on particle
    })
    this.particlesMaterial.depthWrite = false
    this.particlesMaterial.blending = THREE.AdditiveBlending
    this.particlesMaterial.map = this.resources.items.particlesTexture

    this.particules = new THREE.Points(this.particlesGeometry, this.particlesMaterial)


    // Add to group
    this.add(this.particules)

  }
}