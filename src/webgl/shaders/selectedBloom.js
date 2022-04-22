import * as THREE from 'three'
import {EffectComposer} from 'three/examples/jsm/postprocessing/EffectComposer.js'
import {RenderPass} from 'three/examples/jsm/postprocessing/RenderPass.js'
import {UnrealBloomPass} from 'three/examples/jsm/postprocessing/UnrealBloomPass.js'
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js'
import { FXAAShader } from 'three/examples/jsm/shaders/FXAAShader'

import WebGl from "../webglManager"

export default class SelectedBloom {
  constructor(){
    this.WebGl = new WebGl()
    this.scene = this.WebGl.scene
    this.sizes = this.WebGl.sizes

    this.camera = this.WebGl.camera
    this.camera.layers.enable(1)

    this.renderer = this.WebGl.renderer

    // Light
    // this.scene.add(new THREE.AmbientLight(0xffffff, 0.25))

    var obj = new THREE.Mesh(new THREE.BoxGeometry(5, 5, 4), new THREE.MeshLambertMaterial({color: 0x150505, wireframe: false}))
    obj.position.x = 20.250
    obj.position.y = 5.830
    obj.position.z = 20.790
    this.scene.add(obj)

    var objBack = new THREE.Mesh(new THREE.BoxGeometry(5, 5, 1), new THREE.MeshBasicMaterial({color: 'red', wireframe: false}))
    objBack.position.x = 20.250
    objBack.position.y = 5.830
    objBack.position.z = 17.810
    objBack.layers.enable(1)
    this.scene.add(objBack)

    this.renderScene = new RenderPass( this.scene, this.camera )

    this.effectFXAA = new ShaderPass( FXAAShader )
    this.effectFXAA.uniforms.resolution.value.set( 1 / this.sizes.width, 1 / this.sizes.height )

    this.bloomPass = new UnrealBloomPass( new THREE.Vector2( this.sizes.width, this.sizes.height ), 1.5, 0.4, 0.85 )
    this.bloomPass.threshold = 0.01
    this.bloomPass.strength = 1.2
    this.bloomPass.radius = 0.55
    this.bloomPass.renderToScreen = true

    this.composer = new EffectComposer( this.renderer )
    this.composer.setSize( this.sizes.width, this.sizes.height )
    this.composer.addPass( this.renderScene )
    this.composer.addPass( this.effectFXAA )
    this.composer.addPass( this.bloomPass )

    this.renderer.gammaInput = true
    this.renderer.toneMappingExposure = Math.pow( 0.9, 4.0 )
    this.renderer.outputEncoding = true
    this.renderer.setClearColor(0x000000)
  }

  update(){
    this.renderer.autoClear = false
    this.renderer.clear()
    
    this.camera.layers.set(1)
    this.composer.render()
    
    this.renderer.clearDepth()
    this.camera.layers.set(0)
    this.renderer.render(this.scene, this.camera)
  }
}