import {Group, MathUtils, Mesh, MeshBasicMaterial, SphereGeometry, Vector2, Vector3} from 'three'
import BlueBee from '../entities/BlueBee'
import DaisyGame from '../entities/DaisyGame'
import Listener from '../utils/Listener'
import WebGl from '../webglManager'
import {randomIntFromInterval} from '@/webgl/utils/RandowBetweenTwo'
import gsap from 'gsap'
import Bloom from '../shaders/bloom'
import Grass from '../shaders/grass/PollenGameGrass'
import {customEase} from '@/webgl/utils/CustomEase'
import Butterflie from '@/webgl/entities/ButterflieBot'
import store from '../../store/index'
import {SlideSubtitle} from '@/utils/audioSubtitles/subtitles'
import { leaderBoard } from '../../utils/leaderBord'

let gameInstance = null

export default class PollenGameScene extends Group {
  constructor() {
    if(gameInstance){
      return gameInstance
    }

    super()
    gameInstance = this

    this.webGl = new WebGl()
    this.scene = this.webGl.scene
    this.resources = this.webGl.resources
    this.camera = this.webGl.camera
    this.loader = this.webGl.loader

    this.PostPros =  new Bloom()

    this.leaderBord = new leaderBoard()

    this.nbDaisys = 50
    this.positionDaisys = [
      {
        x: -3.5,
        y: 0,
        z: 0.7,
      }
    ]
    this.cursor = new Vector2()

    // Wait for resources
    this.resources.on(`sourcesReadypollenGame`, () => {
      this.setup()
    })
  }

  getActiveTimelineItem(activeItem) {
    this.activeItem = activeItem.querySelector('.timeline__wrapper a.active .cursor')
  }

  setDOM(dom){
    // Get all ui elements
    this.pollenUI = dom

    this.chrono = {
      div: dom.getElementsByClassName('chrono')[0],
      label: dom.querySelector('.chrono p')
    }

    this.domCount = {
      div: dom.getElementsByClassName('count')[0],
      label: dom.querySelector('.count p')
    }

    this.loaderPollen = {
      div: dom.getElementsByClassName('loaderPollen')[0],
      flowers: dom.querySelectorAll('.loaderPollen .loaderSpinner div'),
      label: dom.querySelector('.loaderPollen p')
    }

    this.startPopUp = dom.getElementsByClassName('popupPollen')[0]
    this.endPopUp = dom.getElementsByClassName('popupPollen')[1]

    this.lottieLose = dom.getElementsByClassName('lottieLoseForaged')[0]
  }

  setup() {
    // Elements of the scene
    this.daisy = new DaisyGame()
    this.bee = new BlueBee()
    this.grass = new Grass(this.nbDaisys + 20, 60, 400000)
    this.tree = this.resources.items.treeModel.scene
    this.mushroom = this.resources.items.mushroomModel.scene
    this.lys = this.resources.items.lysModel.scene
    this.bridge = this.resources.items.bridgeModel.scene

    // Sound
    this.backgroundMusic = this.resources.items.BgMusicSoundOutsideOne
    this.musicInGame = this.resources.items.BgMusicSoundPollenGame
    this.voiceIntro = this.resources.items.ChapTwoOneSound
    this.ChapTwoOneTwoSound = this.resources.items.ChapTwoOneTwoSound
    this.impact = this.resources.items.ImpactSound
    this.achievement = this.resources.items.achievementSound
    this.isFlowerSongPlay = false

    // Random position for all daisy
    for (let i = 0; i < this.nbDaisys; i++) {
      this.positionDaisys.push({
        x: this.positionDaisys[i].x + randomIntFromInterval(0.4, 1.6, 0.04),
        y: 0,
        z: randomIntFromInterval(-3.5, 3.5, 0.04)
      })
    }

    // Add daisys on scene
    this.daisys = []
    for (let i = 0; i < this.positionDaisys.length; i++) {
      const thisDaisy = this.daisy.model.clone()
      thisDaisy.position.set(this.positionDaisys[i].x, this.positionDaisys[i].y, this.positionDaisys[i].z)
      thisDaisy.rotation.y = randomIntFromInterval(0, 1, 0.002)
      this.addPollenOnDaisy(thisDaisy)
      this.daisys.push(thisDaisy)
      this.add(thisDaisy)
    }

    // Debug
    this.debug = this.webGl.debug

    if (this.debug.active) {
      const viewGUI = this.debug.ui.addFolder('Pollen Game Property')
      const camGUI = viewGUI.addFolder('Camera position')
      // camera position
      camGUI.add(this.camera.position, 'x', -10, 10).setValue(0)
      camGUI.add(this.camera.position, 'y', 0, 50).setValue(10)
      camGUI.add(this.camera.position, 'z', -30, 10).setValue(5)
    }

    this.init()
  }

  init() {
    // Subtitles
    this.subtitles = new SlideSubtitle(7)

    // Game property
    this.gameProperty = {
      foraged: [],
      camTarget: new Vector3(this.positionDaisys[this.positionDaisys.length-1].x, 10, 5),
      controlsTarget: new Vector3(this.positionDaisys[this.positionDaisys.length-1].x, 0, 0),
      beeCanMouve: true,
      spaceIsPress: false,
      durationGame: 70,
      currentLoadPollen: new Array(this.nbDaisys + 1),
      lastIntersectBB: '',
      cursorIsInvert: false,
      isFinish: false
    }

    this.gamePlayed = false

    // Change fog
    this.scene.fog.density = 0.015

    // Set init position of elements
    this.bee.model.position.set(-4, 1, 0.5)
    this.bee.model.scale.set(0.02, 0.02, 0.02)
    this.beeTarget = {
      x: -3.99,
      y: 1,
      z: 0.5,
    }

    this.grass.position.set(this.nbDaisys / 2, 0, 0)

    this.add(this.bee.model, this.grass, this.bridge)

    // Add Trees
    const nbTrees = 25
    for (let i = 0; i <= nbTrees; i++) {
      const cloneTree = this.tree.clone()
      cloneTree.position.set(
        randomIntFromInterval(-3, this.gameProperty.camTarget.x + 10, 0.5),
        0.5,
        i > nbTrees/4 ? randomIntFromInterval(-3.5, -25, 0.5) : randomIntFromInterval(14, 20, 0.5)
      )
      cloneTree.scale.set(3, 3, 3)
      cloneTree.rotation.y = randomIntFromInterval(0, 1, 0.02)
      this.add(cloneTree)
    }

    // Add mushroom
    const nbMushroom = 25
    for (let i = 0; i <= nbMushroom; i++) {
      const cloneMushroom = this.mushroom.clone()
      cloneMushroom.position.set(
        randomIntFromInterval(-3, this.gameProperty.camTarget.x + 3, 0.5),
        0.3,
        i > nbMushroom/4 ? randomIntFromInterval(-2, -15, 0.5) : randomIntFromInterval(3.5, 10, 0.5)
      )
      cloneMushroom.scale.set(0.5, 0.5, 0.5)
      cloneMushroom.rotation.y = randomIntFromInterval(0, 1, 0.02)
      this.add(cloneMushroom)
    }

    // Add Lys
    const nbLys = 25
    for (let i = 0; i <= nbLys; i++) {
      const cloneLys = this.lys.clone()
      cloneLys.position.set(
        randomIntFromInterval(-3, this.gameProperty.camTarget.x + 3, 0.5),
        0.7,
        i > nbLys/4 ? randomIntFromInterval(-2, -15, 0.5) : randomIntFromInterval(3, 10, 0.5)
      )
      cloneLys.scale.set(0.05, 0.05, 0.05)
      cloneLys.rotation.y = randomIntFromInterval(0, 1, 0.02)
      this.add(cloneLys)
    }

    // Add Bridge
    this.bridge.position.x = this.gameProperty.camTarget.x + 8
    this.bridge.rotation.y = 0.7

    // Init butterflies BOT
    const nbBot = 10
    this.butterflies = []
    for (let i = 0; i < nbBot; i++) {
      this.butterflies.push(new Butterflie(this, this.positionDaisys, i))
    }

    // End Loader
    setTimeout(()=>{
      this.loader.classList.add('loaded')
    }, 1000)

    this.initAnim()
  }

  update() {
    if (this.bee && this.gamePlayed) {
      // Move Bee
      this.bee.update()
      if (this.gameProperty.beeCanMouve) {
        this.bee.model.position.z = MathUtils.damp(this.bee.model.position.z, this.beeTarget.z, 0.07, .8)
        this.bee.model.position.x = MathUtils.damp(this.bee.model.position.x, this.beeTarget.x, 0.07, .8)
        this.bee.model.lookAt(this.beeTarget.x, this.beeTarget.y, this.beeTarget.z )
      }

      for (let i = 0; i < this.positionDaisys.length; i++) {
        // Check if bee is on daisy
        if (
        this.bee.model.position.x > (Math.round(this.positionDaisys[i].x * 10) / 10) - 0.2
        && this.bee.model.position.x < (Math.round(this.positionDaisys[i].x * 10) / 10) + 0.2
        && this.bee.model.position.z > (Math.round(this.positionDaisys[i].z * 10) / 10) - 0
        && this.bee.model.position.z < (Math.round(this.positionDaisys[i].z * 10) / 10) + 0.4
        && this.gameProperty.spaceIsPress
        && !this.gameProperty.isFinish
        ) {
          this.gameProperty.beeCanMouve = false
          this.loaderPollen.div.classList.remove('u-hidden')
          this.loaderPollen.div.style.left = this.listener.property.cursorOnWind.x + 'px'
          this.loaderPollen.div.style.top = this.listener.property.cursorOnWind.y + 'px'

          if (this.gameProperty.currentLoadPollen[i]) {
            if (this.gameProperty.currentLoadPollen[i] === 58 ) {
              if (!this.gameProperty.foraged.includes(i)) {
                this.gameProperty.foraged.push(i)
              }
            } else {
              this.gameProperty.currentLoadPollen[i]++
            }
            
          } else {
            this.gameProperty.currentLoadPollen[i] = 1
          }

          // Loader cursor foraged
          if(!this.gameProperty.foraged.includes(i)){
            if (this.gameProperty.currentLoadPollen[i] < 5) {
              this.loaderPollen.flowers.forEach((flower)=>{
                flower.style.opacity = 0.2
              })
            } else if (this.gameProperty.currentLoadPollen[i] < 10) {
              this.loaderPollen.flowers.forEach((flower, index)=>{
                index === 0 ? flower.style.opacity = 1 : flower.style.opacity = 0.2
              })
            } else if (this.gameProperty.currentLoadPollen[i] < 15) {
              this.loaderPollen.flowers.forEach((flower, index)=>{
                index <= 1 ? flower.style.opacity = 1 : flower.style.opacity = 0.2
              })
            } else if (this.gameProperty.currentLoadPollen[i] < 20) {
              this.loaderPollen.flowers.forEach((flower, index)=>{
                index <= 2 ? flower.style.opacity = 1 : flower.style.opacity = 0.2
              })
            } else if (this.gameProperty.currentLoadPollen[i] < 25) {
              this.loaderPollen.flowers.forEach((flower, index)=>{
                index <= 3 ? flower.style.opacity = 1 : flower.style.opacity = 0.2
              })
            } else if (this.gameProperty.currentLoadPollen[i] < 30) {
              this.loaderPollen.flowers.forEach((flower, index)=>{
                index <= 4 ? flower.style.opacity = 1 : flower.style.opacity = 0.2
              })
            } else if (this.gameProperty.currentLoadPollen[i] < 35) {
              this.loaderPollen.flowers.forEach((flower, index)=>{
                index <= 5 ? flower.style.opacity = 1 : flower.style.opacity = 0.2
              })
            } else if (this.gameProperty.currentLoadPollen[i] < 40) {
              this.loaderPollen.flowers.forEach((flower, index)=>{
                index <= 6 ? flower.style.opacity = 1 : flower.style.opacity = 0.2
              })
            } else if (this.gameProperty.currentLoadPollen[i] < 45) {
              this.loaderPollen.flowers.forEach((flower, index)=>{
                index <= 7 ? flower.style.opacity = 1 : flower.style.opacity = 0.2
              })
            } else if (this.gameProperty.currentLoadPollen[i] < 50) {
              this.loaderPollen.flowers.forEach((flower, index)=>{
                index <= 9 ? flower.style.opacity = 1 : flower.style.opacity = 0.2
              })
            } else if (this.gameProperty.currentLoadPollen[i] < 55) {
              this.loaderPollen.flowers.forEach((flower, index)=>{
                index <= 10 ? flower.style.opacity = 1 : flower.style.opacity = 0.2
              })
            } else if (this.gameProperty.currentLoadPollen[i] === 58) {
              this.loaderPollen.flowers.forEach((flower, index)=>{
                index <= 11 ? flower.style.opacity = 1 : flower.style.opacity = 0.2
              })
              
              // Init Sounds
              if (!this.isFlowerSongPlay) {
                this.isFlowerSongPlay = true
                this.ChapTwoOneTwoSound.sound.fade(0, store.state.isSongOn ? this.ChapTwoOneTwoSound.volume : 0, .3)
                this.ChapTwoOneTwoSound.sound.play()
              } else {
                this.achievement.sound.fade(0, store.state.isSongOn ? this.achievement.volume : 0, .3)
                this.achievement.sound.play()
              }
              
            }
          }

        }
      }

      // Score count
      this.domCount.label.innerHTML = this.gameProperty.foraged.length
    }

    if (this.bee && !this.gamePlayed){
      // Anim Bee if game not started
      this.bee.update()
      this.bee.model.lookAt(this.beeTarget.x, this.beeTarget.y, this.beeTarget.z )
    }

    if(this.butterflies){
      for (let i = 0; i < this.butterflies.length; i++) {
        // Check if bee touch butterflie
        if (this.bee.model.position.x > (Math.round(this.butterflies[i].mesh.position.x * 10) / 10) - this.butterflies[i].mesh.scale.x/2
        && this.bee.model.position.x < (Math.round(this.butterflies[i].mesh.position.x * 10) / 10) + this.butterflies[i].mesh.scale.x/2
        && this.bee.model.position.z > (Math.round(this.butterflies[i].mesh.position.z * 10) / 10) - this.butterflies[i].mesh.scale.y/2
        && this.bee.model.position.z < (Math.round(this.butterflies[i].mesh.position.z * 10) / 10) + this.butterflies[i].mesh.scale.y/2) {
          if (this.gameProperty.lastIntersectBB != this.butterflies[i].mesh.name) {
            this.loseForaged(i)
          }
        }

        this.butterflies[i].update()
      }
    }

    if(this.grass){
      this.grass.update()
    }

    if (this.gameProperty) {
      // Hide Pollen for daisy foraged
      this.gameProperty.currentLoadPollen.forEach((currentLoadPollen, index) => {
        if(currentLoadPollen === 58){
          this.daisys[index].children.forEach(children => {
            if (children.name === 'Pollen' && children.material.opacity != 0) {
              gsap.to(children.material, {
                opacity: 0,
                duration: 0.5,
              })
            }
          })
        }
      })
      
    }
  }

  // Start Cinematique
  initAnim(){
    const cinematiqueTime = 15

    // Init Sounds
    setTimeout(() => {
      this.backgroundMusic.sound.fade(0, store.state.isSongOn ? this.backgroundMusic.volume : 0, .3)
      this.backgroundMusic.sound.play()
    }, 50)
    setTimeout(()=>{
      this.voiceIntro.sound.fade(0, store.state.isSongOn ? this.voiceIntro.volume : 0, .3)
      this.voiceIntro.sound.play()
      this.subtitles.init()
    }, 1000)


    // Set Camera position
    this.camera.position.set(-9, 2, 0)
    this.webGl.controls.target.set(15, 0, 0 )

    gsap.to(this.camera.position, {
      x: 0,
      y: 10,
      z: 10,
      duration: cinematiqueTime,
      delay: 0.7,
      ease: 'none'
    })

    gsap.to(this.webGl.controls.target, {
      x: 0,
      y: 0,
      z: 0,
      duration: cinematiqueTime,
      delay: 0.7,
      ease: 'none'
    }).then(()=>{
      this.startPopUp.classList.remove('u-hidden')
    })
  }

  playGame(){
    this.backgroundMusic.sound.fade(store.state.isSongOn ? this.backgroundMusic.volume : 0, 0, .3)
    this.backgroundMusic.sound.stop()
    this.musicInGame.sound.fade(0, store.state.isSongOn ? this.backgroundMusic.volume : 0, .3)
    this.musicInGame.sound.play()

    // move cursor above the timeline
    gsap.to(this.activeItem, {
      duration: 70,
      y: 70,
      ease: "none",
    })

    // Listener
    this.listener = new Listener()
    this.listener.on('mouseMove', ()=>{
      if (this.gameProperty.beeCanMouve) {
        this.cursor.x = this.listener.property.cursor.x
        this.cursor.y = this.listener.property.cursor.y

        this.beeTarget.x = this.cursor.x * 6 + this.camera.position.x
        this.beeTarget.z = this.gameProperty.cursorIsInvert ? this.cursor.y * 4 : - this.cursor.y * 4
        this.beeTarget.y = 1
      }
    })

    document.addEventListener('keydown', (e) => {
      if (e.code === 'Space') {
        this.gameProperty.spaceIsPress = true
      }
    }, false)
    document.addEventListener('keyup', (e) => {
      if (e.code === 'Space') {
        this.gameProperty.spaceIsPress = false
        this.gameProperty.beeCanMouve = true

        this.loaderPollen.div.classList.add('u-hidden')
      }
    }, false)

    this.gamePlayed = true

    // Move Camera
    gsap.to(this.camera.position, {
      duration: this.gameProperty.durationGame, 
      x: this.gameProperty.camTarget.x, 
      ease: "power1.in", 
    })
    gsap.to(this.webGl.controls.target, {
      duration: this.gameProperty.durationGame, 
      x: this.gameProperty.controlsTarget.x, 
      ease: "power1.in", 
    }).then(()=>{
      this.endOfTheGame()
    })

    // Start chrono
    this.startChrono()
  }

  setChrono(i, endNbr) {
    if (i >= endNbr) {
      const min = '0' + Math.floor(i/60)
      const sec = i%60 < 10 ? '0'+ i%60 : i%60
      this.chrono.label.innerHTML = min + ' : ' + sec
      setTimeout(() => {
        this.setChrono(i - 1, endNbr)
      }, 1000)
    }
  }

  startChrono() {
    this.chrono.div.classList.remove('u-hidden')
    this.domCount.div.classList.remove('u-hidden')

    this.setChrono(this.gameProperty.durationGame, 0)
  }

  // handle hit on buterflies
  loseForaged(i) {

    // Init Sounds
    this.impact.sound.fade(0, store.state.isSongOn ? this.impact.volume : 0, .3)
    this.impact.sound.play()

    // if you have foraged remove one daisy
    if (this.gameProperty.foraged.length && !this.gameProperty.isFinish) {
      this.lottieLose.classList.remove('u-hidden')
      this.gameProperty.foraged.shift()
    }

    // stunning bee for 3s
    this.gameProperty.cursorIsInvert = !this.gameProperty.cursorIsInvert
    setTimeout(()=>{
      this.gameProperty.cursorIsInvert = !this.gameProperty.cursorIsInvert
    }, 3000)
    
    // red vignette
    gsap.to(this.PostPros.vignettePass.uniforms.uIntensity, {
      value: 0.6,
      duration: 2.5,
      ease: customEase
    })

    this.gameProperty.lastIntersectBB = this.butterflies[i].mesh.name
    setTimeout( ()=>{
      this.lottieLose.classList.add('u-hidden')
      this.gameProperty.lastIntersectBB = ''
      this.PostPros.vignettePass.uniforms.uIntensity.value = 0
    }, 2500) 
  }

  addPollenOnDaisy(daisy){
    const nbPollen = 3

    for (let i = 0; i <= nbPollen; i++) {
      const geometry = new SphereGeometry( 0.3, 7, 6 )
      const material = new MeshBasicMaterial( {color: 0xD6CFFF, transparent: true} )
      const pollenMesh = new Mesh( geometry, material )
      pollenMesh.name = 'Pollen'

      const rendomSize = randomIntFromInterval(0.1, 0.2, 0.005)
      
      pollenMesh.scale.set(rendomSize, rendomSize, rendomSize)
      pollenMesh.position.y = 1.3
      pollenMesh.position.z = randomIntFromInterval(-0.3, 0.3, 0.002)
      pollenMesh.position.x = randomIntFromInterval(-0.3, 0.3, 0.002)

      const duration = randomIntFromInterval(0.8, 3.2, 0.001)

      gsap.to(pollenMesh.position, {
        y: randomIntFromInterval(1.3, 2.2, 0.005),
        duration: duration,
        stagger: {
          each: 0,
          repeat: -1
        }
      })

      gsap.to(pollenMesh.material, {
        opacity: 0,
        duration: duration,
        stagger: {
          each: 0,
          repeat: -1
        }
      })

      daisy.add(pollenMesh)
    }
  }

  reStart(){
    // init game values
    document.getElementsByClassName('score')[0].classList.add('u-hidden')
    this.chrono.div.classList.remove('u-hidden')

    this.endPopUp.classList.add('u-hidden')
    this.gameProperty.beeCanMouve = false
    this.camera.position.set(0, 10, 10)
    this.webGl.controls.target.set(0, 0, 0 )
    this.gameProperty.foraged = []
    this.gameProperty.durationGame = 70
    this.gameProperty.currentLoadPollen = []
    this.bee.model.position.set(-4, 1, 0.5)
    this.bee.model.lookAt(1, 0, 1)

    setTimeout(()=>{
      this.gameProperty.beeCanMouve = true
      this.gameProperty.isFinish = false

      // Move Camera
      gsap.to(this.camera.position, {
        duration: this.gameProperty.durationGame, 
        x: this.gameProperty.camTarget.x, 
        ease: "power1.in", 
      })
      gsap.to(this.webGl.controls.target, {
        duration: this.gameProperty.durationGame, 
        x: this.gameProperty.controlsTarget.x, 
        ease: "power1.in", 
      }).then(()=>{
        this.endOfTheGame()
      })

      // Start chrono
      this.startChrono()
    }, 3500)
  }

  endOfTheGame(){
    this.leaderBord.getData()
    this.leaderBord.on(`dataLeaderBordReady`, () => {
      this.leaderBord.addClassement()
    })
    this.gameProperty.isFinish = true
    this.endPopUp.querySelector('p').innerHTML = this.gameProperty.foraged.length + ' fleurs viennent d?????tre pollinis??es'
    this.pollenUI.classList.remove('u-cursor-hidden')
    this.endPopUp.classList.remove('u-hidden')
  }

  delete() {

  }
}