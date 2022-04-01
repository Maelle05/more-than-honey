import WebGl from '../webglManager'
import { Group, Vector3, BoxGeometry, MeshBasicMaterial, Mesh, CatmullRomCurve3, Line, BufferGeometry, LineBasicMaterial} from 'three'
import Particules from '../shaders/particulesTest'
import Tree from '../entities/Tree'
import Stone from '../entities/Stone'
import Bee from '../entities/BlueBee'
import stoneLocation from '../elementsLocations/outsideOne/stone.json'
import lysLocation from '../elementsLocations/outsideOne/lys.json'
import beePath from '../elementsLocations/outsideOne/beePath.json'
import Listener from '../utils/Listener'
import { MathUtils } from 'three'

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

    this.property = {
      map: {
        with: 595,
        height: 842,
        ratio : 5,
      },
      mouse: {
        target: new Vector3(), 
        mouseX: null,
        mouseY: null
      },
      moveBee: {
        curveValue: 0.01,
        deltaLookAt: 0.002,
        current: new Vector3(),
        target: new Vector3(),
        speed: 0.001
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

    this.listener = new Listener()

    // CURVE HANDLE
    // extract from .json and change format
    this.initialPoints = []
    for (let i = 0; i < beePath.length; i++) {
      this.initialPoints.push({x: ( beePath[i].x / this.property.map.ratio ) - this.property.map.with / this.property.map.ratio / 2, y: 1, z: beePath[i].y / this.property.map.ratio })
    }
    // create cube for each point of the curve
    this.boxGeometry = new BoxGeometry( 1, 1, 1 )
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

    // Add lys
    this.lys.children[0].scale.set(1, 1, 1)
    for (let i = 0; i < lysLocation.length; i++) {
      const thislys = this.lys.clone()
      const convertPos = {
        z: lysLocation[i].centerY / this.property.map.ratio,
        x: (lysLocation[i].centerX / this.property.map.ratio) - this.property.map.with / this.property.map.ratio / 2
      }
      thislys.position.z = convertPos.z
      thislys.position.x = convertPos.x
      thislys.position.y = 5
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

    // Lisener 
    this.listener.on('scroll', ()=>{
      this.property.moveBee.curveValue += 0.002
    })

  }

  update(){
    if (this.curve) {
      this.property.moveBee.target = this.curve.getPointAt(this.property.moveBee.curveValue)
      this.property.camera.target = this.curve.getPointAt(this.property.moveBee.curveValue + this.property.moveBee.deltaLookAt)

      this.property.moveBee.current.x = MathUtils.damp(this.property.moveBee.current.x, this.property.moveBee.target.x, this.property.moveBee.speed, this.time.delta)
      this.property.moveBee.current.y = MathUtils.damp(this.property.moveBee.current.y, this.property.moveBee.target.y, this.property.moveBee.speed, this.time.delta)
      this.property.moveBee.current.z = MathUtils.damp(this.property.moveBee.current.z, this.property.moveBee.target.z, this.property.moveBee.speed, this.time.delta)
      this.bee.model.position.copy(this.property.moveBee.current)
      this.bee.model.lookAt(this.property.camera.target)

      this.webGl.camera.position.set(this.property.moveBee.current.x, this.property.moveBee.current.y + 2, this.property.moveBee.current.z + 10)
      this.webGl.controls.target = this.property.camera.target
    }
  }

  delete(){
    
  }
}