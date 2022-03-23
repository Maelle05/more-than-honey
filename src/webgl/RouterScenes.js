import WebGl from "./webglManager"

import BaseScene from "./scenes/BaseScene"
import FoxScene from "./scenes/FoxScene"
import BeeScene from "./scenes/BeeScene"
import HiveScene from "./scenes/HiveScene"
import OutsideOneScene from "./scenes/OutsideOneScene"
import PollenGameScene from "./scenes/PollenGameScene"
import OutsideTwoScene from "./scenes/OutsideTwoScene"
import RaceGameScene from "./scenes/RaceGameScene"
import EndingScene from "./scenes/HiveEndingScene"
import EventEmitter from "./utils/EventEmitter"

let routerScenesInstance = null

export default class RouterScenes extends EventEmitter{
  constructor(){

    if(routerScenesInstance){
      return routerScenesInstance
    }

    super()

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
          this.allScenes[nameScene] = new OutsideOneScene()
          break;

        case 'pollenGame':
          this.allScenes[nameScene] = new PollenGameScene()
          break;
        
        case 'outsideTwo':
          this.allScenes[nameScene] = new OutsideTwoScene()
          break;
        
        case 'raceGame':
          this.allScenes[nameScene] = new RaceGameScene()
          break;
        
        case 'ending':
          this.allScenes[nameScene] = new EndingScene()
          break;
      
        default:
          this.allScenes[nameScene] = new BaseScene()
          break;
      }
    }

    this.currentScene.delete()
    
    this.currentScene = this.allScenes[nameScene]

    this.webGl.scene.add(this.currentScene)

  }

  update(){
    if (this.currentScene) {
      this.currentScene.update()
    }
  }
}