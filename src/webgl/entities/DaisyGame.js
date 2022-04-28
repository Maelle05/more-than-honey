import {Mesh, AnimationMixer, SphereGeometry, MeshBasicMaterial} from 'three'
import WebGl from '../webglManager'

export default class DaisyGame
{
  constructor(){
    this.webGl = new WebGl()
    this.resources = this.webGl.resources
    this.time = this.webGl.time
    this.debug = this.webGl.debug

    // Resource
    this.resource = this.resources.items.daisyModel

    this.setModel()
  }

  setModel(){
    this.model = this.resource.scene

    // For raycaster
    const dummyMesh = new Mesh(
      new SphereGeometry(0.6, 16, 16),
      new MeshBasicMaterial({color: 0xffaa22})
    )
    dummyMesh.visible = false
    dummyMesh.name = 'dummy'
    dummyMesh.position.y += 1
    this.model.add(dummyMesh)
    this.model.scale.setScalar(0.7)

    this.model.traverse((child) =>
    {
        if(child instanceof Mesh)
        {
            child.castShadow = true
            child.layers.enable(1)
        }
    })
  }

  
  update()
  {

  }
}