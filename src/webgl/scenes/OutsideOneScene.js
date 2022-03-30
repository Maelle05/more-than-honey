import WebGl from '../webglManager';

import { Group } from 'three';
import Particules from '../shaders/particulesTest';
import Tree from '../entities/Tree';
import Stone from '../entities/Stone';
import stoneLocation from '../elementsLocations/outsideOne/stone.json'

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
    this.stone = new Stone()
    this.particles = new Particules()


    this.init()
  }

  init(){

    console.log(stoneLocation);

    // Add lys
    this.lys.position.y = - 0.15
    this.add(this.lys)

    // Add trees
    // this.add(this.tree.model)

    // Add stones
    this.stone.model.position.z = stoneLocation[0].centerY / 100
    this.stone.model.position.x = stoneLocation[0].centerX / 100
    this.add(this.stone.model)

    // Add particles
    // this.add(this.particles)

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