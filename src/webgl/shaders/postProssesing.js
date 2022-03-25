import WebGl from '../webglManager';

import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { Vector2 } from 'three';


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

    this.renderScene = new RenderPass( this.scene, this.camera );
    this.composer = new EffectComposer( this.renderer );

    // Params
    this.params = {
      exposure: 1,
      bloomStrength: 1.5,
      bloomThreshold: 0,
      bloomRadius: 0
    };

    this.initBloom()
    this.setup()
  }

  initBloom(){
    this.bloomPass = new UnrealBloomPass( new Vector2( window.innerWidth, window.innerHeight ), 1.5, 0.4, 0.85 );
    this.bloomPass.threshold = this.params.bloomThreshold;
    this.bloomPass.strength = this.params.bloomStrength;
    this.bloomPass.radius = this.params.bloomRadius;
  }

  setup(){
    this.composer.addPass( this.renderScene );
    this.composer.addPass( this.bloomPass );
  }

  setCurrentRenderer(name){
    switch (name) {
      case 'bloom':
        this.currentRenderer = this.composer
        break;
    
      default:
        this.currentRenderer = this.renderer
        break;
    }
  }

  rendererRender(){
    this.currentRenderer.render(this.scene, this.camera)
  }
  
}