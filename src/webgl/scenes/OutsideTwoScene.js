import WebGl from '../webglManager'
import {
  BoxGeometry,
  BufferGeometry,
  CatmullRomCurve3,
  Group,
  Line,
  LineBasicMaterial,
  MathUtils,
  Mesh,
  MeshBasicMaterial,
  Vector3
} from 'three'
import Particules from '../shaders/fireflies'
import Bee from '../entities/BlueBee'
import mapSetting from '../elementsLocations/mapSetting.json'
import stoneLocation from '../elementsLocations/outsideTwo/stone.json'
import daisyLocation from '../elementsLocations/outsideTwo/daisy.json'
import lysLocation from '../elementsLocations/outsideTwo/lys.json'
import treeLocation from '../elementsLocations/outsideTwo/tree.json'
import nenupharLocation from '../elementsLocations/outsideTwo/nenuphar.json'
import mushroomLocation from '../elementsLocations/outsideTwo/mushrooms.json'
import bridgeLocation from '../elementsLocations/outsideTwo/bridge.json'
import hornetLocation from '../elementsLocations/outsideTwo/hornet.json'
import beePath from '../elementsLocations/outsideTwo/beePath.json'
import Listener from '../utils/Listener'
import Grass from '@/webgl/shaders/grass/grass'
import gsap from 'gsap/all'
import {
  addBridge,
  addDaisys,
  addLys,
  addMushrooms,
  addNenuphar,
  addStones,
  addTrees
} from '@/webgl/elementsLoop/AddElements'
import store from '../../store/index'
import Hornet from '@/webgl/entities/Hornet'
import {convertPosition} from '@/webgl/utils/ConvertPosition'
import {SlideSubtitle} from '@/utils/audioSubtitles/subtitles'

let OutsideTwoInstance = null

export default class OutsideTwoScene extends Group {
  constructor() {
    if (OutsideTwoInstance) {
      return OutsideTwoInstance
    }

    super()

    OutsideTwoInstance = this

    this.webGl = new WebGl()
    this.scene = this.webGl.scene
    this.renderer = this.webGl.renderer
    this.camera = this.webGl.camera
    this.resources = this.webGl.resources
    this.time = this.webGl.time
    this.loader = this.webGl.loader

    this.mixer = []

    if (mapSetting[0].left != 0 || mapSetting[0].top != 0) {
      alert('La map n\'a pas les bonnes coordonn??es')
    }

    this.property = {
      map: {
        with: mapSetting[0].right,
        height: mapSetting[0].bottom,
        ratio: 5,
      },
      mouse: {
        target: new Vector3(),
        mouseX: null,
        mouseY: null
      },
      moveBee: {
        deltaLookAt: 0.007,
        speed: 0.0005,
        target: new Vector3(),
        curveCurrent: 0.03,
        curveTarget: 0.03,
        baseY: 2.5
      },
      camera: {
        target: 0,
        current: 0
      }
    }


    // Wait for resources
    this.resources.on(`sourcesReadyoutsideTwo`, () => {
      this.setup()
    })
  }

  initCursorComponent(cursor) {
    this.cursorComponent = cursor
  }

  getActiveTimelineItem(activeItem) {
    this.activeItem = activeItem.querySelector('.timeline__wrapper a.active .cursor')
  }

  setup() {
    this.bee = new Bee()
    this.hornet = new Hornet()
    this.particles = new Particules()
    this.grass = new Grass()
    this.tree = this.resources.items.treeModel.scene

    this.listener = new Listener()

    // Sound
    this.backgroundMusic = this.resources.items.BgMusicSoundOutsideOne
    this.voice = this.resources.items.ChapTwoOneThreeSound
    this.voiceHornet = this.resources.items.ChapTwoTwoSound


    // CURVE HANDLE
    // extract from .json and change format
    this.initialPoints = []
    for (let i = 0; i < beePath.length; i++) {
      this.initialPoints.push({
        x: (beePath[i].x / this.property.map.ratio) - this.property.map.with / this.property.map.ratio / 2,
        y: beePath[i].z ? beePath[i].z : this.property.moveBee.baseY,
        z: beePath[i].y / this.property.map.ratio
      })
    }
    // create cube for each point of the curve
    this.boxGeometry = new BoxGeometry(0.5, 0.5, 0.5)
    this.boxMaterial = new MeshBasicMaterial({color: 'red'})
    this.curveHandles = []
    for (const handlePos of this.initialPoints) {
      const handle = new Mesh(this.boxGeometry, this.boxMaterial)
      handle.position.copy(handlePos)
      this.curveHandles.push(handle)
      // this.add(handle)
    }
    // Calculate Smooth curve
    this.curve = new CatmullRomCurve3(
      this.curveHandles.map((handle) => handle.position)
    )
    this.curve.curveType = 'centripetal'
    this.curve.closed = false
    this.points = this.curve.getPoints(50)
    this.line = new Line(
      new BufferGeometry().setFromPoints(this.points),
      new LineBasicMaterial({color: 0x00ff00})
    )
    // this.add( this.line )

    this.init()
  }

  init() {
    // Subtitles
    this.subtitles = new SlideSubtitle(8)
    this.subtitlesTwo = new SlideSubtitle(9)

    // Set fog
    this.scene.fog.density = 0.015

    // Add bee
    this.beeMove = 0
    this.beePoss = this.curve.getPointAt(this.beeMove)
    this.beePoss2 = this.curve.getPointAt(this.beeMove + 0.01)
    this.bee.model.position.copy(this.beePoss)
    this.bee.model.lookAt(this.beePoss2)
    this.bee.model.scale.set(0.02, 0.02, 0.02)
    this.add(this.bee.model)

    // Add grass
    this.grass.position.set(0, 0, this.property.map.height / this.property.map.ratio)
    this.add(this.grass)

    // Add elements from map
    addLys(lysLocation, this, this.resources.items.lysModel.scene, true)
    addTrees(treeLocation, this, this.resources.items.treeModel.scene, true)
    addStones(stoneLocation, this, this.resources.items.stoneModel.scene, true)
    addDaisys(daisyLocation, this, this.resources.items.daisyModel.scene, true)
    addMushrooms(mushroomLocation, this, this.resources.items.mushroomModel.scene)
    addNenuphar(nenupharLocation, this, this.resources.items.nenupharModel.scene)
    addBridge(bridgeLocation, this, this.resources.items.bridgeModel.scene)

    // Hornet
    this.hornet.model.position.set(convertPosition(0, hornetLocation).x, 2, convertPosition(0, hornetLocation).z)
    this.hornet.model.scale.set(0.07, 0.07, 0.07)
    this.add(this.hornet.model)

    // Add particles
    this.particles.position.x -= 1
    this.add(this.particles)

    // Set Camera property
    this.webGl.camera.position.set(0, 20, (this.property.map.height + 200) / this.property.map.ratio)
    this.webGl.controls.enabled = false
    this.webGl.controls.target = new Vector3(0, -5, 0)

    // Listener
    let voiceInitStart = false
    let voiceHornetCanStart = false
    let voiceHornetStart = false

    this.listener.on('scroll', () => {
      const result = this.property.moveBee.curveTarget - this.listener.property.virtualScroll.delta / 90000

      if (voiceInitStart === false) {
        voiceInitStart = true
        setTimeout(() => {
          this.voice.sound.fade(0, store.state.isSongOn ? this.voice.volume : 0, .3)
          this.voice.sound.play()
          this.subtitles.init()

          // Move cursor above the timeline
          gsap.to(this.activeItem, {
            duration: 75,
            y: 70,
            ease: "none",
          })
          this.resources.on(`soundChapTwoOneThreeSoundFinished`, ()=>{
            voiceHornetCanStart = true
          })
        }, 1000)
      }

      if (voiceHornetStart === false && result > 0.8 && voiceHornetCanStart) {
        voiceHornetStart = true
        this.voiceHornet.sound.fade(0, store.state.isSongOn ? this.voiceHornet.volume : 0, .3)
        this.voiceHornet.sound.play()
        this.subtitlesTwo.init()
      }

      if (result > 0.03 && result < 0.98) {
        this.property.moveBee.curveTarget -= this.listener.property.virtualScroll.delta / 90000
      }
    })

    // Init Sounds
    this.backgroundMusic.sound.fade(0, store.state.isSongOn ? this.backgroundMusic.volume : 0, .3)
    this.backgroundMusic.sound.play()

    this.resources.on('soundChapTwoTwoSoundFinished', () => {
      this.cursorComponent.endScene()
    })

    setTimeout(() => {
      this.loader.classList.add('loaded')
    }, 500)
  }

  update() {
    if (this.curve) {
      this.property.moveBee.curveCurrent = MathUtils.damp(this.property.moveBee.curveCurrent, this.property.moveBee.curveTarget, this.property.moveBee.speed, this.time.delta)

      this.property.moveBee.target = this.curve.getPointAt(this.property.moveBee.curveCurrent)
      this.property.camera.target = this.curve.getPointAt(this.property.moveBee.curveCurrent + this.property.moveBee.deltaLookAt)

      this.bee.model.position.set(this.property.moveBee.target.x, this.property.moveBee.target.y - 0.5, this.property.moveBee.target.z)
      this.bee.model.lookAt(this.property.camera.target)

      const possCam = this.curve.getPointAt(this.property.moveBee.curveCurrent - 0.03)
      this.webGl.camera.position.set(possCam.x, possCam.y + 1, possCam.z)
      this.webGl.controls.target.set(this.property.camera.target.x, this.property.camera.target.y + 0.3, this.property.camera.target.z)
    }

    if (this.bee) {
      this.bee.update()
    }

    if(this.hornet) {
      this.hornet.update()
    }

    if (this.grass) {
      this.grass.update()
    }

    if (this.particles) {
      this.particles.update()
    }

  }

  delete() {

  }
}