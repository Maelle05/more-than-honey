import {Group, Mesh, MeshBasicMaterial, BoxGeometry} from 'three'
import WebGl from '../webglManager'

export default class HiveScene extends Group
{
  constructor(){
    super()
    this.webGl = new WebGl()
    this.scene = this.webGl.scene
    this.resources = this.webGl.resources

    // Wait for resources
    this.resources.on(`sourcesReadyhive`, () =>
    {
      this.setup()
    })
  }

  setup(){
    const geometry = new BoxGeometry( 1, 1, 1 )
    const material = new MeshBasicMaterial( {color: 0x00ff00} )
    const cube = new Mesh( geometry, material )
    this.add( cube )
  }

  update(){

  }
}