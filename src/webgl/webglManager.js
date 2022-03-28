import { Scene, PerspectiveCamera, WebGLRenderer, sRGBEncoding, CineonToneMapping, PCFSoftShadowMap, AmbientLight} from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

import sources from './manifest.json'
import Resources from './utils/Resources.js'
import Debug from './utils/Debug.js'
import Sizes from './utils/Sizes.js'
import Time from './utils/Time'
import RouterScenes from './RouterScenes'
import Processing from './shaders/postProssesing'

let webglInstance = null

export default class WebGl{
  constructor(){

    // Singleton
    if(webglInstance){
      return webglInstance
    }
    webglInstance = this

    // Options
    this.canvas = document.querySelector('canvas.webgl')

    // Setup
    this.resources = new Resources(sources)
    this.debug = new Debug()
    this.sizes = new Sizes()
    this.time = new Time()
    this.scene = new Scene()
    this.world = new RouterScenes()

    // Camera
    this.camera = new PerspectiveCamera(35, this.sizes.width / this.sizes.height, 0.1, 100)
    this.camera.position.set(6, 5, 0)
    this.scene.add(this.camera)

    // Debug


    // OrbitControls
    this.controls = new OrbitControls(this.camera, this.canvas)
    this.controls.enableDamping = true
    this.controls.enabled = true

    // Add Light
    const light = new AmbientLight( 0x404040 );
    this.scene.add( light );

    // Renderer
    this.renderer = new WebGLRenderer({
        canvas: this.canvas,
        antialias: true
    })
    this.renderer.physicallyCorrectLights = true
    this.renderer.outputEncoding = sRGBEncoding
    this.renderer.toneMapping = CineonToneMapping
    this.renderer.toneMappingExposure = 1.75
    this.renderer.shadowMap.enabled = true
    this.renderer.shadowMap.type = PCFSoftShadowMap
    this.renderer.setClearColor('#000000')
    this.renderer.setSize(this.sizes.width, this.sizes.height)
    this.renderer.setPixelRatio(Math.min(this.sizes.pixelRatio, 2))

    // Post Prossesing
    this.postPross = new Processing()


    // Resize event
    this.sizes.on('resize', () =>
    {
      this.resize()
    })

    // Time tick event
    this.time.on('tick', () =>
    {
      this.update()
    })
  }

  resize(){
    this.camera.aspect = this.sizes.width / this.sizes.height
    this.camera.updateProjectionMatrix()

    this.renderer.setSize(this.sizes.width, this.sizes.height)
    this.renderer.setPixelRatio(Math.min(this.sizes.pixelRatio, 2))
  }

  update(){
    this.controls.update()
    this.world.update()
    this.postPross.rendererRender()
    // console.log(this.renderer)
    
  }
}