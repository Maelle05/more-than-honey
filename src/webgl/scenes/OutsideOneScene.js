import WebGl from '../webglManager';

import { Group, Vector3 } from 'three';
import Particules from '../shaders/particulesTest';
import Tree from '../entities/Tree';
import Stone from '../entities/Stone';
import stoneLocation from '../elementsLocations/outsideOne/stone.json'
import lysLocation from '../elementsLocations/outsideOne/lys.json'

export default class OutsideOneScene extends Group
{
  constructor(){
    super()
    this.webGl = new WebGl()
    this.scene = this.webGl.scene
    this.renderer = this.webGl.renderer
    this.camera = this.webGl.camera
    this.resources = this.webGl.resources

    this.property = {
      map: {
        with: 595,
        height: 842,
        rasio : 50,
      },
      mouse: {
        target: new Vector3(), 
        mouseX: null,
        mouseY: null
      },
    }

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
    // Add lys
    for (let i = 0; i < lysLocation.length; i++) {
      const thislys = this.lys.clone()
      const convertPos = {
        z: lysLocation[i].centerY / this.property.map.rasio,
        x: (lysLocation[i].centerX / this.property.map.rasio) - this.property.map.with / this.property.map.rasio / 2
      }
      thislys.position.z = convertPos.z
      thislys.position.x = convertPos.x
      thislys.position.y = 0
      this.add(thislys)
    }

    // Add trees
    // this.add(this.tree.model)

    // Add stones
    this.stone.model.scale.set(0.1, 0.1, 0.1)
    for (let i = 0; i < stoneLocation.length; i++) {
      const thisStone = this.stone.model.clone()
      const convertPos = {
        z: stoneLocation[i].centerY / this.property.map.rasio,
        x: (stoneLocation[i].centerX / this.property.map.rasio) - this.property.map.with / this.property.map.rasio / 2
      }
      thisStone.position.z = convertPos.z
      thisStone.position.x = convertPos.x
      thisStone.position.y = 0
      this.add(thisStone)
    }

    // Add particles
    // this.add(this.particles)

    // Set Camera property
    this.webGl.camera.position.set(0, 2, (this.property.map.height + 100)/this.property.map.rasio)
    this.webGl.controls.enabled = false

    // Lisener 
  }

  update(){
    this.webGl.controls.target = new Vector3(0, 1, 0);
    
  }

  delete(){
    
  }
}