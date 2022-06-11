import {Group, Vector3} from 'three'
import Particules from '../shaders/fireflies'
import Grass from '../shaders/grass/grassCinematique'
import WebGl from '../webglManager'
import {addBridge, addLys, addNenuphar, addTrees,} from '@/webgl/elementsLoop/AddElements'
import lysLocation from '../elementsLocations/cinematique/lys.json'
import treeLocation from '../elementsLocations/cinematique/tree.json'
import nenupharLocation from '../elementsLocations/cinematique/nenuphar.json'
import bridgeLocation from '../elementsLocations/cinematique/bridge.json'
import Listener from '../utils/Listener'
import gsap, { Back, Elastic, Power1 } from 'gsap/all'
import store from '../../store/index'
import {SlideSubtitle} from '../../utils/audioSubtitles/subtitles'
import {convertPosition} from '@/webgl/utils/ConvertPosition'
import hiveLocation from '../elementsLocations/cinematique/hive.json'
import BlueBee from '../entities/BlueBee'

let Instance = null

export default class HomeScene extends Group
{
  constructor(){
    if(Instance){
      return Instance
    }

    super()
    Instance = this

    this.webGl = new WebGl()
    this.scene = this.webGl.scene
    this.resources = this.webGl.resources

    this.quaternions = []

    // Wait for resources
    this.resources.on(`sourcesReadyhome`, () =>
    {
      this.setup()
    })
  }

  setup(){
    this.particles = new Particules()
    this.grass = new Grass()

    this.isXPPlay = false
    this.isCin = false

    // Sound
    this.backgroundMusic = this.resources.items.BgMusicSound
    this.voiceOne = this.resources.items.IntroHomeSound
    this.voiceTow = this.resources.items.CinematiqueSound

    this.init()
  }

  init(){
    // Subtitles
    this.subtitles = new SlideSubtitle(0)
    this.subtitlesTwo = new SlideSubtitle(1)

    // Listener
    this.listener = new Listener()

    // Set fog
    this.scene.fog.density = 0.012

    //grass
    this.grass.position.set(10, -2.3, 170)
    this.add(this.grass)

    // Particles
    this.add(this.particles)

    // Add elements from map
    addLys(lysLocation, this, this.resources.items.lysModel.scene, true)
    addTrees(treeLocation, this, this.resources.items.treeModel.scene, true)
    addNenuphar(nenupharLocation, this, this.resources.items.nenupharModel.scene)
    addBridge(bridgeLocation, this, this.resources.items.bridgeModel.scene)

    // Hive
    this.hive = this.resources.items.hiveExtModel.scene
    this.hive.position.set(convertPosition(0, hiveLocation).x, 6.7, convertPosition(0, hiveLocation).z)
    this.hive.scale.set(0.95, 0.95, 0.65)
    this.add(this.hive)

    // Bee
    this.bee = new BlueBee()
    this.bee.model.position.set(-15, 3, 130)
    this.add(this.bee.model)


    // Set Camera position
    this.camPos = {
      x: -60,
      y: 4,
      z: 83
    }
    this.webGl.camera.position.set(this.camPos.x, this.camPos.y, this.camPos.z)
    this.webGl.controls.target.set(20, 5, 83)

    // Lisener 

    setTimeout(() => {
      this.webGl.loader.classList.add('loaded')
      localStorage.setItem('isHomePassed', true)
    }, 1000)
  }

  play(refs){
    gsap.to(refs.intro, {
      opacity: 0,
      duration: .5,
    })
    gsap.to(refs.button, {
      opacity: 0,
      duration: .5,
    })
    gsap.to(refs.headphones, {
      opacity: 0,
      duration: 1,
      delay: 3
    })
    this.isXPPlay = true
    this.isCin = true

    const cinDuration = 25

    gsap.to(this.webGl.camera.position, {
      x: -5,
      y: 8,
      z: 120,
      duration: cinDuration,
      ease: 'none'
    })

    gsap.to(this.webGl.controls.target, {
      x: 45 ,
      y: 5,
      z: 0,
      duration: cinDuration,
      ease: 'none'
    }).then(()=>{
      this.isCin = false
    })

    //Song
    this.backgroundMusic.sound.fade(0, store.state.isSongOn ? this.backgroundMusic.volume : 0, .3)
    this.backgroundMusic.sound.play()
    setTimeout(()=>{
      this.voiceOne.sound.fade(0, store.state.isSongOn ? this.voiceOne.volume : 0, .3)
      this.voiceOne.sound.play()
      this.subtitles.init()
    }, 2000)
    
    this.resources.on(`soundIntroHomeSoundFinished`, ()=>{
      setTimeout(()=>{
        this.voiceTow.sound.fade(0, store.state.isSongOn ? this.voiceTow.volume : 0, .3)
        this.voiceTow.sound.play()
        this.subtitlesTwo.init()
      }, 2000)

      this.resources.on(`soundCinematiqueSoundFinished`, ()=>{
        // Cursor next scene
        this.cursorComponent.endScene()
      })
    })

    setTimeout(()=>{
      this.annimBee()
    }, 22000)

  }

  annimBee(){
    this.goToPoint(0)
  }

  update(){
    if (this.particles) {
      this.particles.update()
    }

    // parallax
    if (this.listener && !this.isXPPlay) {
      this.webGl.camera.position.set(this.camPos.x, this.camPos.y + 0.5 * this.listener.property.cursor.y, this.camPos.z + 1.5 * this.listener.property.cursor.x)
    } else if (this.listener && this.isCin) {
      this.webGl.camera.position.set(this.webGl.camera.position.x + 0.5 * this.listener.property.cursor.y, this.webGl.camera.position.y , this.webGl.camera.position.z + 1.5 * this.listener.property.cursor.x)
    } else if (this.listener) {
      this.webGl.camera.position.set( -5 + 0.5 * this.listener.property.cursor.y, 8 , 120 + 1.5 * this.listener.property.cursor.x)
    }

    if (this.bee) {
      this.bee.update()
    }
    
  }

  initCursorComponent(cursor){
    this.cursorComponent = cursor
  }

  delete(){
    
  }
}