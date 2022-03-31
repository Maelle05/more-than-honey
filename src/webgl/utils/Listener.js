import WebGl from "../webglManager";
import EventEmitter from "./EventEmitter";

let listenerInstance = null

export default class Listener extends EventEmitter {
  constructor(){
    // Singleton
    if(listenerInstance){
      return listenerInstance
    }
    super()
    listenerInstance = this

    this.webgl = new WebGl()
    this.sizes = this.webgl.sizes

    this.property = {
      cursor: {
        x: null,
        y: null,
      },
      virtualScroll: null
    }

    // Add Listener
    document.addEventListener('mousemove', this.mouseMovehandle.bind(this))
  }

  mouseMovehandle(e) {
    this.property.cursor.x = (e.clientX / this.sizes.width) * 2 - 1;
    this.property.cursor.y = -(e.clientY / this.sizes.height) * 2 + 1;
    this.trigger(`mouse move`)
  }


}