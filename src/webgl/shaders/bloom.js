import * as THREE from 'three'
import {EffectComposer} from 'three/examples/jsm/postprocessing/EffectComposer.js'
import {RenderPass} from 'three/examples/jsm/postprocessing/RenderPass.js'
import {UnrealBloomPass} from 'three/examples/jsm/postprocessing/UnrealBloomPass.js'
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js'
import { FXAAShader } from 'three/examples/jsm/shaders/FXAAShader'

import WebGl from "../webglManager"

export default class Bloom {
  constructor(){
    this.WebGl = new WebGl()
    this.scene = this.WebGl.scene
    this.sizes = this.WebGl.sizes

    this.camera = this.WebGl.camera
    this.camera.layers.enable(1)

     // Params
     this.params = {
      exposure: 1,
      bloomStrength: 1.5,
      bloomThreshold: 0,
      bloomRadius: 0,
      rendererBGColor: '#1f1929'
    }

    this.renderer = this.WebGl.renderer
    this.renderer.toneMappingExposure = Math.pow( 0.9, 4.0 )
    this.renderer.outputEncoding = THREE.sRGBEncoding
    this.renderer.setClearColor(this.params.rendererBGColor)
    this.renderer.autoClear = false


    // Light
    this.scene.add(new THREE.AmbientLight(0xffffff, 0.25))

    this.renderScene = new RenderPass( this.scene, this.camera )

    this.effectFXAA = new ShaderPass( FXAAShader )
    this.effectFXAA.uniforms.resolution.value.set( 1 / this.sizes.width, 1 / this.sizes.height )

    this.bloomPass = new UnrealBloomPass( new THREE.Vector2( this.sizes.width, this.sizes.height ), 1.5, 0.4, 0.85 )
    this.bloomPass.threshold = this.params.bloomThreshold
    this.bloomPass.strength = this.params.bloomStrength
    this.bloomPass.radius = this.params.bloomRadius
    this.bloomPass.renderToScreen = true

    this.composer = new EffectComposer( this.renderer )
    this.composer.setSize( this.sizes.width, this.sizes.height )
    this.composer.addPass( this.renderScene )
    this.composer.addPass( this.effectFXAA )
    this.composer.addPass( this.bloomPass )


    // Debug
    this.debug = this.WebGl.debug
    if (this.debug.active) {
      const viewGUI = this.debug.ui.addFolder('Bloom Proprety')

      viewGUI.add(this.params, 'exposure', 0.1, 2).onChange((value) => {
        this.renderer.toneMappingExposure = Math.pow(value, 4.0)
      })

      viewGUI.add(this.params, 'bloomThreshold', 0.0, 1.0).onChange((value) => {
        this.bloomPass.threshold = Number(value)
      })

      viewGUI.add(this.params, 'bloomStrength', 0.0, 3.0).onChange((value) => {
        this.bloomPass.strength = Number(value)
      })

      viewGUI.add(this.params, 'bloomRadius', 0.0, 1.0).step(0.01).onChange((value) => {
        this.bloomPass.radius = Number(value)
      })

      const sky = this.debug.ui.addFolder('Sky Proprety')
      sky.addColor(this.params, 'rendererBGColor')

    }
  }

  update(){
    this.renderer.setClearColor(this.params.rendererBGColor)
    this.renderer.clear()
    this.composer.render(this.scene, this.camera)
  }
}