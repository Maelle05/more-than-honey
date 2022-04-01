import { Group } from 'three'
import Bee from '../entities/Bee'
import WebGl from '../webglManager'
import Floor from "@/webgl/entities/Floor"

export default class BeeScene extends Group
{
  constructor(){
    super()
    this.webGl = new WebGl()
    this.scene = this.webGl.scene
    this.resources = this.webGl.resources

    // Wait for resources
    this.resources.on(`sourcesReadybee`, () =>
    {
      this.setup()
    })
  }

  setup(){
    // Add Bee
    this.bee = new Bee()
    this.floor = new Floor()

    this.init()
  }

  init(){
    // Set Camera position
    this.webGl.camera.position.set(6, 5, 0)

    // Set Bee Posistion
    if(this.bee){
      this.add(this.bee.model)
      this.add(this.floor.mesh)
      this.bee.model.position.set(0, 0, 0)
    }

    // Lisener 
  }

  update(){
    if(this.bee)
      this.bee.update()
  }

  delete(){
    
  }
}