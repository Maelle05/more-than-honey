import WebGl from '../webglManager';

import { Group } from 'three';
import Particules from '../shaders/particulesTest';

export default class OutsideOneScene extends Group
{
  constructor(){
    super()
    this.webGl = new WebGl()
    this.scene = this.webGl.scene
    this.renderer = this.webGl.renderer
    this.camera = this.webGl.camera
    this.resources = this.webGl.resources

    // Wait for resources
    this.resources.on(`sourcesReadyoutsideOne`, () =>
    {
      this.setup()
    })
  }

  setup(){
    this.lys = this.resources.items.lysModel.scene
    this.particles = new Particules()



    this.init()
  }

  init(){
    // Add lys
    this.lys.position.y = - 0.15
    this.add(this.lys)

    // Add particles
    this.add(this.particles)

    // Set Camera position
    this.webGl.camera.position.set(0, 1, 1)

    // Lisener 
  }

  update(){
    
  }

  delete(){
    
  }
}