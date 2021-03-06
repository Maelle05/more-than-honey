import WebGl from './webglManager'
import BaseScene from './scenes/BaseScene'
import HiveScene from './scenes/HiveScene'
import OutsideOneScene from './scenes/OutsideOneScene'
import PollenGameScene from './scenes/PollenGameScene'
import OutsideTwoScene from './scenes/OutsideTwoScene'
import RaceGameScene from './scenes/RaceGameScene'
import EndingScene from './scenes/HiveEndingScene'
import EventEmitter from './utils/EventEmitter'
import HomeScene from './scenes/HomeScene'

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
    this.resources = this.webGl.resources
    this.webGl.scene.add(this.currentScene)

    this.audioPlay = {}
  }

  rootChange(nameScene){
    this.webGl.scene.remove(this.currentScene)
    this.currentScene.delete()
    this.currentRoot = window.location.pathname.replace(/[^\w\s]/gi, '')

    if (this.allScenes[nameScene]){
      this.allScenes[nameScene].init()
    }
    
    if (!this.allScenes[nameScene]) {
      switch (nameScene) {
        case 'home':
          this.allScenes[nameScene] = new HomeScene()
          break

        case 'hive':
          this.allScenes[nameScene] = new HiveScene()
          break
        
        case 'outsideOne':
          this.allScenes[nameScene] = new OutsideOneScene()
          break

        case 'pollenGame':
          this.allScenes[nameScene] = new PollenGameScene()
          break
        
        case 'outsideTwo':
          this.allScenes[nameScene] = new OutsideTwoScene()
          break
        
        case 'raceGame':
          this.allScenes[nameScene] = new RaceGameScene()
          break
        
        case 'ending':
          this.allScenes[nameScene] = new EndingScene()
          break
      
        default:
          this.allScenes[nameScene] = new BaseScene()
          break
      }
    }

    this.currentScene = this.allScenes[nameScene]
    this.webGl.scene.add(this.currentScene)

    // Remove 'loaded' class if needed
    if (this.webGl.loader.classList.contains('loaded')) {
      this.webGl.loader.classList.remove('loaded')
    }
  }

  update(){
    if (this.currentScene) {
      this.currentScene.update()
    }
  }
}