import { Group } from 'three'
import WebGl from '../webglManager'
import Bee from '../entities/Bee'
import gsap, { Power1 } from 'gsap/all'

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
      'bee': {
        'placingHeight': 1.5,
        'limitRightLeft': 3.5,
      }
      
    }

    // Wait for resources
    this.resources.on(`sourcesReadyraceGame`, () =>
    {
      this.setup()
    })
  }

  setup(){
    // Add Bee
    this.bee = new Bee()
    this.add(this.bee.model)

    // Set Camera position
    this.webGl.camera.position.set(0, 2.62, -10)

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
    }

    // Lisener 
    document.addEventListener('mousemove', (e)=>{ this.handleMoveCursor(e) })

    // Add Water
    
  }

  update(){
    if(this.bee){
      // Update annim bee
      this.bee.update()
      // Update hauteur bee
      this.bee.scene.position.y = (Math.sin(this.time.elapsed / 700) / 5) - this.property.bee.placingHeight
    }
  }

  handleMoveCursor(e){
    const windowWidth = window.innerWidth
    
      const positionCursorH = e.screenX - (windowWidth / 2) 
    
      if(this.bee){
        const convertX = - (positionCursorH * this.property.bee.limitRightLeft) / (windowWidth/2);
    
        let posX
        posX = Math.min(this.property.bee.limitRightLeft, convertX)
        posX = Math.max(-this.property.bee.limitRightLeft, posX)
    
        gsap.to(this.bee.scene.position, {
          x: posX,
          duration: 1.3,
          ease: Power1.easeOut()
        })
        
      }
  }
}