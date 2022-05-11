import {Group, MathUtils, Mesh, MeshBasicMaterial, SphereGeometry} from 'three'
import WebGl from '../webglManager'
import Listener from '../utils/Listener'
import BlueBee from '@/webgl/entities/BlueBee'
import Grass from '@/webgl/shaders/grass'
import mapSetting from '@/webgl/elementsLocations/outsideOne/mapSetting.json'
import gsap from 'gsap'
import Queen from '@/webgl/entities/Queen'
import {randomIntFromInterval} from '@/webgl/utils/RandowBetweenTwo'

export default class RaceGameScene extends Group {
  constructor() {
    super()
    this.webGl = new WebGl()
    this.scene = this.webGl.scene
    this.resources = this.webGl.resources
    this.time = this.webGl.time
    this.loader = this.webGl.loader
    this.camera = this.webGl.camera

    // Game properties
    this.property = {
      map: {
        with: mapSetting[0].right,
        height: mapSetting[0].bottom,
        ratio : 5,
      },
      bee: {
        placingHeight: 1.5,
        limitRightLeft: 5,
        maxZ: 1.5
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
        },
        duration: 12,
        obstacle: {
          number: 7
        }
      }
    }

    // Wait for resources
    this.resources.on(`sourcesReadyraceGame`, () => {
      this.setup()
    })
  }

  setup() {
    // Import model
    this.bee = new BlueBee()
    this.hornet = new Queen()
    this.grass = new Grass()
    this.portal = new Mesh(new SphereGeometry( 1, 32, 16 ), new MeshBasicMaterial( { color: 0xff0000 } ) )

    this.groundGroup = new Group()

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
    this.camera.position.set(0, 0, -10)
    this.grass.position.set(0,-5, this.property.map.height / this.property.map.ratio)
    this.bee.model.position.set(0, 1.5, 0)
    this.bee.model.rotation.set(0, 6.3, 0)
    this.hornet.model.position.set(4, -1.5, -2)
    this.webGl.controls.enabled = false

    // Portal
    this.portal.position.set(0, 0, 50)

    // Listener
    this.listener.on(`mouseMove`, () => {
      this.property.cursor.targetX = -this.listener.property.cursor.x * this.property.bee.limitRightLeft
      this.property.cursor.targetY = -this.listener.property.cursor.y * this.property.bee.placingHeight
    })

    // Add models 
    this.add(this.bee.model)
    this.add(this.hornet.model)

    this.groundGroup.add(this.grass)

    this.portals = []
    for (let i = 0; i < this.property.game.obstacle.number; i++) {
      const thisPortal = this.portal.clone()
      thisPortal.position.set(randomIntFromInterval(-4,4, 1), randomIntFromInterval(-1.5,1.2, 1), randomIntFromInterval(40,(this.property.map.height / this.property.map.ratio) / 1.2, 5))
      this.portals.push(thisPortal)
    }
    this.groundGroup.add(...this.portals)


    // Move ground
    gsap.to(this.groundGroup.position, {
      duration: this.property.game.duration,
      z: -(this.property.map.height / this.property.map.ratio) / 1.2,
      ease: "power1.in",
    }).then(() => {
      console.log('finish')
    })

    this.add(this.groundGroup)
  }

  update() {
    if(this.grass) {
      this.grass.update()
    }

    if(this.hornet) {
      this.hornet.update()
    }

    if (this.bee) {
      // Update anim bee
      this.bee.update()

      // Check collision between bee and portals
      for(const portal of this.portals) {
        const worldPosition = portal.position.clone()
        this.groundGroup.localToWorld(worldPosition)
        if(this.bee.model.position.distanceTo(worldPosition) <= 1) {
          portal.visible = false
        }
      }

      // Update height
      this.property.cursor.currentX = MathUtils.damp(this.property.cursor.currentX, this.property.cursor.targetX, this.property.game.bee.speed, this.time.delta)
      this.property.cursor.currentY = MathUtils.damp(this.property.cursor.targetY, this.property.cursor.currentY, this.property.game.bee.speed, this.time.delta / 5)

      // Bee position
      this.bee.model.position.x = this.property.cursor.currentX
      this.bee.model.position.y = -this.property.cursor.currentY - this.property.bee.placingHeight / 3

      // Hornet position
      this.hornet.model.position.y = (Math.sin(this.time.elapsed / 700) / 5) - this.property.bee.placingHeight
      // this.hornet.model.position.x = (Math.sin(this.time.elapsed / 200) / 3)
      // this.hornet.model.position.z = (Math.sin(this.time.elapsed / 1100) * 10) - this.property.bee.maxZ
    }
  }

  delete() {
  }
}