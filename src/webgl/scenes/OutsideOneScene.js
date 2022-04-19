import WebGl from '../webglManager'
import { Group, Vector3, BoxGeometry, MeshBasicMaterial, Mesh, CatmullRomCurve3, Line, BufferGeometry, LineBasicMaterial} from 'three'
import Particules from '../shaders/particulesTest'
import Tree from '../entities/Tree'
import Stone from '../entities/Stone'
import Bee from '../entities/BlueBee'
import mapSetting from '../elementsLocations/outsideOne/mapSetting.json'
import stoneLocation from '../elementsLocations/outsideOne/stone.json'
import lysLocation from '../elementsLocations/outsideOne/lys.json'
import beePath from '../elementsLocations/outsideOne/beePath.json'
import Listener from '../utils/Listener'
import { MathUtils } from 'three'
import GrassMaterial from '@/webgl/shaders/grassMaterial'

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
    this.tree = new Tree()
    this.stone = new Stone()
    this.bee = new Bee()
    this.particles = new Particules()
    this.grass = new GrassMaterial()

    this.listener = new Listener()

    this.debug = this.webGl.debug
    if(this.debug.active) {
      const elementGUI = this.debug.ui.addFolder('Elements sizes')
      elementGUI.add(this.lys.children[0].scale, 'x', -5, 5).name('Lyx X').onChange( ( value ) => {
        this.lys.children[0].scale.x = Number( value )
        console.log(value)
      })
      elementGUI.add(this.lys.children[0].scale, 'y', -5, 5).setValue(0.25).name('Lys Y')
      elementGUI.add(this.lys.children[0].scale, 'z', -5, 5).setValue(0.25).name('Lys X')
    }

    // CURVE HANDLE
    // extract from .json and change format
    this.initialPoints = []
    for (let i = 0; i < beePath.length; i++) {
      this.initialPoints.push({x: ( beePath[i].x / this.property.map.ratio ) - this.property.map.with / this.property.map.ratio / 2, y: 2.5, z: beePath[i].y / this.property.map.ratio })
    }
    // create cube for each point of the curve
    this.boxGeometry = new BoxGeometry( 0.5, 0.5, 0.5 )
		this.boxMaterial = new MeshBasicMaterial({ color: 'red'})
    this.curveHandles = []
    for ( const handlePos of this.initialPoints ) {
      const handle = new Mesh( this.boxGeometry, this.boxMaterial )
      handle.position.copy( handlePos )
      this.curveHandles.push( handle )
      this.add( handle )
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
    this.add( this.line )

    this.init()
  }

  init(){
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
    this.lys.children[0].scale.set(0.25, 0.25, 0.25)
    for (let i = 0; i < lysLocation.length; i++) {
      const thislys = this.lys.clone()
      const convertPos = {
        z: lysLocation[i].centerY / this.property.map.ratio,
        x: (lysLocation[i].centerX / this.property.map.ratio) - this.property.map.with / this.property.map.ratio / 2
      }
      thislys.position.z = convertPos.z
      thislys.position.x = convertPos.x
      thislys.position.y = 0
      this.add(thislys)
    }

    // Add trees
    // this.add(this.tree.model)

    // Add stones
    this.stone.model.scale.set(0.4, 0.4, 0.4)
    for (let i = 0; i < stoneLocation.length; i++) {
      const thisStone = this.stone.model.clone()
      const convertPos = {
        z: stoneLocation[i].centerY / this.property.map.ratio,
        x: (stoneLocation[i].centerX / this.property.map.ratio) - this.property.map.with / this.property.map.ratio / 2
      }
      thisStone.position.z = convertPos.z
      thisStone.position.x = convertPos.x
      thisStone.position.y = 0
      this.add(thisStone)
    }

    // Add particles
    // this.add(this.particles)

    // Set Camera property
    this.webGl.camera.position.set(0, 20, (this.property.map.height + 200 )/this.property.map.ratio)
    this.webGl.controls.enabled = false
    this.webGl.controls.target = new Vector3(0, -5, 0)

    // Listener
    this.listener.on('scroll', ()=>{
      this.property.moveBee.curveTarget += 0.002
    })

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