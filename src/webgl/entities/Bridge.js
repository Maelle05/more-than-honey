import {Mesh} from 'three'
import WebGl from '../webglManager'

export default class Bridge {
  constructor() {
    this.webGl = new WebGl()
    this.scene = this.webGl.scene
    this.resources = this.webGl.resources
    this.time = this.webGl.time
    this.debug = this.webGl.debug

    // Resource
    this.resource = this.resources.items.bridgeModel

    this.setModel()
  }

  setModel() {
    this.model = this.resource.scene

    this.model.traverse((child) => {
      if (child instanceof Mesh) {
        child.castShadow = true
      }
    })
  }

  update() {

  }
}