import { Group, MathUtils } from 'three'
import WebGl from '../webglManager'
import Bee from '../entities/BlueBee'

export default class RaceGameScene extends Group
{
  constructor(){
    super()
    this.webGl = new WebGl()
    this.scene = this.webGl.scene
    this.resources = this.webGl.resources
    this.time = this.webGl.time

    // Property Game
    this.property = {
      bee: {
        placingHeight: 1.5,
        limitRightLeft: 3.5,
      },
      cursor: {
        current: 0,
        target: 0,
      },
      game: {
        bee: {
          speed: 0.001
        }
      }
    }

    this.mouseMovehandle = this.handleMoveCursor.bind(this)

    // Wait for resources
    this.resources.on(`sourcesReadyraceGame`, () =>
    {
      this.setup()
    })
  }

  setup(){
    // Add Bee
    this.bee = new Bee()

    // Debug
    this.debug = this.webGl.debug
    if(this.debug.active)
    {
      const viewGUI = this.debug.ui.addFolder('Vision')

      const camGUI = viewGUI.addFolder('Position Camera')
      camGUI.add(this.webGl.camera.position, 'x', -10, 10)
      camGUI.add(this.webGl.camera.position, 'y', -10, 10)
      camGUI.add(this.webGl.camera.position, 'z', -30, 10)

      const beePlacingGUI = viewGUI.addFolder('Bee Placing')
      beePlacingGUI.add(this.property.bee, 'placingHeight', -2, 3, 0.01).name( 'Height' )
      beePlacingGUI.add(this.property.bee, 'limitRightLeft', -2, 3, 0.01).name( 'Limits Left Right' )

      const gameGUI = this.debug.ui.addFolder('Game')
      gameGUI.add(this.property.game.bee, 'speed', 0, 0.003, 0.0001).name( 'Bee speed' )


    }

    // Add Sky

    this.init()
  }

  init(){
    // Set parameters of the scene at init
    this.webGl.camera.position.set(0, 2.62, -10)
    this.bee.model.position.set(0, 0, 0)
    this.webGl.controls.enabled = false

    // Listener
    document.addEventListener('mousemove', this.mouseMovehandle)

    // Add models 
    this.add(this.bee.model)

  }

  update(){
    if(this.bee){
      // Update annim bee
      this.bee.update()
      // Update hauteur bee
      this.bee.model.position.y = (Math.sin(this.time.elapsed / 700) / 5) - this.property.bee.placingHeight
      
      this.property.cursor.current = MathUtils.damp(this.property.cursor.current, this.property.cursor.target, this.property.game.bee.speed, this.time.delta);
      this.bee.model.position.x = this.property.cursor.current
    }
  }

  delete(){
    document.removeEventListener('mousemove', this.mouseMovehandle )
  }

  handleMoveCursor(e){
    const windowWidth = window.innerWidth
    const positionCursorH = e.clientX - (windowWidth / 2) 
  
    if(this.bee){
      const convertX = - (positionCursorH * this.property.bee.limitRightLeft) / (windowWidth/2);

      let posX
      posX = Math.min(this.property.bee.limitRightLeft, convertX)
      posX = Math.max(-this.property.bee.limitRightLeft, posX)

      this.property.cursor.target = posX

    }
  }
}