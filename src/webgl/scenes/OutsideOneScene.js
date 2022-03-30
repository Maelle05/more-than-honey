import WebGl from '../webglManager';

import { Group } from 'three';
import Particules from '../shaders/particulesTest';
import Tree from '../entities/Tree';

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
    this.tree = new Tree()
    this.particles = new Particules()


    this.init()
  }

  init(){
    // Add lys
    this.lys.position.y = - 0.15
    // this.add(this.lys)

    // Add trees
    this.add(this.tree.model)
    console.log(this.tree);

    // Add particles
    this.add(this.particles)

    // Set Camera property
    this.webGl.camera.position.set(0, 1, 1)
    this.webGl.controls.enabled = true

    // Lisener 
  }

  update(){
    
  }

  delete(){
    
  }
}