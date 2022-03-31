import {CircleGeometry, DoubleSide, Group, MathUtils, Mesh, MeshBasicMaterial, Vector3} from 'three'
import WebGl from '../webglManager'
import Bee from '@/webgl/entities/BlueBee'
import Listener from '../utils/Listener'

export default class OutsideTwoScene extends Group {
  constructor() {
    super()
    this.webGl = new WebGl()
    this.scene = this.webGl.scene
    this.camera = this.webGl.camera
    this.resources = this.webGl.resources

    this.sizes = this.webGl.sizes

    this.mouseScrollhandle = this.moveOnScroll.bind(this)

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
      new MeshBasicMaterial({color: 0x0000ff})
    )
    this.fakeFloor.material.side = DoubleSide
    this.fakeFloor.rotation.x = - Math.PI * 0.5
    this.fakeFloor.position.y = - 5
    this.fakeFloor.position.z =  100

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
    // Set parameters of the scene at init
    this.camera.position.set(0, 0, -10)
    this.bee.model.position.set(0, -1.5, 0)
    this.webGl.controls.enabled = false
    this.webGl.controls.target = new Vector3(0, 0, 1000)

    // change glowy effect on this scene
    this.webGl.postPross.renderer.toneMappingExposure = Math.pow( 0.85, 4.0 )

    // Listener
    this.listener = new Listener()

    document.addEventListener('wheel', this.mouseScrollhandle)

    // add models
    this.add(this.bee.model)
    this.add(this.fakeFloor)
  }

  moveOnScroll() {
    this.bee.model.position.z ++
    this.camera.position.z ++

  }

  update() {

    if (this.bee) {
      // Update anim bee
      this.bee.update()

      // rotate camera with cursor mouse
      this.camera.position.x = MathUtils.lerp(this.camera.position.x, (-this.listener.property.cursor.x * Math.PI) / 5, 0.1)
      // this.camera.rotation.y = MathUtils.lerp(this.camera.rotation.y, (this.listener.property.cursor.x * Math.PI) / 10, 0.1)

    }
  }

  delete() {
    document.removeEventListener('wheel', this.mouseScrollhandle)
  }
}