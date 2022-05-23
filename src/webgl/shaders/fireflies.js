import * as THREE from 'three'
import WebGl from '../webglManager'
import mapSetting from '../elementsLocations/mapSetting.json'
import firefliesVertexShader from './fireflies/vert.glsl'
import firefliesFragmentShader from './fireflies/frag.glsl'

export default class Particules extends THREE.Group {
  constructor(){
    super()

    this.webgl =  new WebGl()
    this.resources = this.webgl.resources
    this.time = this.webgl.time
    this.debug = this.webgl.debug

    this.property = {
      map: {
        ratio: 5
      }
    } 

    this.setup()
  }

  setup(){

    // Geometry
    this.firefliesGeometry = new THREE.BufferGeometry()
    this.count = 550
    this.positionArray = new Float32Array(this.count * 3)
    this.scaleArray = new Float32Array(this.count)

    for (let i = 0; i < this.count; i++) {
      this.positionArray[i * 3 + 0] = Math.random() * mapSetting[0].right / this.property.map.ratio - (mapSetting[0].right / 2) / this.property.map.ratio
      this.positionArray[i * 3 + 1] = Math.random() * 6 - 0.5
      this.positionArray[i * 3 + 2] = Math.random() * mapSetting[0].bottom / this.property.map.ratio
      this.scaleArray[i] = Math.random()
    }

    this.firefliesGeometry.setAttribute('position', new THREE.BufferAttribute(this.positionArray, 3))
    this.firefliesGeometry.setAttribute('aScale', new THREE.BufferAttribute(this.scaleArray, 1))

    this.firefliesMaterial = new THREE.ShaderMaterial({
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      uniforms:
      {
        uPixelRatio: { value: Math.min(window.devicePixelRatio, 2) },
        uSize: { value: 510 },
        uTime: { value: 0 },
      },
      vertexShader: firefliesVertexShader,
      fragmentShader: firefliesFragmentShader
    })

    this.fireflies = new THREE.Points(this.firefliesGeometry, this.firefliesMaterial)


    // Debug
    if (this.debug.active) {
      const viewGUI = this.debug.ui.addFolder('Fireflies Proprety')
      viewGUI.add(this.firefliesMaterial.uniforms.uSize, 'value').min(0).max(1000).step(10).name('firefliesSize')
    }
    


    // Add to group
    this.add(this.fireflies)

  }

  update() {
    this.firefliesMaterial.uniforms.uTime.value = this.time.elapsed / 400
  }
}