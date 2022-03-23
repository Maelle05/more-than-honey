import { Group } from 'three'
import Bee from '../entities/Bee'
import WebGl from '../webglManager'

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
    // Set Camera position
    // this.webGl.camera.position.set(0, 2.62, -10)
    
    // Add Bee
    this.bee = new Bee()
    this.add(this.bee.model)

  }

  update(){
    if(this.bee)
      this.bee.update()
  }

  delete(){
    
  }
}