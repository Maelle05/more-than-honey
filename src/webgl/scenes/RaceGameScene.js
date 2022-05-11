import {Group, MathUtils} from 'three'
import WebGl from '../webglManager'
import Listener from '../utils/Listener'
import BlueBee from '@/webgl/entities/BlueBee'
import Grass from '@/webgl/shaders/grass'
import mapSetting from '@/webgl/elementsLocations/outsideOne/mapSetting.json'

export default class RaceGameScene extends Group {
  constructor() {
    super()
    this.webGl = new WebGl()
    this.scene = this.webGl.scene
    this.resources = this.webGl.resources
    this.time = this.webGl.time
    this.loader = this.webGl.loader

    // Game properties
    this.property = {
      map: {
        with: mapSetting[0].right,
        height: mapSetting[0].bottom,
        ratio : 5,
      },
      bee: {
        placingHeight: 1.5,
        limitRightLeft: 5
      },
      cursor: {
        currentX: 0,
        currentY: 0,
        targetX: 0,
        targetY: 0
      },
      game: {
        bee: {
          speed: 0.001
        }
      }
    }

    // Wait for resources
    this.resources.on(`sourcesReadyraceGame`, () => {
      this.setup()
    })
  }

  setup() {
    // Add Bee
    this.bee = new BlueBee()
    this.grass = new Grass()

    // Debug
    this.debug = this.webGl.debug
    if (this.debug.active) {
      const viewGUI = this.debug.ui.addFolder('Vision')

      const camGUI = viewGUI.addFolder('Position Camera')
      camGUI.add(this.webGl.camera.position, 'x', -10, 10)
      camGUI.add(this.webGl.camera.position, 'y', -10, 10)
      camGUI.add(this.webGl.camera.position, 'z', -30, 10)

      const beePlacingGUI = viewGUI.addFolder('Bee Placing')
      beePlacingGUI.add(this.property.bee, 'placingHeight', -2, 3, 0.01).name('Height')
      beePlacingGUI.add(this.property.bee, 'limitRightLeft', 0, 5, 0.01).name('Limits left and right')

      const gameGUI = this.debug.ui.addFolder('Game')
      gameGUI.add(this.property.game.bee, 'speed', 0, 0.003, 0.0001).name('Bee speed')

    }

    this.listener = new Listener()

    this.init()
  }

  init() {
    setTimeout(() => {
      this.loader.classList.add('loaded')
    }, 500)

    // Set parameters of the scene at init
    // this.webGl.camera.position.set(0, 2.62, -10)
    this.webGl.camera.position.set(0, 0, -10)
    this.grass.position.set(0,-5, this.property.map.height / this.property.map.ratio)
    this.bee.model.position.set(0, 1.5, 0)
    this.bee.model.rotation.set(0, 6.3, 0)
    this.webGl.controls.enabled = false

    // Listener
    this.listener.on(`mouseMove`, () => {
      this.property.cursor.targetX = -this.listener.property.cursor.x * this.property.bee.limitRightLeft
      this.property.cursor.targetY = -this.listener.property.cursor.y * this.property.bee.placingHeight
    })

    // Add models 
    this.add(this.bee.model)
    this.add(this.grass)
  }

  update() {
    if (this.bee) {
      // Update anim bee
      this.bee.update()

      // Update height
      this.property.cursor.currentX = MathUtils.damp(this.property.cursor.currentX, this.property.cursor.targetX, this.property.game.bee.speed, this.time.delta)
      this.property.cursor.currentY = MathUtils.damp(this.property.cursor.targetY, this.property.cursor.currentY, this.property.game.bee.speed, this.time.delta / 5)

      this.bee.model.position.x = this.property.cursor.currentX
      this.bee.model.position.y = -this.property.cursor.currentY - this.property.bee.placingHeight / 3
    }
  }

  delete() {
  }
}