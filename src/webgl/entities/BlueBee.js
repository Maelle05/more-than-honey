import {Mesh, AnimationMixer, SphereGeometry, MeshBasicMaterial} from 'three'
import WebGl from '../webglManager'

export default class BlueBee
{
  constructor(){
    this.webGl = new WebGl()
    this.resources = this.webGl.resources
    this.time = this.webGl.time
    this.debug = this.webGl.debug

    // Resources
    this.resource = this.resources.items.beeBlueModel

    this.setModel()
    this.setAnimation()
  }

  setModel(){
    this.model = this.resource.scene
    // For raycaster
    const dummyMesh = new Mesh(
      new SphereGeometry(8, 16, 16),
      new MeshBasicMaterial({color: 0xffaa22})
    )
    dummyMesh.visible = false
    dummyMesh.name = 'dummy'
    this.model.add(dummyMesh)
    this.model.scale.setScalar(0.06)

    this.model.traverse((child) =>
    {
        if(child instanceof Mesh)
        {
            child.castShadow = true
            child.layers.enable(1)
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
    this.animation.actions.hover = this.animation.mixer.clipAction(this.resource.animations[1])
    this.animation.actions.takeOff = this.animation.mixer.clipAction(this.resource.animations[2])

    this.animation.actions.current = this.animation.actions.idle
    this.animation.actions.current.play()

  }

  update()
  {
    this.animation.mixer.update(this.time.delta * 0.001)
  }
}