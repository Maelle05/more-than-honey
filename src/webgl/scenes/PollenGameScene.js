import { MathUtils } from 'three'
import { Group, Vector2, Raycaster } from 'three'
import BlueBee from '../entities/BlueBee'
import DaisyGame from '../entities/DaisyGame'
import Listener from '../utils/Listener'
import WebGl from '../webglManager'
import {randomIntFromInterval} from '@/webgl/utils/RandowBetweenTwo'
import { Vector3 } from 'three'
import gsap from 'gsap'

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

    this.nbDaisys = 50
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

    this.loaderPollen = {
      div: dom.getElementsByClassName('loaderPollen')[0],
      label: dom.querySelector('.loaderPollen p')
    }
  }

  setup() {

    // Add daisy to scene
    this.daisy = new DaisyGame()

    // Random dasy set
    for (let i = 0; i < this.nbDaisys; i++) {
      this.positionDaisys.push({
        // x: randomIntFromInterval(-2, 30, 0.5),
        x: this.positionDaisys[i].x + randomIntFromInterval(0.2, 1.6, 0.04),
        y: 0,
        z: randomIntFromInterval(-2.5, 2.5, 0.04)
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
    
    // Set Camera position
    this.camera.position.set(0, 10, 5)
    this.webGl.controls.target.set(0, 0, 0 )

    // Set bee position
    this.bee.model.position.set(-4, 1, 0.5)
    this.bee.model.scale.set(0.02, 0.02, 0.02)
    this.beeTarget = {
      x: -3.99,
      y: 1,
      z: 0.5,
    }
    this.add(this.bee.model)

    // Listener
    this.listener = new Listener()
    this.listener.on('mouseMove', ()=>{
      if (this.gameProperty.beeCanMouve) {
        this.cursor.x = this.listener.property.cursor.x
        this.cursor.y = this.listener.property.cursor.y

        this.beeTarget.x = this.cursor.x * 3 + this.camera.position.x
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
      }
    }, false)

    // Game property
    this.gameProperty = {
      foraged: [],
      camTarget: new Vector3(this.positionDaisys[this.positionDaisys.length-1].x, 10, 5),
      controlsTarget: new Vector3(this.positionDaisys[this.positionDaisys.length-1].x, 0, 0),
      beeCanMouve: true,
      spaceIsPress: false,
      durationGame: 130,
    }


    // End Loader
    setTimeout(()=>{
      this.loader.classList.add('loaded')
    }, 500)

    
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

  update() {
    if (this.bee) {

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
        ) {
          this.loaderPollen.div.style.left = this.listener.property.cursorOnWind.x + 'px'
          this.loaderPollen.div.style.top = this.listener.property.cursorOnWind.y + 'px'
          
          if (!this.gameProperty.foraged.includes(i) && this.gameProperty.spaceIsPress) {
            this.gameProperty.beeCanMouve = false
            console.log(i)
          }
        }
      }
    }
  }

  setChrono(i, endNbr) {
    if (i >= endNbr) {
      this.chrono.label.innerHTML = i
      setTimeout(() => {
        this.setChrono(i - 1, endNbr)
      }, 1000)
    }
  }

  delete() {

  }
}