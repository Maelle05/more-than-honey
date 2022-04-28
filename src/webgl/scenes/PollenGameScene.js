import {Group} from 'three'
import WebGl from '../webglManager'

export default class PollenGameScene extends Group {
  constructor() {
    super()
    this.webGl = new WebGl()
    this.scene = this.webGl.scene
    this.resources = this.webGl.resources
    this.camera = this.webGl.camera
    this.loader = this.webGl.loader

    // Wait for resources
    this.resources.on(`sourcesReadypollenGame`, () => {
      this.setup()
    })
  }

  setup() {
    // Remove fog
    this.scene.fog.density = 0

    this.daisy = this.resources.items.daisyModel

    console.log(this.daisy)


    // Debug
    this.debug = this.webGl.debug

    if (this.debug.active) {
      const viewGUI = this.debug.ui.addFolder('Pollen Game Property')
      const camGUI = viewGUI.addFolder('Camera position')
      // camera position
      camGUI.add(this.camera.position, 'x', -10, 10).setValue(-3)
      camGUI.add(this.camera.position, 'y', -10, 10).setValue(3)
      camGUI.add(this.camera.position, 'z', -30, 10).setValue(-8)
    }

    this.init()
  }

  init() {
    // Set Camera position
    // this.webGl.camera.position.set(0, 2.62, -10)

    // Listener


    // End Loader
    setTimeout(()=>{
      this.loader.classList.add('loaded')
    }, 500)
    
  }

  update() {

  }

  delete() {

  }
}