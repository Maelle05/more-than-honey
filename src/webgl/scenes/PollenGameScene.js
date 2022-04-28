import { MathUtils } from 'three'
import { Group, Vector2, Raycaster } from 'three'
import BlueBee from '../entities/BlueBee'
import DaisyGame from '../entities/DaisyGame'
import Grass from '../shaders/grassPollenGame'
import Listener from '../utils/Listener'
import WebGl from '../webglManager'

export default class PollenGameScene extends Group {
  constructor() {
    super()
    this.webGl = new WebGl()
    this.scene = this.webGl.scene
    this.resources = this.webGl.resources
    this.camera = this.webGl.camera
    this.loader = this.webGl.loader


    this.positionDaisys = [
      {
        x: -1,
        y: 0,
        z: 0
      },
      {
        x: 1,
        y: 0,
        z: 0
      },
      {
        x: 0,
        y: 0,
        z: 1
      },
      {
        x: 0,
        y: 0,
        z: -1
      },
      {
        x: -1.5,
        y: 0,
        z: -1.5
      },
      {
        x: -1.5,
        y: 0,
        z: 1.5
      },
      {
        x: -1,
        y: 0,
        z: 2.5
      }
    ]

    // Wait for resources
    this.resources.on(`sourcesReadypollenGame`, () => {
      this.setup()
    })
  }

  setup() {

    // Add daisy to scene
    this.daisy = new DaisyGame()
    this.daisyToRecaster = []

    for (let i = 0; i < this.positionDaisys.length; i++) {
      const thisDaisy = this.daisy.model.clone()
      thisDaisy.position.set(this.positionDaisys[i].x, this.positionDaisys[i].y, this.positionDaisys[i].z)
      this.daisyToRecaster.push(thisDaisy.children[1])
      this.add(thisDaisy)
    }

    // Add bee
    this.bee = new BlueBee()

    // Add grass
    this.grass = new Grass()

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
      camGUI.add(this.camera.position, 'x', -10, 10).setValue(-4.14)
      camGUI.add(this.camera.position, 'y', 0, 50).setValue(6.8)
      camGUI.add(this.camera.position, 'z', -30, 10).setValue(0.56)
    }

    this.init()
  }

  init() {
    // Remove fog
    this.scene.fog.density = 0
    
    // Set Camera position
    this.camera.position.set(-4.14, 6.8, 0.56)
    this.webGl.controls.target.set(0, 0, 0 )

    // Set bee position
    this.bee.model.position.set(0, 1, -3)
    this.bee.model.scale.set(0.02, 0.02, 0.02)
    this.beeTarget = {
      x: 0,
      y: 1,
      z: -3,
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
      foraged: []
    }

    // Add grass
    this.grass.position.set(0.4,-0.2,4)
    this.add(this.grass)



    // End Loader
    setTimeout(()=>{
      this.loader.classList.add('loaded')
    }, 500)
    
  }

  update() {
    if (this.bee) {
      this.bee.update()
      this.bee.model.position.z = MathUtils.damp(this.bee.model.position.z, this.beeTarget.z, 0.07, .3)
      this.bee.model.position.x = MathUtils.damp(this.bee.model.position.x, this.beeTarget.x, 0.07, .3)
      this.bee.model.position.y = MathUtils.damp(this.bee.model.position.y, this.beeTarget.y, 0.07, .3)
      this.bee.model.lookAt(this.beeTarget.x, this.beeTarget.y, this.beeTarget.z )
      for (let i = 0; i < this.positionDaisys.length; i++) {
        if (
        Math.round(this.bee.model.position.x * 10) / 10 === this.positionDaisys[i].x 
        && Math.round(this.bee.model.position.z * 10) / 10 === this.positionDaisys[i].z
        && !this.gameProperty.foraged.includes(i)
        ) {
          this.gameProperty.foraged.push(i)
          console.log('flower ' + i )
        }
      }
      
    }

    if(this.grass) {
      this.grass.update()
    }

  }

  delete() {

  }
}