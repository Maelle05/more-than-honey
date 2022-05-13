import { MathUtils } from 'three'
import { Group, Vector2, Raycaster } from 'three'
import BlueBee from '../entities/BlueBee'
import DaisyGame from '../entities/DaisyGame'
import Listener from '../utils/Listener'
import WebGl from '../webglManager'
import {randomIntFromInterval} from '@/webgl/utils/RandowBetweenTwo'
import gsap from 'gsap'
import { MeshBasicMaterial, Mesh, BoxGeometry, Vector3 } from 'three'
import Bloom from '../shaders/bloom'
import { CustomEase } from 'gsap/all'
import Grass from '../shaders/grass/PollenGameGrass'

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

    this.nbDaisys = 70
    this.positionDaisys = [
      {
        x: -3.5,
        y: 0,
        z: 0.7,
      }
    ]
    this.cursor = new Vector2()

    // UI
    this.chrono
    this.loaderPollen

    // Wait for resources
    this.resources.on(`sourcesReadypollenGame`, () => {
      this.setup()
    })
  }

  setDOM(dom){
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
      label: dom.querySelector('.loaderPollen p')
    }

    this.startPopUp = dom.getElementsByClassName('popUpIntro')[0]

    this.lottieLose = dom.getElementsByClassName('lottieLoseForaged')[0]
  }

  setup() {
    // Add daisy to scene
    this.daisy = new DaisyGame()

    // Random dasy set
    for (let i = 0; i < this.nbDaisys; i++) {
      this.positionDaisys.push({
        // x: randomIntFromInterval(-2, 30, 0.5),
        x: this.positionDaisys[i].x + randomIntFromInterval(0.4, 1.6, 0.04),
        y: 0,
        z: randomIntFromInterval(-3.5, 3.5, 0.04)
      })
    }

    // Add dasy
    for (let i = 0; i < this.positionDaisys.length; i++) {
      const thisDaisy = this.daisy.model.clone()
      thisDaisy.position.set(this.positionDaisys[i].x, this.positionDaisys[i].y, this.positionDaisys[i].z)
      this.add(thisDaisy)
    }

    // Add bee
    this.bee = new BlueBee()

    // Add Grass
    this.grass = new Grass(this.nbDaisys + 20, 60, 200000)

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
    // Remove fog
    this.scene.fog.density = 0

    // Set bee position
    this.bee.model.position.set(-4, 1, 0.5)
    this.bee.model.scale.set(0.02, 0.02, 0.02)
    this.beeTarget = {
      x: -3.99,
      y: 1,
      z: 0.5,
    }
    this.add(this.bee.model)

    // Add grass
    this.grass.position.set(this.nbDaisys / 2, 0, 0)
    this.add(this.grass)

    // Add butterflies BOT
    const nbBot = 10
    this.butterflies = []
    for (let i = 0; i < nbBot; i++) {
      this.butterflies.push(new Butterflie(this, this.positionDaisys, i))
    }

    // Game property
    this.gameProperty = {
      foraged: [],
      camTarget: new Vector3(this.positionDaisys[this.positionDaisys.length-1].x, 10, 5),
      controlsTarget: new Vector3(this.positionDaisys[this.positionDaisys.length-1].x, 0, 0),
      beeCanMouve: true,
      spaceIsPress: false,
      durationGame: 130,
      currentLoadPollen: new Array(this.nbDaisys + 1),
      lastIntersectBB: ''
    }

    this.gamePlayed = false


    // End Loader
    setTimeout(()=>{
      this.loader.classList.add('loaded')
    }, 500)

    this.initAnim()
  }

  update() {
    if (this.bee && this.gamePlayed) {
      // Mouve Bee
      this.bee.update()
      this.bee.model.position.z = MathUtils.damp(this.bee.model.position.z, this.beeTarget.z, 0.07, .8)
      this.bee.model.position.x = MathUtils.damp(this.bee.model.position.x, this.beeTarget.x, 0.07, .8)
      this.bee.model.lookAt(this.beeTarget.x, this.beeTarget.y, this.beeTarget.z )

      for (let i = 0; i < this.positionDaisys.length; i++) {
        if (
        this.bee.model.position.x > (Math.round(this.positionDaisys[i].x * 10) / 10) - 0.2
        && this.bee.model.position.x < (Math.round(this.positionDaisys[i].x * 10) / 10) + 0.2
        && this.bee.model.position.z > (Math.round(this.positionDaisys[i].z * 10) / 10) - 0
        && this.bee.model.position.z < (Math.round(this.positionDaisys[i].z * 10) / 10) + 0.4
        && this.gameProperty.spaceIsPress
        ) {
          this.gameProperty.beeCanMouve = false
          this.loaderPollen.div.classList.remove('hidden')
          this.loaderPollen.div.style.left = this.listener.property.cursorOnWind.x + 'px'
          this.loaderPollen.div.style.top = this.listener.property.cursorOnWind.y + 'px'

          if (this.gameProperty.currentLoadPollen[i]) {
            if (this.gameProperty.currentLoadPollen[i] === 150 ) {
              if (this.gameProperty.foraged.includes(i)) {
                this.loaderPollen.label.innerHTML = 'Pollenisé !'
              } else {
                this.gameProperty.foraged.push(i)
              }
            } else {
              this.gameProperty.currentLoadPollen[i]++
            }
            
          } else {
            this.gameProperty.currentLoadPollen[i] = 1
          }

          !this.gameProperty.foraged.includes(i) ? this.loaderPollen.label.innerHTML = this.gameProperty.currentLoadPollen[i] : ''
        }
      }

      this.domCount.label.innerHTML = this.gameProperty.foraged.length + ' fleurs pollinisées'

    }

    if (this.bee && !this.gamePlayed){
      this.bee.update()
      this.bee.model.lookAt(this.beeTarget.x, this.beeTarget.y, this.beeTarget.z )
    }

    if(this.butterflies){
      for (let i = 0; i < this.butterflies.length; i++) {
        if (this.bee.model.position.x > (Math.round(this.butterflies[i].mesh.position.x * 10) / 10) - this.butterflies[i].mesh.scale.x
        && this.bee.model.position.x < (Math.round(this.butterflies[i].mesh.position.x * 10) / 10) + this.butterflies[i].mesh.scale.x
        && this.bee.model.position.z > (Math.round(this.butterflies[i].mesh.position.z * 10) / 10) - 0
        && this.bee.model.position.z < (Math.round(this.butterflies[i].mesh.position.z * 10) / 10) + this.butterflies[i].mesh.scale.x) {
          if (this.gameProperty.lastIntersectBB != this.butterflies[i].mesh.name) {
            this.loseForaged(i)
          }
        }
      }
    }

    if(this.grass){
      this.grass.update()
    }
  }

  initAnim(){
    const cinematiqueTime = 5


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
      this.startPopUp.classList.remove('hidden')
    })
  }

  playGame(){

    // Listener
    this.listener = new Listener()
    this.listener.on('mouseMove', ()=>{
      if (this.gameProperty.beeCanMouve) {
        this.cursor.x = this.listener.property.cursor.x
        this.cursor.y = this.listener.property.cursor.y

        this.beeTarget.x = this.cursor.x * 4 + this.camera.position.x
        this.beeTarget.z = - this.cursor.y * 3
        this.beeTarget.y = 1
      }
    })

    document.addEventListener('keydown', (event) => {
      if (event.code === 'Space') {
        this.gameProperty.spaceIsPress = true
      }
    }, false)
    document.addEventListener('keyup', (event) => {
      if (event.code === 'Space') {
        this.gameProperty.spaceIsPress = false
        this.gameProperty.beeCanMouve = true

        this.loaderPollen.div.classList.add('hidden')
      }
    }, false)

    this.gamePlayed = true

    // Mouve Camera
    gsap.to(this.camera.position, {
      duration: this.gameProperty.durationGame, 
      x: this.gameProperty.camTarget.x, 
      ease: "power1.in", 
    })
    gsap.to(this.webGl.controls.target, {
      duration: this.gameProperty.durationGame, 
      x: this.gameProperty.controlsTarget.x, 
      ease: "power1.in", 
    })

    // Start chrono
    this.setChrono(this.gameProperty.durationGame, 0)
  }

  setChrono(i, endNbr) {
    if (i >= endNbr) {
      this.chrono.label.innerHTML = i
      setTimeout(() => {
        this.setChrono(i - 1, endNbr)
      }, 1000)
    }
  }

  loseForaged(i) {
    if (this.gameProperty.foraged.length) {
      this.lottieLose.classList.remove('hidden')
      this.gameProperty.foraged.shift()
    }
    
    this.gameProperty.lastIntersectBB = this.butterflies[i].mesh.name
    gsap.registerPlugin(CustomEase)
    gsap.to(this.PostPros.vignettePass.uniforms.uIntensity, {
      value: 0.6,
      duration: 2.5,
      ease: CustomEase.create("custom", "M0,0,C0,0,0.01,0.133,0.032,0.236,0.037,0.261,0.058,0.319,0.07,0.34,0.077,0.355,0.167,0.538,0.246,0.32,0.272,0.248,0.282,0.16,0.362,0.122,0.448,0.08,0.446,0.228,0.528,0.224,0.692,0.214,1,0,1,0")
    })
    setTimeout( ()=>{
      this.lottieLose.classList.add('hidden')
      this.gameProperty.lastIntersectBB = ''
      this.PostPros.vignettePass.uniforms.uIntensity.value = 0
    }, 2500) 
  }

  delete() {

  }
}


class Butterflie {
  constructor(group, posDaisy, id){
    // console.log('Butterflie')
    this.scene = group
    this.posDaisy = posDaisy

    // Model
    this.geometry = new BoxGeometry( 1, 1, 1 )
    this.material = new MeshBasicMaterial( {color: 0x00ff00} )
    this.mesh = new Mesh( this.geometry, this.material )
    const size = randomIntFromInterval(0.2, 0.4, 0.05)
    this.mesh.scale.set(size, size, size)
    this.mesh.name = 'BOT' + id

    // GET is Target points
    this.targetStep = 0
    this.targetPoints = []
    for (let i = 0; i < 4; i++) {
      if(!this.targetPoints.length){
        this.targetPoints.push(randomIntFromInterval(6, this.posDaisy.length - 8, 1))
      } else {
        this.targetPoints.push(randomIntFromInterval(this.targetPoints[0] - 6 , this.targetPoints[0] + 8 , 1))
      }
    }

    // Init pos
    this.mesh.position.set(this.posDaisy[this.targetPoints[this.targetPoints.length-1]].x, this.posDaisy[this.targetPoints[this.targetPoints.length-1]].y + 1, this.posDaisy[this.targetPoints[this.targetPoints.length-1]].z)
    this.scene.add( this.mesh )
    
    setTimeout(()=>{
      this.goToTarget()
    }, randomIntFromInterval(0, 2000, 1) )
    
  }

  goToTarget(){
    gsap.to(this.mesh.position, {
      duration: 10, 
      x: this.posDaisy[this.targetPoints[this.targetStep]].x, 
      z: this.posDaisy[this.targetPoints[this.targetStep]].z,
      ease: "none", 
    }).then(()=> {
      this.targetStep < this.targetPoints.length - 1 ? this.targetStep++ : this.targetStep = 0
      setTimeout(()=>{
        this.goToTarget()
      }, 2000)
      
    })
  }
}