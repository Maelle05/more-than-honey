import {Power0} from 'gsap'
import gsap, {CustomEase, Power1} from 'gsap/all'
import {Group} from 'three'
import BlueBee from '../entities/BlueBee'
import WebGl from '../webglManager'
import Listener from '@/webgl/utils/Listener'
import store from '@/store'

export default class EndingScene extends Group {
  constructor() {
    super()
    this.webGl = new WebGl()
    this.scene = this.webGl.scene
    this.resources = this.webGl.resources
    this.loader = this.webGl.loader

    // Wait for resources
    this.resources.on(`sourcesReadyending`, () => {
      this.setup()
    })
  }

  setup() {
    // 3D models
    this.hive = this.resources.items.hiveModel.scene
    this.bee = new BlueBee()

    // Song
    this.backgroundMusic = this.resources.items.BgMusicSoundHive

    this.init()
  }

  init() {
    // Remove fog
    this.scene.fog.density = 0

    // Set Camera position
    this.webGl.camera.position.set(-15, 0, -40)
    this.webGl.controls.target.set(0, 0, 0)

    // Listener
    this.listener = new Listener()

    // Bee
    this.bee.model.position.set(40, 40, 300)
    this.bee.model.scale.set(0.3, 0.3, 0.3)
    this.bee.model.rotation.x = Math.PI
    this.bee.model.rotation.z = Math.PI

    // add models
    this.add(this.hive, this.bee.model)

    // Init sound
    this.backgroundMusic.sound.fade(0, store.state.isSongOn ? this.backgroundMusic.volume : 0, .3)
    this.backgroundMusic.sound.play()

    setTimeout(() => {
      this.loader.classList.add('loaded')
      this.beeAnim()
    }, 500)
  }

  beeAnim() {
    gsap.to(this.bee.model.position, {
      duration: 7,
      x: 4,
      y: -4,
      z: -10,
      ease: Power1.easeOut,
    }).then(() => {
      this.credits = document.querySelector('.credits')
      this.bgCredits = document.querySelector('.ending')

      gsap.to(this.bgCredits, {
        opacity: 1,
        duration: .3,
      })

      gsap.fromTo(this.credits, {
        y: window.innerHeight * 1.3,
      }, {
        duration: 45,
        y: window.innerHeight - 2200,
        ease: "none",
      })
    })

    gsap.to(this.bee.model.rotation, {
      duration: 2,
      delay: 7,
      y: -Math.PI / 2.5,
      ease: Power1.easeOut,
    })
  }

  update() {
    if (this.bee) {
      this.bee.update()
    }

    if (this.listener) {
      this.webGl.controls.target.set(-this.listener.property.cursor.x * 1.5, this.listener.property.cursor.y * 1.5, 0)
    }

  }

  delete() {

  }
}