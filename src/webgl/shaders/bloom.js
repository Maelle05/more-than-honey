
import WebGl from '../webglManager'

import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js'
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js'
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js'

import vertexshader from './bloom/vert.glsl'
import fragmentshader from './bloom/frag.glsl'

import * as THREE from 'three'



let processingInstance = null

export default class Bloom {
  constructor(){
    if(processingInstance){
      return processingInstance
    }

    processingInstance = this

    this.webGl = new WebGl()
    this.scene = this.webGl.scene
    this.size = this.webGl.sizes

    this.renderer = this.webGl.renderer
    this.camera = this.webGl.camera

    // Params
    this.params = {
      exposure: 1,
      bloomStrength: 5,
      bloomThreshold: 0,
      bloomRadius: 0,
    }

    this.renderScene = new RenderPass( this.scene, this.camera )

    this.initBloom()

    this.darkMaterial = new THREE.MeshBasicMaterial({color: 0x000000})
    this.lightMaterial = new THREE.MeshLambertMaterial({color: 0xffff00})

    this.NoBloomElements = []

    this.setup()
  }

  initBloom(){
    this.bloomPass = new UnrealBloomPass( new THREE.Vector2( this.size.width, this.size.height ), 1.5, 0.4, 0.85 )
    this.bloomPass.threshold = this.params.bloomThreshold
    this.bloomPass.strength = this.params.bloomStrength
    this.bloomPass.radius = this.params.bloomRadius

    this.bloomComposer = new EffectComposer( this.renderer )
    this.bloomComposer.renderToScreen = false
    this.bloomComposer.addPass( this.renderScene )
    this.bloomComposer.addPass( this.bloomPass )

    this.finalPass = new ShaderPass(
      new THREE.ShaderMaterial( {
        uniforms: {
          baseTexture: { value: null },
          bloomTexture: { value: this.bloomComposer.renderTarget2.texture }
        },
        vertexShader: vertexshader,
        fragmentShader: fragmentshader,
        defines: {}
      } ), "baseTexture"
    )
    this.finalPass.needsSwap = true

    this.finalComposer = new EffectComposer( this.renderer )
    this.finalComposer.addPass( this.renderScene )
    this.finalComposer.addPass( this.finalPass )
  }

  setup(){
    // Light
    // let light = new THREE.DirectionalLight(0xffffff, 1.5)
    // light.position.setScalar(1)
    this.scene.add( new THREE.AmbientLight(0xffffff, 0.5))

    // Debug
    this.debug = this.webGl.debug
    if(this.debug.active)
    {
      const viewGUI = this.debug.ui.addFolder('Bloom Proprety')

      viewGUI.add( this.params, 'exposure', 0.1, 2 ).onChange( (value) => {
        this.renderer.toneMappingExposure = Math.pow( value, 4.0 )
      })

      viewGUI.add( this.params, 'bloomThreshold', 0.0, 1.0 ).onChange(( value ) => {
        this.bloomPass.threshold = Number( value )
      })

      viewGUI.add( this.params, 'bloomStrength', 0.0, 10.0 ).onChange( ( value ) => {
        this.bloomPass.strength = Number( value )
      })

      viewGUI.add( this.params, 'bloomRadius', 0.0, 1.0 ).step( 0.01 ).onChange( ( value ) => {
        this.bloomPass.radius = Number( value )
      })
    }
  }

  update(){
    let materials = []
    let i = 0

    this.scene.background = new THREE.Color(0x000000)
    this.NoBloomElements.forEach(element => {
      element.traverse((child) =>
      {
          if(child instanceof THREE.Mesh)
          {
            materials.push(child.material)
            child.material = new THREE.Color(0x000000)
          }
      })
    })
    this.bloomComposer.render()

    this.NoBloomElements.forEach(element => {
      element.traverse((child) =>
      {
          if(child instanceof THREE.Mesh)
          {
            child.material = materials[i]
            i++
          }
      })
    })
    this.scene.background = this.webGl.environmentMapTexture
    this.finalComposer.render()

    materials = []
    i = 0
  }
  
}