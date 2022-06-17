/* eslint-disable no-case-declarations */
import {TextureLoader} from 'three'
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader.js'
import EventEmitter from './EventEmitter.js'
import {Howl} from 'howler'

let resourcesInstance = null

export default class Resources extends EventEmitter {
  constructor(sources){

    // Singleton
    if(resourcesInstance){
      return resourcesInstance
    }
    
    super()
    
    resourcesInstance = this

    this.sources = sources

    this.items = {}
    this.sceneItems = []
    this.toLoad = null
    this.loaded = 0

    this.setLoader()
  }

  setLoader(){
    this.loaders = {}
    this.loaders.gltfLoader = new GLTFLoader()
    this.loaders.textureLoader = new TextureLoader()
  }

  checkSceneItems(activePathName){
    for (let i = 0; i < this.sources.length; i++) {
      if(this.sources[i].actingScenes.includes(`${activePathName}Scene`) && activePathName != '' || this.sources[i].actingScenes.includes(`all`)){
        this.sceneItems.push(this.sources[i])
      }
    }

    this.toLoad = this.sceneItems.length

    this.startLoading()
  }

  startLoading(){
    // Load each source
    if(this.sceneItems.length === 0){
      this.trigger(`sourcesReady${this.activeSceneName}`)
    }

    for(const source of this.sceneItems)
    {
      if(this.items[source.name] === undefined){
        switch (source.type) {
          case 'gltfModel':
            this.loaders.gltfLoader.load(
              source.path,
              (file) =>
                {
                  this.sourceLoaded(source, file)
                }
            )
            break
          case 'texture':
            this.loaders.textureLoader.load(
              source.path,
              (file) =>
                {
                  this.sourceLoaded(source, file)
                }
            )
            break
          case 'sound':
              const sound = new Howl({
                src: [source.path],
                autoplay: false,
                loop: source.loop,
                volume: source.volume,
                onload: () => { this.sourceLoaded(source, sound)},
                onend: () => {
                  this.trigger(`sound${source.name}Finished`)
                  // console.log(`sound${source.name}Finished`)
                }
              })
              break
          default:
            break
        }
      } else {
        this.checkAllLoad()
      }
    }
  }

  sourceLoaded(source, file){
    if (source.type === 'sound') {  
      this.items[source.name] = {
        sound: file,
        volume: source.volume
      }
    } else {
      this.items[source.name] = file
    }

    this.loaded++

    if(this.loaded === this.toLoad)
    {
      console.log(`sourcesReady${this.activeSceneName}`)
      this.trigger(`sourcesReady${this.activeSceneName}`)
    }
  }

  checkAllLoad(){
    this.loaded ++
    
    if(this.loaded === this.toLoad)
    {
      console.log(`sourcesReady${this.activeSceneName}`)
      this.trigger(`sourcesReady${this.activeSceneName}`)
    }
  }

  rootChange(nameScene){
    this.activeSceneName = nameScene
    this.sceneItems = []
    this.toLoad = null
    this.loaded = 0

    this.checkSceneItems(this.activeSceneName)
  }
}