import WebGl from '../webglManager'
import {
  Group,
  Vector3,
  DoubleSide,
  PlaneGeometry,
  BoxGeometry,
  MeshBasicMaterial,
  Mesh,
  CatmullRomCurve3,
  Line,
  BufferGeometry,
  LineBasicMaterial,
  DefaultLoadingManager
} from 'three'
import Particules from '../shaders/particulesTest'
import Stone from '../entities/Stone'
import Bee from '../entities/BlueBee'
import mapSetting from '../elementsLocations/outsideOne/mapSetting.json'
import stoneLocation from '../elementsLocations/outsideOne/stone.json'
import daisyLocation from '../elementsLocations/outsideOne/daisy.json'
import lysLocation from '../elementsLocations/outsideOne/lys.json'
import trunkLocation from '../elementsLocations/outsideOne/trunk.json'
import treeLocation from '../elementsLocations/outsideOne/tree.json'
import mushroomLocation from '../elementsLocations/outsideOne/mushrooms.json'
import bridgeLocation from '../elementsLocations/outsideOne/bridge.json'
import beePath from '../elementsLocations/outsideOne/beePath.json'
import Listener from '../utils/Listener'
import { MathUtils } from 'three'
import Grass from '@/webgl/shaders/grass'
import Daisy from '@/webgl/entities/Daisy'
import Trunk from '@/webgl/entities/Trunk'
import Mushroom from '@/webgl/entities/Mushroom'
import {randomIntFromInterval} from '@/webgl/utils/RandowBetweenTwo'
import Bridge from '@/webgl/entities/Bridge'
import { AudioClass } from '../../utils/voix'
import voieIntro from '../../assets/voix/intro.mp3'

export default class OutsideOneScene extends Group
{
  constructor(){
    super()
    this.webGl = new WebGl()
    this.scene = this.webGl.scene
    this.renderer = this.webGl.renderer
    this.camera = this.webGl.camera
    this.resources = this.webGl.resources
    this.time = this.webGl.time
    this.loader = this.webGl.loader

    if(mapSetting[0].left != 0 || mapSetting[0].top != 0){
      alert('La map n\'a pas les bonnes coordonnées')
    }

    this.property = {
      map: {
        with: mapSetting[0].right,
        height: mapSetting[0].bottom,
        ratio : 5,
      },
      mouse: {
        target: new Vector3(), 
        mouseX: null,
        mouseY: null
      },
      moveBee: {
        deltaLookAt: 0.02,
        speed: 0.001,
        target: new Vector3(),
        curveCurrent: 0.05,
        curveTarget: 0.05,
        baseY: 2.5
      },
      camera: {
        target : 0,
        current: 0
      }
    }

    // Wait for resources
    this.resources.on(`sourcesReadyoutsideOne`, () =>
    {
      this.setup()
      // this.loader.classList.add('loaded')
    })
  }

  setup(){
    this.lys = this.resources.items.lysModel.scene
    this.tree = this.resources.items.treeModel.scene
    this.stone = new Stone()
    this.bee = new Bee()
    this.particles = new Particules()
    this.grass = new Grass()
    this.daisy = new Daisy()
    this.trunk = new Trunk()
    this.mushroom = new Mushroom()
    this.bridge = new Bridge()

    this.listener = new Listener()

    // CURVE HANDLE
    // extract from .json and change format
    this.initialPoints = []
    for (let i = 0; i < beePath.length; i++) {
      this.initialPoints.push({x: ( beePath[i].x / this.property.map.ratio ) - this.property.map.with / this.property.map.ratio / 2, y: beePath[i].z ? beePath[i].z : this.property.moveBee.baseY, z: beePath[i].y / this.property.map.ratio })
    }
    // create cube for each point of the curve
    this.boxGeometry = new BoxGeometry( 0.5, 0.5, 0.5 )
		this.boxMaterial = new MeshBasicMaterial({ color: 'red'})
    this.curveHandles = []
    for ( const handlePos of this.initialPoints ) {
      const handle = new Mesh( this.boxGeometry, this.boxMaterial )
      handle.position.copy( handlePos )
      this.curveHandles.push( handle )
      // this.add( handle )
    }
    // Calculate Smooth curve
    this.curve = new CatmullRomCurve3(
      this.curveHandles.map( ( handle ) => handle.position )
    )
    this.curve.curveType = 'centripetal'
    this.curve.closed = false
    this.points = this.curve.getPoints( 50 )
    this.line = new Line(
      new BufferGeometry().setFromPoints( this.points ),
      new LineBasicMaterial( { color: 0x00ff00 } )
    )
    // this.add( this.line )

    this.init()
  }

  init(){
    setTimeout(() => {
      this.loader.classList.add('loaded')
    }, 500)

    // Add bee
    this.beeMove = 0
    this.beePoss = this.curve.getPointAt(this.beeMove)
    this.beePoss2 = this.curve.getPointAt(this.beeMove + 0.01)
    this.bee.model.position.copy(this.beePoss)
    this.bee.model.lookAt(this.beePoss2)
    // this.bee.model.scale.set(0.1, 0.1, 0.1)
    this.add(this.bee.model)

    // Add grass
    this.grass.position.set(0,0, this.property.map.height / this.property.map.ratio)
    this.add(this.grass)

    // Add lys
    for (let i = 0; i < lysLocation.length; i++) {
      const thisLys = this.lys.clone()
      const convertPos = {
        z: lysLocation[i].centerY / this.property.map.ratio,
        x: (lysLocation[i].centerX / this.property.map.ratio) - this.property.map.with / this.property.map.ratio / 2
      }
      const lysSize = randomIntFromInterval(0.1,0.25, 0.01)
      thisLys.children[0].scale.set(lysSize, lysSize, lysSize)
      thisLys.position.set(convertPos.x, 0, convertPos.z)
      thisLys.rotation.set(Math.random() / 10, Math.random(), Math.random() / 10)
      this.add(thisLys)
    }

    // Add trees
    this.tree.children[0].scale.set(0.08, 0.08, 0.08)
    for (let i = 0; i < treeLocation.length; i++) {
      const thisTree = this.tree.clone()
      const convertPos = {
        z: treeLocation[i].centerY / this.property.map.ratio,
        x: (treeLocation[i].centerX / this.property.map.ratio) - this.property.map.with / this.property.map.ratio / 2
      }
      thisTree.position.set(convertPos.x, 19, convertPos.z)
      thisTree.rotation.set(0, Math.random() * 25, Math.random() / 10)
      this.add(thisTree)
      
      // add Bloom
      // thisTree.children[0].layers.disableAll()
      thisTree.children[0].layers.enable(1)
    }

    // Add stones
    for (let i = 0; i < stoneLocation.length; i++) {
      const thisStone = this.stone.model.clone()
      const convertPos = {
        z: stoneLocation[i].centerY / this.property.map.ratio,
        x: (stoneLocation[i].centerX / this.property.map.ratio) - this.property.map.with / this.property.map.ratio / 2
      }
      const stoneSize = randomIntFromInterval(1.8,2.8, 0.01)
      thisStone.scale.set(stoneSize, stoneSize, stoneSize)
      thisStone.position.set(convertPos.x, 0, convertPos.z)
      thisStone.rotation.set(0, Math.random() * 50, Math.random() / 10)
      this.add(thisStone)
    }

    // Add daisys
    this.daisy.model.scale.set(0.7, 0.7, 0.7)
    for (let i = 0; i < daisyLocation.length; i++) {
      const thisDaisy = this.daisy.model.clone()
      const convertPos = {
        z: daisyLocation[i].centerY / this.property.map.ratio,
        x: (daisyLocation[i].centerX / this.property.map.ratio) - this.property.map.with / this.property.map.ratio / 2
      }
      const daisySize = randomIntFromInterval(0.7,1.5, 0.01)
      thisDaisy.scale.set(daisySize, daisySize, daisySize)
      thisDaisy.position.set(convertPos.x, 0.5, convertPos.z)
      this.add(thisDaisy)
    }

    // Add trunks
    for (let i = 0; i < trunkLocation.length; i++) {
      const thisTrunk = this.trunk.model.clone()
      const convertPos = {
        z: trunkLocation[i].centerY / this.property.map.ratio,
        x: (trunkLocation[i].centerX / this.property.map.ratio) - this.property.map.with / this.property.map.ratio / 2
      }
      const trunkSize = randomIntFromInterval(0.08,0.2, 0.01)
      thisTrunk.scale.set(trunkSize, trunkSize, trunkSize)
      thisTrunk.position.set(convertPos.x, -0.2, convertPos.z)
      thisTrunk.rotation.set(0, Math.random() * 25, 0)
      this.add(thisTrunk)
    }

    // Add bridge
    this.bridge.model.scale.set(7, 7, 7)
    for (let i = 0; i < bridgeLocation.length; i++) {
      const thisBridge = this.bridge.model.clone()
      const convertPos = {
        z: bridgeLocation[i].centerY / this.property.map.ratio,
        x: (bridgeLocation[i].centerX / this.property.map.ratio) - this.property.map.with / this.property.map.ratio / 2
      }
      thisBridge.position.set(convertPos.x, -10, convertPos.z)
      this.add(thisBridge)
    }

    // Add mushroom
    for (let i = 0; i < mushroomLocation.length; i++) {
      const thisMushroom = this.mushroom.model.clone()
      const convertPos = {
        z: mushroomLocation[i].centerY / this.property.map.ratio,
        x: (mushroomLocation[i].centerX / this.property.map.ratio) - this.property.map.with / this.property.map.ratio / 2
      }
      const mushroomSize = randomIntFromInterval(0.2,0.5, 0.01)
      thisMushroom.scale.set(mushroomSize, mushroomSize, mushroomSize)
      thisMushroom.position.set(convertPos.x, 0, convertPos.z)
      thisMushroom.rotation.set(0, Math.random() * 25, 0)
      this.add(thisMushroom)
    }

    // Add particles
    this.add(this.particles)

    // Set Camera property
    this.webGl.camera.position.set(0, 20, (this.property.map.height + 200 )/this.property.map.ratio)
    this.webGl.controls.enabled = false
    this.webGl.controls.target = new Vector3(0, -5, 0)

    // Listener
    this.listener.on('scroll', ()=>{ 
      const result = this.property.moveBee.curveTarget + this.listener.property.virtualScroll.delta / 50000
      if (result > 0.05 && result < 0.98) {
        this.property.moveBee.curveTarget += this.listener.property.virtualScroll.delta / 50000
      }
      
    })
    // Voix
    const url = `${window.location.protocol + '//' + window.location.host}`+voieIntro
    const voix = new AudioClass(url, true)
    this.audioPlay = true

    

  }

  update(){
    if (this.curve) {
      this.property.moveBee.curveCurrent = MathUtils.damp(this.property.moveBee.curveCurrent, this.property.moveBee.curveTarget, this.property.moveBee.speed, this.time.delta)

      this.property.moveBee.target = this.curve.getPointAt(this.property.moveBee.curveCurrent)
      this.property.camera.target = this.curve.getPointAt(this.property.moveBee.curveCurrent + this.property.moveBee.deltaLookAt)
      
      this.bee.model.position.set(this.property.moveBee.target.x, this.property.moveBee.target.y - 0.5, this.property.moveBee.target.z )
      this.bee.model.lookAt(this.property.camera.target)

      const possCam = this.curve.getPointAt(this.property.moveBee.curveCurrent - 0.05)
      this.webGl.camera.position.set(possCam.x, possCam.y + 2, possCam.z)
      this.webGl.controls.target.set(this.property.camera.target.x, this.property.camera.target.y + 1, this.property.camera.target.z )
    }

    // Loader
    // if (this.isLoad) {
    //   this.loader.classList.add('loaded')
    // }

    if(this.bee){
      this.bee.update()
    }

    if(this.grass) {
      this.grass.update()
    }

  }

  delete(){
    
  }
}