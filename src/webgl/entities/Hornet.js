import {Mesh, AnimationMixer} from 'three'
import WebGl from '../webglManager'

export default class Hornet {
  constructor() {
    this.webGl = new WebGl()
    this.resources = this.webGl.resources
    this.time = this.webGl.time
    this.debug = this.webGl.debug

    // Resource
    this.resource = this.resources.items.hornetModel

    this.setModel()
    this.setAnimation()
  }

  setModel() {
    this.model = this.resource.scene
    this.model.scale.set(0.1, 0.1, 0.1)

    this.model.traverse((child) => {
      if (child instanceof Mesh) {
        child.castShadow = true
      }
    })
  }

  setAnimation() {
    this.animation = {}

    // Mixer
    this.animation.mixer = new AnimationMixer(this.model)

    // Actions
    this.animation.actions = {}

    this.animation.actions.idle = this.animation.mixer.clipAction(this.resource.animations[0])
    this.animation.actions.hover = this.animation.mixer.clipAction(this.resource.animations[1])
    this.animation.actions.takeOff = this.animation.mixer.clipAction(this.resource.animations[2])

    this.animation.actions.current = this.animation.actions.hover
    this.animation.actions.current.play()

  }

  update() {
    this.animation.mixer.update(this.time.delta * 0.001)
  }
}