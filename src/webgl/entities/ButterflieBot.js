import {BoxGeometry, Mesh, MeshBasicMaterial} from 'three'
import {randomIntFromInterval} from '@/webgl/utils/RandowBetweenTwo'
import {clone as skeletonClone} from 'three/examples/jsm/utils/SkeletonUtils'
import gsap from 'gsap'
import Resources from '../utils/Resources'
import { AnimationMixer } from 'three'
import Time from '../utils/Time'

export default class Butterflie {
  constructor(group, posDaisy, id){
    this.scene = group
    this.posDaisy = posDaisy

    this.resources = new Resources()
    this.time = new Time()

    // Model
    this.annim = this.resources.items.butterflyModel.animations[0]

    this.mesh = skeletonClone(this.resources.items.butterflyModel.scene)
    const size = randomIntFromInterval(0.9, 1.1, 0.05)
    this.mesh.scale.set(size, size, size)
    this.mesh.name = 'BOT' + id

    this.mixer = new AnimationMixer(this.mesh)
    setTimeout(() => {
      this.mixer.clipAction(this.annim).play()
    }, Math.random() * 10000)
    

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
    this.mesh.lookAt( this.posDaisy[this.targetPoints[this.targetStep]].x, 1, this.posDaisy[this.targetPoints[this.targetStep]].z )
  }

  update(){
    if (this.mixer) {
      this.mixer.update(this.time.delta * 0.003)
    }
  }
}