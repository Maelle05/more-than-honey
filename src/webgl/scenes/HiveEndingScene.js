import {Group} from 'three'
import WebGl from '../webglManager'

export default class EndingScene extends Group {
  constructor() {
    super()
    this.webGl = new WebGl()
    this.scene = this.webGl.scene
    this.resources = this.webGl.resources
    this.loader = this.webGl.loader

    // Wait for resources
    this.resources.on(`sourcesReadyending`, () => {
      this.setup()
    })
  }

  setup() {
    this.hive = this.resources.items.hiveModel.scene

    this.init()
  }

  init() {
    // Remove fog
    this.scene.fog.density = 0

    // Set Camera position
    this.webGl.camera.position.set(-15, 0, -40)
    this.webGl.controls.target.set(0, 0, 0)

    // Listener

    // add models
    this.add(this.hive)

    setTimeout(() => {
      this.loader.classList.add('loaded')
    }, 500)
  }

  update() {

  }

  delete() {

  }
}