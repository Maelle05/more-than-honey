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
    this.init()

  }

  init(){
    // Set Camera position
    // this.webGl.camera.position.set(8, 3, 5)

    // Lisener 
  }

  update(){
    
  }

  delete(){
    
  }
}