import WebGl from '../webglManager'
import {
  Group,
  Vector3,
  BoxGeometry,
  MeshBasicMaterial,
  Mesh,
  CatmullRomCurve3,
  Line,
  BufferGeometry,
  LineBasicMaterial} from 'three'
import Particules from '../shaders/fireflies'
import Stone from '../entities/Stone'
import Bee from '../entities/BlueBee'
import mapSetting from '../elementsLocations/outsideOne/mapSetting.json'
import stoneLocation from '../elementsLocations/outsideOne/stone.json'
import daisyLocation from '../elementsLocations/outsideOne/daisy.json'
import lysLocation from '../elementsLocations/outsideOne/lys.json'
import treeLocation from '../elementsLocations/outsideOne/tree.json'
import nenupharLocation from '../elementsLocations/outsideOne/nenuphar.json'
import mushroomLocation from '../elementsLocations/outsideOne/mushrooms.json'
import bridgeLocation from '../elementsLocations/outsideOne/bridge.json'
import beePath from '../elementsLocations/outsideOne/beePath.json'
import QueenPath from '../elementsLocations/outsideOne/QweenPath.json'
import Listener from '../utils/Listener'
import { MathUtils } from 'three'
import Grass from '@/webgl/shaders/grass/grass'
import Daisy from '@/webgl/entities/Daisy'
import Trunk from '@/webgl/entities/Trunk'
import Mushroom from '@/webgl/entities/Mushroom'
import {randomIntFromInterval} from '@/webgl/utils/RandowBetweenTwo'
import Bridge from '@/webgl/entities/Bridge'
import Nenuphar from '@/webgl/entities/Nenuphar'
import Queen from '../entities/Queen'

import { AudioClass } from "@/utils/voice"

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

    this.mixer = []

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
        deltaLookAt: 0.007,
        speed: 0.0005,
        target: new Vector3(),
        curveCurrent: 0.03,
        curveTarget: 0.03,
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
    })
  }

  setup(){
    this.lys = this.resources.items.lysModel.scene
    this.tree = this.resources.items.treeModel.scene
    this.stone = new Stone()
    this.bee = new Bee()
    this.queen = new Queen()
    this.particles = new Particules()
    this.grass = new Grass()
    this.daisy = new Daisy()
    this.trunk = new Trunk()
    this.mushroom = new Mushroom()
    this.bridge = new Bridge()
    this.nenuphar = new Nenuphar()

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
      // this.add(handle)
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


    // Queen Path
    // extract from .json and change format
    this.QueenInitialPoints = []
    for (let i = 0; i < QueenPath.length; i++) {
      this.QueenInitialPoints.push({x: ( QueenPath[i].x / this.property.map.ratio ) - this.property.map.with / this.property.map.ratio / 2, y: QueenPath[i].z ? QueenPath[i].z : 4, z: QueenPath[i].y / this.property.map.ratio })
    }
    this.QueenCurveHandles = []
    for ( const handlePos of this.QueenInitialPoints ) {
      const handle = new Mesh( this.boxGeometry, this.boxMaterial )
      handle.position.copy( handlePos )
      this.QueenCurveHandles.push( handle )
      // this.add(handle)
    }
    // Calculate Smooth curve
    this.QueenCurve = new CatmullRomCurve3(
      this.QueenCurveHandles.map( ( handle ) => handle.position )
    )
    this.QueenCurve.curveType = 'centripetal'
    this.QueenCurve.closed = true
    this.QueenPoints = this.QueenCurve.getPoints( 50 )
    this.QueenLine = new Line(
      new BufferGeometry().setFromPoints( this.QueenPoints ),
      new LineBasicMaterial( { color: 0x00ff00 } )
    )
    // this.add( this.QueenLine )


    this.init()
  }

  init(){
    // Set fog
    this.scene.fog.density = 0.01

    // Add bee
    this.beeMove = 0
    this.beePoss = this.curve.getPointAt(this.beeMove)
    this.beePoss2 = this.curve.getPointAt(this.beeMove + 0.01)
    this.bee.model.position.copy(this.beePoss)
    this.bee.model.lookAt(this.beePoss2)
    this.bee.model.scale.set(0.04, 0.04, 0.04)
    this.add(this.bee.model)

    // Add Queen
    // console.log(this.queen)
    this.queen.model.rotation.set(0, Math.PI, 0)
    this.queen.model.scale.set(0.07, 0.07, 0.07)
    this.queen.model.position.copy(this.QueenCurve.getPointAt(0))
    this.add(this.queen.model)



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
      const lysSize = randomIntFromInterval(0.05,0.13, 0.01)
      thisLys.scale.set(lysSize, lysSize, lysSize)
      thisLys.position.set(convertPos.x, -1.5, convertPos.z)
      thisLys.rotation.set(0, Math.random(), Math.random() / 10)
      this.add(thisLys)
    }

    // Add trees
    for (let i = 0; i < treeLocation.length; i++) {
      // TODO add animation for tree
      // const thisTree = skeletonClone(this.tree)
      // console.log(this.tree)
      // animation
      // const mixer = new AnimationMixer(thisTree)
      // mixer.clipAction(this.tree.resource.animations[0]).play()

      const thisTree = this.tree.clone()
      const convertPos = {
        z: treeLocation[i].centerY / this.property.map.ratio,
        x: (treeLocation[i].centerX / this.property.map.ratio) - this.property.map.with / this.property.map.ratio / 2
      }
      const treeSize = randomIntFromInterval(6.5,9.5, 0.01)
      thisTree.scale.set(treeSize, treeSize, treeSize)
      thisTree.position.set(convertPos.x, -1.3, convertPos.z)
      thisTree.rotation.set(0, Math.random() * 25, Math.random() / 10)
      // this.mixers.push(mixer)
      this.add(thisTree)
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
      thisStone.position.set(convertPos.x, -3, convertPos .z)
      thisStone.rotation.set(0, Math.random() * 50, Math.random() / 10)
      this.add(thisStone)
    }

    // Add nenuphar
    for (let i = 0; i < nenupharLocation.length; i++) {
      const thisNenuphar = this.nenuphar.model.clone()
      const convertPos = {
        z: nenupharLocation[i].centerY / this.property.map.ratio,
        x: (nenupharLocation[i].centerX / this.property.map.ratio) - this.property.map.with / this.property.map.ratio / 2
      }
      const stoneSize = randomIntFromInterval(0.3,0.5, 0.01)
      thisNenuphar.scale.set(stoneSize, stoneSize, stoneSize)
      thisNenuphar.position.set(convertPos.x, -2, convertPos .z)
      thisNenuphar.rotation.set(0, Math.random() * 50, Math.random() / 10)
      this.add(thisNenuphar)
    }

    // Add daisys
    for (let i = 0; i < daisyLocation.length; i++) {
      const thisDaisy = this.daisy.model.clone()
      const convertPos = {
        z: daisyLocation[i].centerY / this.property.map.ratio,
        x: (daisyLocation[i].centerX / this.property.map.ratio) - this.property.map.with / this.property.map.ratio / 2
      }
      const daisySize = randomIntFromInterval(0.7,1.5, 0.01)
      thisDaisy.scale.set(daisySize, daisySize, daisySize)
      thisDaisy.position.set(convertPos.x, -3, convertPos.z)
      this.add(thisDaisy)
    }

    // Add bridge
    this.bridge.model.scale.set(2.3, 2.3, 2.3)
    for (let i = 0; i < bridgeLocation.length; i++) {
      const thisBridge = this.bridge.model.clone()
      const convertPos = {
        z: bridgeLocation[i].centerY / this.property.map.ratio,
        x: (bridgeLocation[i].centerX / this.property.map.ratio) - this.property.map.with / this.property.map.ratio / 2
      }
      thisBridge.position.set(convertPos.x, -2.7, convertPos.z)
      thisBridge.rotation.set(0, Math.PI, 0)
      this.add(thisBridge)
    }

    // Add mushrooms
    for (let i = 0; i < mushroomLocation.length; i++) {
      const thisMushroom = this.mushroom.model.clone()
      const convertPos = {
        z: mushroomLocation[i].centerY / this.property.map.ratio,
        x: (mushroomLocation[i].centerX / this.property.map.ratio) - this.property.map.with / this.property.map.ratio / 2
      }
      const mushroomSize = randomIntFromInterval(0.4,1.3, 0.01)
      thisMushroom.scale.set(mushroomSize, mushroomSize, mushroomSize)
      thisMushroom.position.set(convertPos.x, -3.2, convertPos.z)
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
      const result = this.property.moveBee.curveTarget - this.listener.property.virtualScroll.delta / 90000
      if (result > 0.03 && result < 0.98) {
        this.property.moveBee.curveTarget -= this.listener.property.virtualScroll.delta / 90000
      }
    })

    setTimeout(() => {
      this.loader.classList.add('loaded')
    }, 500)
  }

  update(){
    if (this.curve) {
      this.property.moveBee.curveCurrent = MathUtils.damp(this.property.moveBee.curveCurrent, this.property.moveBee.curveTarget, this.property.moveBee.speed, this.time.delta)

      this.property.moveBee.target = this.curve.getPointAt(this.property.moveBee.curveCurrent)
      this.property.camera.target = this.curve.getPointAt(this.property.moveBee.curveCurrent + this.property.moveBee.deltaLookAt)
      
      this.bee.model.position.set(this.property.moveBee.target.x, this.property.moveBee.target.y - 0.5, this.property.moveBee.target.z )
      this.bee.model.lookAt(this.property.camera.target)

      const possCam = this.curve.getPointAt(this.property.moveBee.curveCurrent - 0.03)
      this.webGl.camera.position.set(possCam.x, possCam.y + 1, possCam.z)
      this.webGl.controls.target.set(this.property.camera.target.x, this.property.camera.target.y + 0.3, this.property.camera.target.z )
    }

    if(this.bee){
      this.bee.update()
    }

    if(this.grass) {
      this.grass.update()
    }

    if(this.particles) {
      this.particles.update()
    }

    if (this.queen) {
      this.queen.update()
      this.queen.model.position.copy(this.QueenCurve.getPointAt((this.time.elapsed / 3000) % 1 ))
    }

  }

  delete(){
    
  }
}