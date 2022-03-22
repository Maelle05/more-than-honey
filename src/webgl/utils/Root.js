import sources from './../manifest.json'
import Resources from './../utils/Resources'
import RouterScenes from '../RouterScenes'

export default class Root {
  constructor(){
    this.currentPath
    this.resources = new Resources(sources)
    this.routerScenes = new RouterScenes()
    this.resourcesCall = ''

    this.rootChange(window.location.pathname.replace(/[^\w\s]/gi, '') || 'home')
  }
  rootChange(path){
    if(path != this.currentPath){
      this.currentPath = path

      this.routerScenes.rootChange(this.currentPath)
      this.resources.rootChange(this.currentPath)

    }
  }
}