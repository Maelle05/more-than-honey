import { Group } from 'three'
import WebGl from '../webglManager'
import Bee from '../entities/Bee'

export default class RaceGameScene extends Group
{
  constructor(){
    super()
    this.webGl = new WebGl()
    this.scene = this.webGl.scene
    this.resources = this.webGl.resources

    // Wait for resources
    this.resources.on(`sourcesReadyraceGame`, () =>
    {
      console.log('coucou');
      this.setup()
    })
  }

  setup(){
    // Add Bee
    this.bee = new Bee()
    this.add(this.bee.model)

  }

  update(){
    if(this.bee){
      this.bee.update()
    }
    
  }
}