import {BoxGeometry, Mesh, MeshBasicMaterial} from 'three'
import {randomIntFromInterval} from '@/webgl/utils/RandowBetweenTwo'
import gsap from 'gsap'

export default class Butterflie {
  constructor(group, posDaisy, id){
    this.scene = group
    this.posDaisy = posDaisy

    // Model
    this.geometry = new BoxGeometry( 1, 1, 1 )
    this.material = new MeshBasicMaterial( {color: 0x00ff00} )
    this.mesh = new Mesh( this.geometry, this.material )
    const size = randomIntFromInterval(0.2, 0.4, 0.05)
    this.mesh.scale.set(size, size, size)
    this.mesh.name = 'BOT' + id

    // GET is Target points
    this.targetStep = 0
    this.targetPoints = []
    for (let i = 0; i < 4; i++) {
      if(!this.targetPoints.length){
        this.targetPoints.push(randomIntFromInterval(6, this.posDaisy.length - 8, 1))
      } else {
        this.targetPoints.push(randomIntFromInterval(this.targetPoints[0] - 6 , this.targetPoints[0] + 8 , 1))
      }
    }

    // Init pos
    this.mesh.position.set(this.posDaisy[this.targetPoints[this.targetPoints.length-1]].x, this.posDaisy[this.targetPoints[this.targetPoints.length-1]].y + 1, this.posDaisy[this.targetPoints[this.targetPoints.length-1]].z)
    this.scene.add( this.mesh )

    setTimeout(()=>{
      this.goToTarget()
    }, randomIntFromInterval(0, 2000, 1) )

  }

  goToTarget(){
    gsap.to(this.mesh.position, {
      duration: 10,
      x: this.posDaisy[this.targetPoints[this.targetStep]].x,
      z: this.posDaisy[this.targetPoints[this.targetStep]].z,
      ease: "none",
    }).then(()=> {
      this.targetStep < this.targetPoints.length - 1 ? this.targetStep++ : this.targetStep = 0
      setTimeout(()=>{
        this.goToTarget()
      }, 2000)

    })
  }
}