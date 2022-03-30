import WebGl from '../webglManager';
// import { Flow } from './jsm/modifiers/CurveModifier.js';

import { Group, Vector3, BoxGeometry, MeshBasicMaterial, Mesh, CatmullRomCurve3, Line, BufferGeometry, LineBasicMaterial} from 'three';
import Particules from '../shaders/particulesTest';
import Tree from '../entities/Tree';
import Stone from '../entities/Stone';
import stoneLocation from '../elementsLocations/outsideOne/stone.json'
import lysLocation from '../elementsLocations/outsideOne/lys.json'
import beePath from '../elementsLocations/outsideOne/beePath.json'

export default class OutsideOneScene extends Group
{
  constructor(){
    super()
    this.webGl = new WebGl()
    this.scene = this.webGl.scene
    this.renderer = this.webGl.renderer
    this.camera = this.webGl.camera
    this.resources = this.webGl.resources

    this.property = {
      map: {
        with: 595,
        height: 842,
        rasio : 5,
      },
      mouse: {
        target: new Vector3(), 
        mouseX: null,
        mouseY: null
      },
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
    this.particles = new Particules()

    // CURVE HANDLE
    // extract from .json and change format
    this.initialPoints = [];
    for (let i = 0; i < beePath.length; i++) {
      this.initialPoints.push({x: ( beePath[i].x / this.property.map.rasio ) - this.property.map.with / this.property.map.rasio / 2, y: 1, z: beePath[i].y / this.property.map.rasio })
    }
    // create cube for eatch point of the curve
    this.boxGeometry = new BoxGeometry( 1, 1, 1 );
		this.boxMaterial = new MeshBasicMaterial({ color: 'red'});
    this.curveHandles = []
    for ( const handlePos of this.initialPoints ) {
      const handle = new Mesh( this.boxGeometry, this.boxMaterial );
      handle.position.copy( handlePos );
      this.curveHandles.push( handle );
      this.scene.add( handle );
    }
    // Calculate Smooth curve
    this.curve = new CatmullRomCurve3(
      this.curveHandles.map( ( handle ) => handle.position )
    );
    this.curve.curveType = 'centripetal';
    this.curve.closed = false;
    const points = this.curve.getPoints( 50 );
    this.line = new Line(
      new BufferGeometry().setFromPoints( points ),
      new LineBasicMaterial( { color: 0x00ff00 } )
    );

    this.scene.add( this.line );

    this.init()
  }

  init(){
    // Add lys
    this.lys.children[0].scale.set(1, 1, 1)
    for (let i = 0; i < lysLocation.length; i++) {
      const thislys = this.lys.clone()
      const convertPos = {
        z: lysLocation[i].centerY / this.property.map.rasio,
        x: (lysLocation[i].centerX / this.property.map.rasio) - this.property.map.with / this.property.map.rasio / 2
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
        z: stoneLocation[i].centerY / this.property.map.rasio,
        x: (stoneLocation[i].centerX / this.property.map.rasio) - this.property.map.with / this.property.map.rasio / 2
      }
      thisStone.position.z = convertPos.z
      thisStone.position.x = convertPos.x
      thisStone.position.y = 0
      this.add(thisStone)
    }

    // Add particles
    // this.add(this.particles)

    // Set Camera property
    this.webGl.camera.position.set(0, 20, (this.property.map.height )/this.property.map.rasio)
    this.webGl.controls.enabled = false
    this.webGl.controls.target = new Vector3(0, -5, 0);


    // Lisener 
  }

  update(){
    
  }

  delete(){
    
  }
}