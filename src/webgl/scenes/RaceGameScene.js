import {Group, MathUtils, Mesh, MeshBasicMaterial, SphereGeometry} from 'three'
import WebGl from '../webglManager'
import Listener from '../utils/Listener'
import BlueBee from '@/webgl/entities/BlueBee'
import mapSetting from '@/webgl/elementsLocations/mapSetting.json'
import gsap from 'gsap'
import Queen from '@/webgl/entities/Queen'
import {randomIntFromInterval} from '@/webgl/utils/RandowBetweenTwo'
import treeLocation from '@/webgl/elementsLocations/raceGame/tree-race.json'
import lysLocation from '@/webgl/elementsLocations/raceGame/lys-race.json'
import daisyLocation from '@/webgl/elementsLocations/raceGame/daisy-race.json'
import stoneLocation from '@/webgl/elementsLocations/raceGame/stone-race.json'
import Grass from '@/webgl/shaders/grass/PollenGameGrass'
import Bloom from '@/webgl/shaders/bloom'
import {customEase} from '@/webgl/utils/CustomEase'
import {addDaisys, addLys, addStones, addTrees} from '@/webgl/elementsLoop/AddElements'

let raceGameInstance = null

export default class RaceGameScene extends Group {
  constructor() {
    super()

    if (raceGameInstance) {
      return raceGameInstance
    }

    raceGameInstance = this

    this.webGl = new WebGl()
    this.scene = this.webGl.scene
    this.resources = this.webGl.resources
    this.time = this.webGl.time
    this.loader = this.webGl.loader
    this.camera = this.webGl.camera

    this.postProcessing = new Bloom()

    // Game properties
    this.property = {
      map: {
        with: mapSetting[0].right,
        height: mapSetting[0].bottom,
        ratio: 5,
      },
      bee: {
        placingHeight: 1.5,
        limitRightLeft: 4,
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
          speed: 0.01
        },
        duration: 10000, // in ms
        obstacle: {
          number: 12
        }
      }
    }

    // Wait for resources
    this.resources.on(`sourcesReadyraceGame`, () => {
      this.setup()
    })
  }

  setupPopups(start, end) {
    this.popupStart = start
    this.popupEnd = end
  }

  setup() {
    // Import models
    this.bee = new BlueBee()
    this.hornet = new Queen()
    this.grass = new Grass(this.property.map.with / this.property.map.ratio, this.property.map.height / 2.5, 500000)
    this.portal = new Mesh(new SphereGeometry(1, 32, 16), new MeshBasicMaterial({color: 0xff0000}))

    this.groundGroup = new Group()
    this.allGrounds = new Group()

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

      const gameGUI = this.debug.ui.addFolder('game')
      gameGUI.add(this.property.game.bee, 'speed', 0, 0.003, 0.0001).name('Bee speed')
    }

    this.listener = new Listener()

    this.init()
  }

  init() {
    setTimeout(() => {
      this.loader.classList.add('loaded')
    }, 500)

    // Set fog
    this.scene.fog.density = 0.009

    // Set parameters of the scene at init
    this.camera.position.set(0, 0, -10)
    this.webGl.controls.enabled = false

    // Listener
    this.listener.on(`mouseMove`, () => {
      this.property.cursor.targetX = -this.listener.property.cursor.x * this.property.bee.limitRightLeft
      this.property.cursor.targetY = -this.listener.property.cursor.y * this.property.bee.placingHeight
    })

    // Elements position and state at init
    this.bee.model.position.set(0, 0, 0)
    this.bee.model.rotation.set(0, 6.3, 0)
    this.hornet.model.position.set(4, -1.5, -2)
    this.grass.position.set(0, -5, this.property.map.height / this.property.map.ratio)
    this.gamePlayed = false

    // Portal
    this.portal.position.set(0, 0, 50)
    this.portals = []
    for (let i = 0; i < this.property.game.obstacle.number; i++) {
      const thisPortal = this.portal.clone()
      thisPortal.position.set(randomIntFromInterval(-4, 4, 1), randomIntFromInterval(-1.5, 1.2, 1), randomIntFromInterval(15, (this.property.map.height / this.property.map.ratio) / 1.2, 5))
      this.portals.push(thisPortal)
    }

    // Hornet go back after the game is started
    gsap.to(this.hornet.model.position, {
      delay: 3,
      duration: 2,
      z: -8,
      ease: "power1.in",
    })

    // Add elements from map
    addDaisys(daisyLocation, this.groundGroup, this.resources.items.daisyModel.scene)
    addLys(lysLocation, this.groundGroup, this.resources.items.lysModel.scene)
    addStones(stoneLocation, this.groundGroup, this.resources.items.stoneModel.scene)
    addTrees(treeLocation, this.groundGroup, this.resources.items.treeModel.scene)

    // Add models
    this.add(this.bee.model)
    this.add(this.hornet.model)

    this.groundGroup.add(...this.portals)
    this.groundGroup.add(this.grass)

    this.secondGroundGroup = this.groundGroup.clone()
    this.secondGroundGroup.position.set(0, 0, this.property.map.height / this.property.map.ratio)
    this.allGrounds.add(this.groundGroup, this.secondGroundGroup)

    this.add(this.allGrounds)
  }

  playGame() {
    const numberOfSteps = 5
    let step = 0

    // Ground in the group of this.allGround
    const groundToMove = [
      this.groundGroup,
      this.secondGroundGroup
    ]

    const replaceGround = () => {
      let indexResult = step % 2 === 0 ? 1 : 0
      groundToMove[indexResult].position.z = groundToMove[indexResult].position.z + (this.property.map.height / this.property.map.ratio) * 2
    }

    this.gamePlayed = true

    const moveGround = () => {
      step++
      gsap.to(this.allGrounds.position, {
        duration: (numberOfSteps + 4) - step,
        z: (-(this.property.map.height / this.property.map.ratio) + 2) * step, // + 2 to see the bee at the end
        ease: "none",
      }).then(() => {
        if (step < numberOfSteps - 1) {
          replaceGround()
        }
        if (step < numberOfSteps) {
          moveGround()
        } else {
          this.popupEnd.classList.remove('hidden')
        }
      })
    }

    moveGround()
  }

  reStartGame() {
    // this.grass.position.set(0, -5, this.property.map.height / this.property.map.ratio)
    // this.secondGroundGroup.position.set(0, 0, this.property.map.height / this.property.map.ratio)

    // this.playGame()
    console.log('WIP marche pas')
  }

  hurtingPortal() {
    // if the bee hurt portal -> the hornet come closer
    gsap.to(this.hornet.model.position, {
      duration: 0.5,
      z: 2,
      ease: "power1.in",
    })

    // Red appear on screen
    gsap.to(this.postProcessing.vignettePass.uniforms.uIntensity, {
      value: 0.6,
      duration: 1.5,
      ease: customEase
    })

    // Go back to normal after 2.5s
    setTimeout( ()=>{
      gsap.to(this.hornet.model.position, {
        duration: 0.5,
        z: -2,
        ease: "power1.out",
      })
      this.postProcessing.vignettePass.uniforms.uIntensity.value = 0
    }, 2500)
  }

  update() {
    if (this.grass) {
      this.grass.update()
    }

    if (this.hornet) {
      this.hornet.update()
    }

    if (this.bee) {
      // Update anim bee
      this.bee.update()
    }

    if (this.bee && this.gamePlayed) {

      // Check collision between bee and portals
      for (const portal of this.portals) {
        const worldPosition = portal.position.clone()
        this.groundGroup.localToWorld(worldPosition)
        if (this.bee.model.position.distanceTo(worldPosition) <= 1) {
          portal.visible = false
          this.hurtingPortal()
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
    }
  }

  delete() {
  }
}