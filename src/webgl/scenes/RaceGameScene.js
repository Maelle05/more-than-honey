import {
  DoubleSide,
  Group,
  MathUtils,
  Mesh,
  MeshStandardMaterial,
  PlaneBufferGeometry,
} from 'three'
import WebGl from '../webglManager'
import Listener from '../utils/Listener'
import BlueBee from '@/webgl/entities/BlueBee'
import mapSetting from '@/webgl/elementsLocations/mapSetting.json'
import gsap from 'gsap'
import {randomIntFromInterval} from '@/webgl/utils/RandowBetweenTwo'
import treeLocation from '@/webgl/elementsLocations/raceGame/tree-race.json'
import lysLocation from '@/webgl/elementsLocations/raceGame/lys-race.json'
import daisyLocation from '@/webgl/elementsLocations/raceGame/daisy-race.json'
import stoneLocation from '@/webgl/elementsLocations/raceGame/stone-race.json'
import Grass from '@/webgl/shaders/grass/PollenGameGrass'
import Bloom from '@/webgl/shaders/bloom'
import {customEase} from '@/webgl/utils/CustomEase'
import {addDaisys, addLys, addStones, addTrees} from '@/webgl/elementsLoop/AddElements'
import Hornet from '@/webgl/entities/Hornet'
import { Vector3 } from 'three'

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
      sitting: {
        step: 0,
      },
      game: {
        bee: {
          speed: 0.01
        },
        numberOfLife: 5,
        numberOfMap: 5,
        duration: 10000, // in ms
        obstacle: {
          number: 3,
          lastHurt: '',
        }
      }
    }

    // Wait for resources
    this.resources.on(`sourcesReadyraceGame`, () => {
      this.setup()
    })
  }

  setupDomElements(start, end, lottie, ui, lifeBar) {
    this.popupStart = start
    this.popupEnd = end
    this.lottie = lottie
    this.raceUI = ui
    this.lifeBar = lifeBar
  }

  getActiveTimelineItem(activeItem) {
    this.activeItem = activeItem.querySelector('.timeline__wrapper a.active .cursor')
  }

  setup() {
    // Import models
    this.bee = new BlueBee()
    this.hornet = new Hornet()
    this.grass = new Grass(this.property.map.with / this.property.map.ratio, this.property.map.height / this.property.map.ratio, 500000)

    // Sound 
    this.backgroundMusic = this.resources.items.BgMusicSound
    this.voiceIntro = this.resources.items.ChapTwoThreeSound
    this.impactSound = this.resources.items.ImactSound

    const pesticideGeometry = new PlaneBufferGeometry(2.5,2.5)
    const pesticideMaterial = new MeshStandardMaterial({
      color: 0x8EFFC9,
      side: DoubleSide,
      map: this.webGl.resources.items.smokeTexture,
      transparent: true
    })

    this.pesticideCloud = new Group
    // One cloud of pesticide
    for(let i=0; i<this.property.game.obstacle.number; i++) {
      let particle = new Mesh(pesticideGeometry, pesticideMaterial)
      particle.position.set(
        0.03 * i * Math.cos((4 * i * Math.PI) / 180),
        0.03 * i * Math.sin((4 * i * Math.PI) / 180),
        0.03 * i
      )
      particle.rotation.z = Math.random() * 360
      this.pesticideCloud.add(particle)
    }
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
    // this.camera.position.set(0, 0, -10)
    // this.webGl.controls.target = new Vector3(0, 0, 20)
    // this.webGl.controls.enabled = false

    // Listener
    this.listener.on(`mouseMove`, () => {
      this.property.cursor.targetX = -this.listener.property.cursor.x * this.property.bee.limitRightLeft
      this.property.cursor.targetY = -this.listener.property.cursor.y * this.property.bee.placingHeight
    })

    // Elements position and state at init
    this.bee.model.scale.set(0.06, 0.06, 0.06)
    this.bee.model.position.set(0, 0, 0)
    this.bee.model.rotation.set(0, 6.3, 0)
    this.grass.position.set(0, -5, this.property.map.height / this.property.map.ratio / 2)
    this.gamePlayed = false

    // Pesticides
    this.portals = []
    for (let i = 0; i < this.property.game.obstacle.number; i++) {
      const clonePortal = this.pesticideCloud.clone()
      clonePortal.name = 'cloud'+i
      clonePortal.rotation.set(Math.random() / 10, Math.random() / 10, Math.random() / 10)
      clonePortal.position.set(randomIntFromInterval(-4, 4, 1), randomIntFromInterval(-1.5, 1.2, 1), randomIntFromInterval(15, (this.property.map.height / this.property.map.ratio) / 1.2, 5))
      this.portals.push(clonePortal)
    }

    // Add elements from map
    addDaisys(daisyLocation, this.groundGroup, this.resources.items.daisyModel.scene)
    addLys(lysLocation, this.groundGroup, this.resources.items.lysModel.scene, false)
    addStones(stoneLocation, this.groundGroup, this.resources.items.stoneModel.scene)
    addTrees(treeLocation, this.groundGroup, this.resources.items.treeModel.scene)

    // Add models
    this.add(this.bee.model, this.hornet.model)

    this.groundGroup.add(...this.portals, this.grass)

    this.secondGroundGroup = this.groundGroup.clone()
    this.secondGroundGroup.position.set(0, 0, this.property.map.height / this.property.map.ratio)
    this.allGrounds.add(this.groundGroup, this.secondGroundGroup)

    // Add one map
    this.add(this.allGrounds)

    this.cinematique()
  }

  cinematique(){
    const cinematiqueTime = 12

    // Set Camera position
    this.camera.position.set(10, -5, -10)
    this.webGl.controls.target.set(10, 0, 0 )

    // Sound
    this.backgroundMusic.sound.fade(0, this.backgroundMusic.volume, .3)
    this.backgroundMusic.sound.play()

    this.voiceIntro.sound.fade(0, this.voiceIntro.volume, .3)
    this.voiceIntro.sound.play()

    // Hornet init position
    this.hornet.model.position.set(12, -4, -2)
    this.hornet.model.rotation.y = Math.PI/2

    gsap.to(this.hornet.model.position, {
      duration: 9,
      x: 4,
      y: -1.5,
      z: -2,
      ease: "power1.in",
    })

    gsap.to(this.hornet.model.rotation, {
      duration: 10,
      y: Math.PI,
      ease: "power1.in",
    })

    gsap.to(this.camera.position, {
      x: 0,
      y: 0,
      z: -10,
      duration: cinematiqueTime,
      delay: 0.7,
      ease: 'none'
    })

    gsap.to(this.webGl.controls.target, {
      x: 0,
      y: 0,
      z: 20,
      duration: cinematiqueTime,
      delay: 0.7,
      ease: 'none'
    }).then(()=>{
      this.popupStart.classList.remove('u-hidden')
    })
  }

  playGame() {

    // move cursor above the timeline
    gsap.to(this.activeItem, {
      duration: 25,
      y: 100,
      ease: "none",
    })

    // Display ui
    this.lifeBar.classList.remove('u-hidden')

    // Hornet go back after the game is started
    gsap.to(this.hornet.model.position, {
      duration: 2.5,
      z: -8,
      ease: "power1.in",
    })

    // Ground in the group of this.allGround
    const groundToMove = [
      this.groundGroup,
      this.secondGroundGroup
    ]

    const replaceGround = () => {
      let indexResult = this.property.sitting.step % 2 === 0 ? 1 : 0
      groundToMove[indexResult].position.z = groundToMove[indexResult].position.z + (this.property.map.height / this.property.map.ratio) * 2
    }

    this.gamePlayed = true

    const moveGround = () => {
      this.property.sitting.step++
      gsap.to(this.allGrounds.position, {
        duration: (this.property.game.numberOfMap + 3) - this.property.sitting.step,
        z: (-(this.property.map.height / this.property.map.ratio) + 2) * this.property.sitting.step, // + 2 to see the bee at the end
        ease: "none",
      }).then(() => {
        if (this.property.sitting.step < this.property.game.numberOfMap - 1) {
          replaceGround()
        }
        if (this.property.sitting.step < this.property.game.numberOfMap) {
          moveGround()
        } else {
          this.endOfTheGame()
        }
      })
    }

    moveGround()
  }

  reStartGame() {
    this.allGrounds.position.set(0, 0, 0)
    this.groundGroup.position.set(0, 0, 0)
    this.secondGroundGroup.position.set(0, 0, this.property.map.height / this.property.map.ratio)

    this.property.sitting.step = 0
    this.property.game.numberOfLife = 5
    this.property.game.obstacle.lastHurt = ''

    setTimeout(()=>{
      this.playGame()
    }, 3500)
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

    this.lottie.classList.remove('u-hidden')

    // User loose one life TODO finish
    // if(this.property.game.numberOfLife > 0) {
    //   this.property.game.numberOfLife = this.property.game.numberOfLife -1
    //   this.lifeBar.innerHTML = this.property.game.numberOfLife
    // }

    // Go back to normal after 2.5s
    setTimeout( ()=>{
      gsap.to(this.hornet.model.position, {
        duration: 0.5,
        z: -2,
        ease: "power1.out",
      })
      this.postProcessing.vignettePass.uniforms.uIntensity.value = 0
      this.lottie.classList.add('u-hidden')
    }, 2500)
  }

  endOfTheGame() {
    this.lottie.classList.add('u-hidden')
    this.popupEnd.classList.remove('u-hidden')
    this.raceUI.classList.remove('u-cursor-hidden')
  }

  update() {
    if (this.grass) {
      this.grass.update()
    }

    if (this.hornet) {
      this.hornet.update()
    }

    if (this.bee) {
      this.bee.update()
    }

    if (this.bee && this.gamePlayed) {
      // Check collision between bee and portals
      for (const portal of this.portals) {
        const portalsPosition = portal.position.clone()

        if (this.property.sitting.step % 2 === 1) {
          this.groundGroup.localToWorld(portalsPosition)
        } else {
          this.secondGroundGroup.localToWorld(portalsPosition)
        }
        
        if (this.bee.model.position.distanceTo(portalsPosition) <= 1.5 && !this.property.game.obstacle.lastHurt.includes(portal.name)) {
          let pest = null
          if (this.property.sitting.step % 2 === 1) {
            pest = portal
          } else {
            this.secondGroundGroup.children.forEach(child => {
              if (child.name === portal.name) {
                pest = child
              }
            })
          }
          pest.visible = false
          this.property.game.obstacle.lastHurt =  this.property.game.obstacle.lastHurt + ' ' + portal.name 
          setTimeout(()=>{
            this.property.game.obstacle.lastHurt = this.property.game.obstacle.lastHurt.replace(portal.name, '')
            pest.visible = true
          }, 500)
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