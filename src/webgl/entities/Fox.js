import { Mesh, AnimationMixer } from 'three'
import WebGl from './../webglManager'

export default class Fox
{
  constructor(){
    this.webGl = new WebGl()
    this.scene = this.webGl.scene
    this.resources = this.webGl.resources
    this.time = this.webGl.time
    this.debug = this.webGl.debug

    // Debug
    if(this.debug.active)
    {
      this.debugFolder = this.debug.ui.addFolder('fox')
    }

    // Resource
    this.resource = this.resources.items.foxModel

    this.setModel()
    this.setAnimation()
  }

  setModel(){
    this.model = this.resource.scene
    this.model.scale.set(0.02, 0.02, 0.02)

    this.model.traverse((child) =>
    {
        if(child instanceof Mesh)
        {
            child.castShadow = true
        }
    })
  }

  setAnimation(){
    this.animation = {}
    
    // Mixer
    this.animation.mixer = new AnimationMixer(this.model)
    
    // Actions
    this.animation.actions = {}
    
    this.animation.actions.idle = this.animation.mixer.clipAction(this.resource.animations[0])
    this.animation.actions.walking = this.animation.mixer.clipAction(this.resource.animations[1])
    this.animation.actions.running = this.animation.mixer.clipAction(this.resource.animations[2])
    
    this.animation.actions.current = this.animation.actions.idle
    this.animation.actions.current.play()

    // Play the action
    this.animation.play = (name) =>
    {
      const newAction = this.animation.actions[name]
      const oldAction = this.animation.actions.current

      newAction.reset()
      newAction.play()
      newAction.crossFadeFrom(oldAction, 1)

      this.animation.actions.current = newAction
    }

    // Debug
    if(this.debug.active)
    {
      const debugObject = {
        playIdle: () => { this.animation.play('idle') },
        playWalking: () => { this.animation.play('walking') },
        playRunning: () => { this.animation.play('running') }
      }
      this.debugFolder.add(debugObject, 'playIdle')
      this.debugFolder.add(debugObject, 'playWalking')
      this.debugFolder.add(debugObject, 'playRunning')
    }
  }

  update()
  {
    this.animation.mixer.update(this.time.delta * 0.001)
  }
}