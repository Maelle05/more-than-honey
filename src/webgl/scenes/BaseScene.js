import { Group } from 'three'
import WebGl from '../webglManager'

export default class BaseScene extends Group
{
  constructor(){
    super()
    this.webGl = new WebGl()
    this.scene = this.webGl.scene
    this.resources = this.webGl.resources

    // Wait for resources
    this.resources.on(`sourcesReadybase`, () =>
    {
      this.setup()
    })
  }

  setup(){

  }

  update(){
    
  }
}