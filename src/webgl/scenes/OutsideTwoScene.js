import {CircleGeometry, DoubleSide, Group, MathUtils, Mesh, MeshBasicMaterial, Vector2} from 'three'
import WebGl from '../webglManager'
import Bee from '@/webgl/entities/BlueBee'

export default class OutsideTwoScene extends Group {
  constructor() {
    super()
    this.webGl = new WebGl()
    this.scene = this.webGl.scene
    this.camera = this.webGl.camera
    this.resources = this.webGl.resources

    this.mouse = new Vector2()
    this.sizes = {
      width: window.innerWidth,
      height: window.innerHeight,
    }

    // Wait for resources
    this.resources.on(`sourcesReadyoutsideTwo`, () => {
      this.setup()
    })
  }

  setup() {
    this.bee = new Bee()

    // plane
    this.fakeFloor = new Mesh(
      new CircleGeometry(5, 64),
      new MeshBasicMaterial({color: 0xC571FF})
    )
    this.fakeFloor.material.side = DoubleSide
    this.fakeFloor.rotation.x = - Math.PI * 0.5
    this.fakeFloor.position.y = - 5
    this.fakeFloor.position.z =  5

    console.log(this.fakeFloor)

    // Debug
    this.debug = this.webGl.debug

    if (this.debug.active) {
      const viewGUI = this.debug.ui.addFolder('Point of view')

      const camGUI = viewGUI.addFolder('Camera position')
      // camera position
      camGUI.add(this.camera.position, 'x', -10, 10).setValue(-3)
      camGUI.add(this.camera.position, 'y', -10, 10).setValue(3)
      camGUI.add(this.camera.position, 'z', -30, 10).setValue(-8)

      const beeGUI = viewGUI.addFolder('Bee position')
      beeGUI.add(this.bee.model.position, 'y', -3, 2, 0.05).setValue(1.5)
    }


    this.init()
  }

  init() {
    // Set camera & bee position at init
    this.camera.position.set(-3, 3, -8)
    this.bee.model.position.y = -1.5

    // change glowy effect on this scene
    this.webGl.postPross.renderer.toneMappingExposure = Math.pow( 0.85, 4.0 )
    this.webGl.controls.enabled = false

    // Listener
    window.addEventListener("mousemove", (e) => {
      this.mouse.x = (e.clientX / this.sizes.width) * 2 - 1;
      this.mouse.y = -(e.clientY / this.sizes.height) * 2 + 1;
    })

    // add models
    this.add(this.bee.model)
    this.add(this.fakeFloor)
  }

  update() {
    if (this.bee) {
      // Update anim bee
      this.bee.update()

      // rotate camera with cursor mouse
      this.camera.position.x = MathUtils.lerp(this.camera.position.x, - this.mouse.x, 0.1)

    }

  }

  delete() {

  }
}