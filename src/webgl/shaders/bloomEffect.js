import WebGl from '../webglManager'

import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js'
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js'
import { Vector2 } from 'three'


let processingInstance = null

export default class Processing {
  constructor(){
    if(processingInstance){
      return processingInstance
    }

    processingInstance = this

    this.webGl = new WebGl()
    this.scene = this.webGl.scene
    this.renderer = this.webGl.renderer
    this.camera = this.webGl.camera

    this.renderScene = new RenderPass( this.scene, this.camera )
    this.composer = new EffectComposer( this.renderer )

    // Params
    this.params = {
      exposure: 1,
      bloomStrength: 1.5,
      bloomThreshold: 0,
      bloomRadius: 0
    }

    this.initBloom()
    this.setup()
  }

  initBloom(){
    this.bloomPass = new UnrealBloomPass( new Vector2( window.innerWidth, window.innerHeight ), 1.5, 0.4, 0.85 )
    this.bloomPass.threshold = this.params.bloomThreshold
    this.bloomPass.strength = this.params.bloomStrength
    this.bloomPass.radius = this.params.bloomRadius
  }

  setup(){
    this.composer.addPass( this.renderScene )
    this.composer.addPass( this.bloomPass )

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

      viewGUI.add( this.params, 'bloomStrength', 0.0, 3.0 ).onChange( ( value ) => {
        this.bloomPass.strength = Number( value )
      })

      viewGUI.add( this.params, 'bloomRadius', 0.0, 1.0 ).step( 0.01 ).onChange( ( value ) => {
        this.bloomPass.radius = Number( value )
      })

    }
  }

  rendererRender(){
    this.composer.render()
  }
  
}