import {customEaseOpacity} from '@/webgl/utils/CustomEase'
import { Mesh } from 'three'
import { MeshBasicMaterial } from 'three'
import { SphereGeometry } from 'three'
import {randomIntFromInterval} from '@/webgl/utils/RandowBetweenTwo'
import gsap from 'gsap/all'
import { Power0 } from 'gsap'


export default class Pheromone {
  constructor(id, queen, group){
    this.scene = group
    this.initPos = queen.position

    // Fake male around the queen bee
    this.geometry = new SphereGeometry(0.6, 16, 16)
    this.material = new MeshBasicMaterial( {color: '#8A2BE2'})
    this.material.transparent = true 
    this.mesh = new Mesh( this.geometry, this.material )
    const size = randomIntFromInterval(0.05, 0.2, 0.05)
    this.mesh.scale.set(size, size, size)
    this.mesh.name = 'Pheromone' + id

    this.mesh.position.copy(this.initPos)
    this.scene.add(this.mesh)
    this.goTo(this.initPos)

    this.init()
    
  }

  init(){
    gsap.to(this.mesh.material, {
      opacity: 0,
      duration: randomIntFromInterval(1, 3, 0.1),
      ease: customEaseOpacity,
      stagger: {
        each: 0,
        repeat: -1
      },
    })
  }

  updateQueenPos(pos){
    this.initPos = pos
  }

  goTo(){
    gsap.to(this.mesh.position, {
      x: this.initPos.x + randomIntFromInterval(-0.5, 0.5, 0.1),
      y: this.initPos.y + randomIntFromInterval(-0.5, 0.5, 0.1),
      z: this.initPos.z + randomIntFromInterval(-0.5, 0.5, 0.1),
      duration: randomIntFromInterval(0, 2, 0.1),
      ease: Power0.easeNone,
      onComplete: () => {
        this.goTo(this.initPos)
      }
    })
  }
}