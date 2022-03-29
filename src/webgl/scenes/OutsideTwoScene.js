import {Group} from 'three'
import WebGl from '../webglManager'
import Bee from '@/webgl/entities/Bee'

export default class OutsideTwoScene extends Group {
  constructor() {
    super()
    this.webGl = new WebGl()
    this.scene = this.webGl.scene
    this.resources = this.webGl.resources

    // Wait for resources
    this.resources.on(`sourcesReadyoutsideTwo`, () => {
      this.setup()
    })
  }

  setup() {
    this.bee = new Bee()

    //Debug
    this.debug = this.webGl.debug

    if (this.debug.active) {
      const viewGUI = this.debug.ui.addFolder('Point of view')

      const camGUI = viewGUI.addFolder('Camera position')
      camGUI.add(this.webGl.camera.position, 'x', -10, 10).setValue(-2)
      camGUI.add(this.webGl.camera.position, 'y', -10, 10).setValue(3)
      camGUI.add(this.webGl.camera.position, 'z', -30, 10).setValue(-8)

      const beeGUI = viewGUI.addFolder('Bee position')
      beeGUI.add(this.bee.model.position, 'y', -3, 2, 0.05).setValue(1.5)
    }


    this.init()
  }

  init() {
    // Set Camera position
    this.webGl.camera.position.set(-2, 3, -8)
    this.bee.model.position.y = -1.5

    // Listener

    // add models
    this.add(this.bee.model)
  }

  update() {
    if (this.bee) {
      // Update anim bee
      this.bee.update()

    }

  }

  delete() {

  }
}