import WebGl from "../webglManager";
import EventEmitter from "./EventEmitter";
import VirtualScroll from 'virtual-scroll'

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
      virtualScroll: {
        state: null,
        delta: null
      }
    }

    // Add Listener
    document.addEventListener('mousemove', this.mouseMovehandle.bind(this))

    this.scroller = new VirtualScroll()
    this.scroller.on(this.scrollehandle.bind(this))
  }

  mouseMovehandle(e) {
    this.property.cursor.x = (e.clientX / this.sizes.width) * 2 - 1;
    this.property.cursor.y = -(e.clientY / this.sizes.height) * 2 + 1;
    this.trigger(`mouse move`)
  }

  scrollehandle(event){
    this.property.virtualScroll.state = event.y
    this.property.virtualScroll.delta = event.deltaY
    this.trigger(`scroll`)
  }


}