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
    this.init()

    // Add Bee
    this.bee = new Bee()
    this.add(this.bee.model)

  }

  init(){
    // Set Camera position
    // this.webGl.camera.position.set(8, 3, 5)

    // Lisener 
  }

  update(){
    if(this.bee)
      this.bee.update()
  }

  delete(){
    
  }
}