import { MathUtils } from 'three'
import { Group, Vector2, Raycaster } from 'three'
import BlueBee from '../entities/BlueBee'
import DaisyGame from '../entities/DaisyGame'
import Listener from '../utils/Listener'
import WebGl from '../webglManager'
import {randomIntFromInterval} from '@/webgl/utils/RandowBetweenTwo'

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

    this.nbDaisys = 20
    this.positionDaisys = [
      {
        x: -2.5,
        y: 0,
        z: 0.7,
      }
    ]

    this.jaugeBar

    // Wait for resources
    this.resources.on(`sourcesReadypollenGame`, () => {
      this.setup()
    })
  }

  setDOM(dom){
    this.jaugeBar = {
      init: dom,
      label: dom.getElementsByClassName('label')[0],
      bar: dom.getElementsByClassName('jauge')[0],
    }

  }

  setup() {

    // Add daisy to scene
    this.daisy = new DaisyGame()
    this.daisyToRecaster = []

    // Random dasy set
    for (let i = 0; i < this.nbDaisys; i++) {
      this.positionDaisys.push({
        x: this.positionDaisys[i].x + randomIntFromInterval(0.6, 2, 0.04),
        y: 0,
        z: randomIntFromInterval(-2, 2, 0.04)
      })
    }

    // Add dasy
    for (let i = 0; i < this.positionDaisys.length; i++) {
      const thisDaisy = this.daisy.model.clone()
      thisDaisy.position.set(this.positionDaisys[i].x, this.positionDaisys[i].y, this.positionDaisys[i].z)
      this.daisyToRecaster.push(thisDaisy.children[1])
      this.add(thisDaisy)
    }

    // Add bee
    this.bee = new BlueBee()

    // Raycaster
    this.raycaster = new Raycaster()
    this.pointer = new Vector2()
    this.pointer.set(-1,-1)


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
    this.listener.on('mouseClick', ()=>{
      this.pointer.x = this.listener.property.cursor.x
      this.pointer.y = this.listener.property.cursor.y
      this.raycaster.setFromCamera( this.pointer, this.camera )
      const intersects = this.raycaster.intersectObjects( this.daisyToRecaster )
      if (intersects.length) {
        this.beeTarget.z = intersects[0].object.parent.position.z
        this.beeTarget.x = intersects[0].object.parent.position.x
        this.beeTarget.y = intersects[0].object.parent.position.y + 0.9
      }
    })

    // Game property
    this.gameProperty = {
      foraged: [],
      camTarget: {
        x: 0,
        y: 10,
        z: 5
      },
      controlsTarget: {
        x: 0,
        y: 0,
        z: 0
      }
    }


    // End Loader
    setTimeout(()=>{
      this.loader.classList.add('loaded')
    }, 500)
    
  }

  update() {
    if (this.bee) {
      this.bee.update()
      this.bee.model.position.z = MathUtils.damp(this.bee.model.position.z, this.beeTarget.z, 0.07, .8)
      this.bee.model.position.x = MathUtils.damp(this.bee.model.position.x, this.beeTarget.x, 0.07, .8)
      this.bee.model.position.y = MathUtils.damp(this.bee.model.position.y, this.beeTarget.y, 0.07, .8)
      this.bee.model.lookAt(this.beeTarget.x, this.beeTarget.y, this.beeTarget.z )

      this.camera.position.x = MathUtils.damp(this.camera.position.x, this.gameProperty.camTarget.x, 0.07, .3)
      this.webGl.controls.target.x = MathUtils.damp(this.webGl.controls.target.x, this.gameProperty.controlsTarget.x, 0.07, .3)

      for (let i = 0; i < this.positionDaisys.length; i++) {
        if (
        Math.round(this.bee.model.position.x * 10) / 10 === Math.round(this.positionDaisys[i].x * 10) / 10
        && Math.round(this.bee.model.position.z * 10) / 10 === Math.round(this.positionDaisys[i].z * 10) / 10
        && !this.gameProperty.foraged.includes(i)
        ) {
          this.gameProperty.foraged.push(i)
          
          if (this.gameProperty.foraged.length/this.positionDaisys.length === 1) {
            this.jaugeBar.bar.style.height = (this.gameProperty.foraged.length/this.positionDaisys.length) * 100 + '%'
            this.jaugeBar.bar.style.borderRadius = '10px'
            this.incNbrRec(parseInt(this.jaugeBar.label.innerHTML, 10), Math.round((this.gameProperty.foraged.length/this.positionDaisys.length) * 100))
            this.jaugeBar.label.style.color = 'white'
          }else{
            const result = (this.gameProperty.foraged.length/this.positionDaisys.length) * 100
            this.jaugeBar.bar.style.height = result + '%'
            this.jaugeBar.label.style.bottom = (result + 2) + '%'
            this.incNbrRec(parseInt(this.jaugeBar.label.innerHTML, 10), Math.round(result))
          }

          this.gameProperty.camTarget.x += 1.2
          this.gameProperty.controlsTarget.x += 1.2
          
        }
      }
      
    }

  }

  incNbrRec(i, endNbr) {
    if (i <= endNbr) {
      this.jaugeBar.label.innerHTML = i
      setTimeout(() => {
        this.incNbrRec(i + 1, endNbr)
      }, 100)
    }
  }

  delete() {

  }
}