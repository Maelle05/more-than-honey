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
    this.hive = this.resources.items.hiveModel.scene

    this.init()
  }

  init(){
    // Set Camera position
    this.webGl.camera.position.set(-15, 0, -40)

    // Listener

    // add models
    this.add(this.hive)

  }

  update(){
    
  }

  delete(){
    
  }
}