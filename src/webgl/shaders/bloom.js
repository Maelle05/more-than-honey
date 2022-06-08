import * as THREE from 'three'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js'
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass'
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js'
import { FXAAShader } from 'three/examples/jsm/shaders/FXAAShader'

import WebGl from "../webglManager"
import RouterScenes from '../RouterScenes'

let postprosInstance = null

export default class Bloom {
  constructor() {
    if(postprosInstance){
      return postprosInstance
    }

    postprosInstance = this


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
      rendererBGColor: '#04060b'
    }

    this.renderer = this.WebGl.renderer
    this.renderer.toneMappingExposure = Math.pow(0.9, 4.0)
    this.renderer.outputEncoding = THREE.sRGBEncoding
    this.renderer.setClearColor(this.params.rendererBGColor)
    this.renderer.autoClear = false


    // Light
    this.scene.add(new THREE.AmbientLight(0xffffff, 0.25))

    this.renderScene = new RenderPass(this.scene, this.camera)

    this.effectFXAA = new ShaderPass(FXAAShader)
    this.effectFXAA.uniforms.resolution.value.set(1 / this.sizes.width, 1 / this.sizes.height)

    this.bloomPass = new UnrealBloomPass(new THREE.Vector2(this.sizes.width, this.sizes.height), 1.5, 0.4, 0.85)
    this.bloomPass.threshold = this.params.bloomThreshold
    this.bloomPass.strength = this.params.bloomStrength
    this.bloomPass.radius = this.params.bloomRadius
    this.bloomPass.renderToScreen = true

    // for the red vignette when user hurt butterflies or protal during game
    this.vignettePass = new ShaderPass({
      uniforms: {
        tDiffuse: { value: null },
        uIntensity: { value: 0 },
      },
      vertexShader: /* glsl */`
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
      }`,
  
    fragmentShader: /* glsl */`
      uniform sampler2D tDiffuse;
      uniform float uIntensity;

      varying vec2 vUv;
      void main() {
        float strength = 1. - smoothstep(.3, .5 , distance(vUv, vec2(0.5))) * uIntensity;

        vec4 texture = texture2D( tDiffuse, vUv );

        texture.rgb = mix(texture.rgb, vec3(1., 0., 0.), 1. - strength);

        gl_FragColor = texture;
      }`,
    })

    this.routerScenes = new RouterScenes()

    this.composer = new EffectComposer(this.renderer)
    this.composer.setSize(this.sizes.width, this.sizes.height)
    this.composer.addPass(this.renderScene)
    this.composer.addPass(this.effectFXAA)
    this.composer.addPass(this.bloomPass)

    this.composerGame = new EffectComposer(this.renderer)
    this.composerGame.setSize(this.sizes.width, this.sizes.height)
    this.composerGame.addPass(this.renderScene)
    this.composerGame.addPass(this.effectFXAA)
    this.composerGame.addPass(this.bloomPass)
    this.composerGame.addPass(this.vignettePass)

    


    // Debug
    this.debug = this.WebGl.debug
    if (this.debug.active) {
      const viewGUI = this.debug.ui.addFolder('Bloom Proprety')

      // viewGUI.add(this.params, 'exposure', 0.1, 2).onChange((value) => {
      //   this.renderer.toneMappingExposure = Math.pow(value, 4.0)
      // })

      viewGUI.add(this.params, 'bloomThreshold', 0.0, 1.0).onChange((value) => {
        this.bloomPass.threshold = Number(value)
      })

      viewGUI.add(this.params, 'bloomStrength', 0.0, 3.0).onChange((value) => {
        this.bloomPass.strength = Number(value)
      })

      viewGUI.add(this.params, 'bloomRadius', 0.0, 1.0).step(0.01).onChange((value) => {
        this.bloomPass.radius = Number(value)
      })

      viewGUI.add(this.vignettePass.uniforms.uIntensity, 'value').min(0).max(.5).name('Vignette')

      const sky = this.debug.ui.addFolder('Sky Proprety')
      sky.addColor(this.params, 'rendererBGColor')

    }
  }

  update() {
    // this.renderer.setClearColor(this.params.rendererBGColor)
    this.renderer.clear()
    if (this.routerScenes.currentRoot === "pollenGame" || this.routerScenes.currentRoot === "raceGame") {
      this.composerGame.render(this.scene, this.camera)
    } else {
      this.composer.render(this.scene, this.camera)
    }
  }
}