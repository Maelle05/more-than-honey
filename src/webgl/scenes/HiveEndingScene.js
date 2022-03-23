import { Group } from 'three'
import WebGl from '../webglManager'

export default class EndingScene extends Group
{
  constructor(){
    super()
    this.webGl = new WebGl()
    this.scene = this.webGl.scene
    this.resources = this.webGl.resources

    // Wait for resources
    this.resources.on(`sourcesReadyending`, () =>
    {
      this.setup()
    })
  }

  setup(){

  }

  update(){
    
  }

  delete(){
    
  }
}