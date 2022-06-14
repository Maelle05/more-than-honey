import {CubeTextureLoader, FogExp2, PerspectiveCamera, Scene, sRGBEncoding, WebGLRenderer} from 'three'
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js'
import Stats from 'stats.js'
import sources from './manifest.json'
import Resources from './utils/Resources.js'
import Debug from './utils/Debug.js'
import Sizes from './utils/Sizes.js'
import Time from './utils/Time'
import RouterScenes from './RouterScenes'
import Bloom from './shaders/bloom'

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

    this.loader = null

    // Camera
    this.camera = new PerspectiveCamera(35, this.sizes.width / this.sizes.height, 0.5, 700)
    this.camera.position.set(0, 5, 0)
    this.scene.add(this.camera)

    // Fog
    this.scene.fog = new FogExp2( 0x04060b, 0.01 )

    // Debug
    this.stats = new Stats()
    this.stats.showPanel( 0 ) // 0: fps, 1: ms, 2: mb, 3+: custom
    document.body.appendChild( this.stats.dom )
  
    this.stats.dom.style.top = 'auto'
    this.stats.dom.style.bottom = '0'
    this.stats.dom.style.opacity = 0
    
    // OrbitControls
    this.controls = new OrbitControls(this.camera, this.canvas)
    this.controls.enableDamping = true
    this.controls.enabled = false

    // Renderer
    this.renderer = new WebGLRenderer({
        canvas: this.canvas,
        antialias: true,
        alpha: true
    })
    this.renderer.setSize(this.sizes.width, this.sizes.height)
    this.renderer.setPixelRatio(Math.min(this.sizes.pixelRatio, 2))

    // Set Sky
    const cubeTextureLoader = new CubeTextureLoader()
    this.environmentMapTexture = cubeTextureLoader.load([
        '/webgl/textures/Sky/px.png',
        '/webgl/textures/Sky/nx.png',
        '/webgl/textures/Sky/py.png',
        '/webgl/textures/Sky/ny.png',
        '/webgl/textures/Sky/pz.png',
        '/webgl/textures/Sky/nz.png'
    ])
    this.environmentMapTexture.encoding = sRGBEncoding

    this.scene.background = this.environmentMapTexture

    // Post Prossesing
    this.bloom = new Bloom()

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

    // Keybord control Camera -> to debug
    // document.addEventListener('keydown', (e) => {
    //   switch (e.key) {
    //     case 'z':
    //       this.camera.position.z -= 0.5
    //       break
    //     case 's':
    //       this.camera.position.z += 0.5
    //       break
    //     case 'q':
    //       this.camera.position.x -= 0.5
    //       break
    //     case 'd':
    //       this.camera.position.x += 0.5
    //       break
    //     default:
    //       break
    //   }
    //   // console.log(this.camera.position);
    // })

    // document.addEventListener('keydown', (e)=>{
    //   if (e.key === 's') {
    //     this.saveIMG()
    //   }
    // })
  }

  getLoaderRef(loader) {
    this.loader = loader
    return this.loader
  }

  resize(){
    this.camera.aspect = this.sizes.width / this.sizes.height
    this.camera.updateProjectionMatrix()

    this.renderer.setSize(this.sizes.width, this.sizes.height)
    this.renderer.setPixelRatio(Math.min(this.sizes.pixelRatio, 2))
  }

  update(){
    this.stats.begin()

    this.controls.update()
    this.world.update()

    // this.renderer.render(this.scene, this.camera)
    this.bloom.update()

    this.stats.end()
  }

  saveIMG(){
      var imgData

      try {
          var strMime = "image/jpeg"
          imgData = this.canvas.toDataURL(strMime)

          var link = document.createElement('a')
          link.setAttribute('href', imgData)
          link.setAttribute('target', '_blank')
          link.setAttribute('download', 'test')

          link.click()

      } catch (e) {
          console.log(e)
          return
      }
  }
}