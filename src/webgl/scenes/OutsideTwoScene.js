import {CircleGeometry, DoubleSide, Group, MathUtils, Mesh, MeshBasicMaterial, Vector3, AmbientLight} from 'three'
import WebGl from '../webglManager'
import Bee from '@/webgl/entities/BlueBee'
import Listener from '../utils/Listener'
import GrassMaterial from '../shaders/grassMaterial'
import Particules from '../shaders/particulesTest'

export default class OutsideTwoScene extends Group {
  constructor() {
    super()
    this.webGl = new WebGl()
    this.scene = this.webGl.scene
    this.camera = this.webGl.camera
    this.resources = this.webGl.resources

    this.sizes = this.webGl.sizes

    // Wait for resources
    this.resources.on(`sourcesReadyoutsideTwo`, () => {
      this.setup()
    })
  }

  setup() {
    this.bee = new Bee()
    this.grass = new GrassMaterial()
    this.particles = new Particules()

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
    this.camera.position.set(0, 5, -30)
    this.bee.model.position.set(0, 1.5, 0)
    this.webGl.controls.enabled = false
    this.webGl.controls.target = new Vector3(0, 0, 1000)

    // change glowy effect on this scene
    this.webGl.postPross.renderer.toneMappingExposure = Math.pow( 0.85, 4.0 )

    // Listener
    this.listener = new Listener()
    this.listener.on('scroll', ()=>{
      this.bee.model.position.z += this.listener.property.virtualScroll.delta / 100
      this.camera.position.z += this.listener.property.virtualScroll.delta / 100
    })

    // Add particles
    this.add(this.particles)

    // add models
    this.add(this.bee.model)
    this.add(this.grass)
  }

  update() {

    if (this.bee) {
      // Update anim bee
      this.bee.update()

      // rotate camera with cursor mouse
      this.camera.position.x = MathUtils.lerp(this.camera.position.x, (-this.listener.property.cursor.x * Math.PI) / 5, 0.1)
      // this.camera.rotation.y = MathUtils.lerp(this.camera.rotation.y, (this.listener.property.cursor.x * Math.PI) / 10, 0.1)

    }

    if (this.grass) {
      this.grass.update()
    }
  }

  delete() {
  }
}