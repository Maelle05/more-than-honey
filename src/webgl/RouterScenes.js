import WebGl from "./webglManager"

import BaseScene from "./scenes/BaseScene"
import FoxScene from "./scenes/FoxScene"
import BeeScene from "./scenes/BeeScene"
import HiveScene from "./scenes/HiveScene"
import OutsideOne from "./scenes/OutsideOne"

let routerScenesInstance = null

export default class RouterScenes {
  constructor(){

    if(routerScenesInstance){
      return routerScenesInstance
    }

    routerScenesInstance = this

    this.webGl = new WebGl()

    this.allScenes = {}

    this.currentRoot = window.location.pathname.replace(/[^\w\s]/gi, '')
    this.currentScene = new BaseScene

    this.webGl.scene.add(this.currentScene)

  }

  rootChange(nameScene){
    
    this.webGl.scene.remove(this.currentScene)

    if (!this.allScenes[nameScene]) {
      switch (nameScene) {
        case 'fox':
          this.allScenes[nameScene] = new FoxScene()
          break;

        case 'bee':
          this.allScenes[nameScene] = new BeeScene()
          break;
        
        case 'hive':
            this.allScenes[nameScene] = new HiveScene()
            break;
        
        case 'outsideOne':
            this.allScenes[nameScene] = new OutsideOne()
            break;
      
        default:
          this.allScenes[nameScene] = new BaseScene()
          break;
      }
    }

    // console.log(this.allScenes);

    this.currentScene = this.allScenes[nameScene]

    this.webGl.scene.add(this.currentScene)

  }

  update(){
    if (this.currentScene) {
      this.currentScene.update()
    }
  }
}