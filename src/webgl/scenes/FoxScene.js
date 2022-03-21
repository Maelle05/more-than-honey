import WebGl from './../webglManager'

import Fox from './../entities/Fox'
import { Group, DirectionalLight } from 'three'
import Floor from '../entities/Floor'

export default class FoxScene extends Group
{
  constructor(){
    super()
    this.webGl = new WebGl()
    this.scene = this.webGl.scene
    this.resources = this.webGl.resources

    // Wait for resources
    this.resources.on(`sourcesReadyfox`, () =>
    {
      this.setup()
    })
  }

  setup(){
    // Add fox to FoxScene group
    this.fox = new Fox()
    this.add(this.fox.model)

    // Add floor
    this.floor = new Floor()
    this.add(this.floor.mesh)

    // Add Light
    this.sunLight = new DirectionalLight('#ffffff', 4)
    this.sunLight.castShadow = true
    this.sunLight.shadow.camera.far = 15
    this.sunLight.shadow.mapSize.set(1024, 1024)
    this.sunLight.shadow.normalBias = 0.05
    this.sunLight.position.set(3.5, 2, - 1.25)
    this.add(this.sunLight)

  }

  update(){
    if(this.fox)
      this.fox.update()
  }
}