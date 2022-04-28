import {Group, Vector2, Raycaster, Vector3} from 'three'
import WebGl from '../webglManager'
import Bee from "@/webgl/entities/BlueBee"
import {clone as skeletonClone} from 'three/examples/jsm/utils/SkeletonUtils'
import * as SkeletonUtils from 'three/examples/jsm/utils/SkeletonUtils.js'
import Listener from '../utils/Listener'
import beePositions from '../elementsLocations/hive/beePosition.json'
import {AnimationMixer} from 'three'

let hiveInstance = null

export default class HiveScene extends Group {
  constructor() {
    if (hiveInstance) {
      return (
        hiveInstance
      )
    }

    super()
    hiveInstance = this

    this.webGl = new WebGl()
    this.scene = this.webGl.scene
    this.sizes = this.webGl.sizes
    this.resources = this.webGl.resources
    this.camera = this.webGl.camera
    this.time = this.webGl.time
    this.loader = this.webGl.loader

    this.raycaster = null
    this.currentIntersect = null

    this.beesToPoint = []

    // Wait for resources
    this.resources.on(`sourcesReadyhive`, () => {
      this.setup()
    })
  }

  setUpPointsFromDOM(points) {
    this.points = [
      {
        position: new Vector3(-10, -4, 1),
        rotation: new Vector3(0, Math.random(), 4.5),
        element: points[0],
        id: 0
      },
      {
        position: new Vector3(16, 0, 0),
        rotation: new Vector3(4.5, Math.random(), 0),
        element: points[1],
        id: 1
      },
      {
        position: new Vector3(0, 3.5, 2),
        rotation: new Vector3(4.5, Math.random(), 0),
        element: points[2],
        id: 2
      },
      {
        position: new Vector3(2, -5.5, -2),
        rotation: new Vector3(4.5, Math.random(), 0),
        element: points[3],
        id: 3
      },
      {
        position: new Vector3(-20, -4.5, -2),
        rotation: new Vector3(4.5, Math.random(), 0),
        element: points[4],
        id: 4
      },
      {
        position: new Vector3(2, -2.5, -2),
        rotation: new Vector3(4.5, Math.random(), 0),
        element: points[5],
        id: 5
      },
      {
        position: new Vector3(6, 6.5, 0),
        rotation: new Vector3(4.5, Math.random(), 0),
        element: points[6],
        id: 6
      }
    ]
  }

  setup() {
    this.bee = new Bee()
    this.raycaster = new Raycaster()
    this.hive = this.resources.items.hiveModel.scene
    this.mixers = []

    // Remove fog
    this.scene.fog.density = 0
    
    setTimeout(()=>{
      this.init()
    }, 1000)
  }

  init() {
    // Set parameters of the scene at init
    this.camera.position.set(3, -2, -35)
    this.webGl.controls.target = new Vector3(0, 0, 0)

    // Add hive
    this.add(this.hive)

    // Add bee to point
    for (let i = 0; i < this.points.length; i++) {
      // Skeleton clone instead of usual clone because of rig in model
      const bee = skeletonClone(this.bee.model)
      bee.scale.set(0.13, 0.13, 0.13)
      bee.position.set(this.points[i].position.x, this.points[i].position.y, this.points[i].position.z)
      bee.rotation.set(this.points[i].rotation.x, this.points[i].rotation.y, this.points[i].rotation.z)
      bee.children[2].testId = this.points[i].id

      this.beesToPoint.push(bee)

      this.add(bee)
    }


    // add other bee
    for (let i = 0; i < beePositions.length; i++) {
      const bee = skeletonClone(this.bee.model)
      const mixer = new AnimationMixer(bee)
      mixer.clipAction(this.bee.resource.animations[0]).play()

      // TODO change to begin more beautiful
      bee.position.set(beePositions[i].px, beePositions[i].py, beePositions[i].pz)
      bee.rotation.y = Math.PI
      this.mixers.push(mixer)

      this.add(bee)
    }

    // Listener
    this.listener = new Listener()

    window.addEventListener("click", () => {
      if (this.currentIntersect) {
        console.log('click on model')
      }
    })


    // Remove loader
    setTimeout(() => {
      this.loader.classList.add('loaded')
    }, 500)

  }

  update() {
    if (this.mixers) {
      for (const mixer of this.mixers) mixer.update(this.time.delta * 0.001)
    }

    if (this.points && this.raycaster && this.listener) {
      this.raycaster.setFromCamera(new Vector2(this.listener.property.cursor.x, this.listener.property.cursor.y), this.camera)

      // Objects to test with the raycaster
      this.intersects = this.raycaster.intersectObjects(this.beesToPoint)

      // Place point position
      for (const point of this.points) {
        const screenPosition = point.position.clone()
        screenPosition.project(this.camera)

        const translateX = screenPosition.x * this.sizes.width * 0.5
        const translateY = -screenPosition.y * this.sizes.height * 0.5
        point.element.style.transform = `translateX(${translateX}px) translateY(${translateY}px)`
      }

      // Add visible classe when intersect
      if (this.intersects.length) {
        this.currentIntersect = this.intersects[0]
        if (this.currentIntersect && this.points[this.currentIntersect.object.testId]) {
          this.points[this.currentIntersect.object.testId].element.classList.add('visible')
        }
      } else {
        if (!this.currentIntersect) {
          for (const point of this.points) {
            point.element.classList.remove('visible')
          }

        }
        this.currentIntersect = null
      }
    }
  }

  delete() {
    window.removeEventListener("click", () => {
      if (this.currentIntersect) {
        console.log('click on model')
      }
    })
  }
}