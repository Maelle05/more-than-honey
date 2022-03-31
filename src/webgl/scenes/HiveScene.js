import {Group, Vector2, Raycaster, Vector3} from 'three'
import { clone as skeletonClone } from 'three/examples/jsm/utils/SkeletonUtils'
import WebGl from '../webglManager'
import Bee from "@/webgl/entities/BlueBee"
import beePositions from '../elementsLocations/hive/beePosition.json'

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

    this.raycaster = null
    this.currentIntersect = null

    this.beesToPoint = []

    this.mouse = new Vector2()

    // Wait for resources
    this.resources.on(`sourcesReadyhive`, () => {
      this.setup()
    })
  }

  setUpPointsFromDOM(points) {
    this.points = [
      {
        position: new Vector3(-3, 0, 1),
        element: points[0],
        id: 0
      },
      {
        position: new Vector3(0, 0, 0),
        element: points[1],
        id: 1
      },
      {
        position: new Vector3(2, 1.5, 2),
        element: points[2],
        id: 2
      }
    ]
  }

  setup() {
    this.bee = new Bee()
    this.raycaster = new Raycaster()
    this.hive = this.resources.items.hiveModel.scene

    this.init()
  }

  init() {
    // Set parameters of the scene at init
    this.camera.position.set(1, 4, -30)
    this.webGl.controls.target = new Vector3(0, -5, 0);

    // Add hive
    this.add(this.hive)

    // Add bee to point
    for (let i = 0; i < this.points.length; i++) {
      // skeleton clone instead of usual clone because of rig in model
      const bee = skeletonClone(this.bee.model)
      bee.position.set(this.points[i].position.x, this.points[i].position.y, this.points[i].position.z)
      bee.rotation.y = Math.PI
      bee.children[1].testId = this.points[i].id

      this.beesToPoint.push(bee)
      this.add(bee)
    }

    // add other bee
    for (let i = 0; i < beePositions.length; i++) {
      const bee = skeletonClone(this.bee.model)
      // TODO change to begin more beautiful
      bee.position.set(beePositions[i].px, beePositions[i].py, beePositions[i].pz)
      bee.rotation.y = Math.PI

      this.add(bee)
    }

    // Listener
    window.addEventListener("mousemove", (e) => {
      this.mouse.x = (e.clientX / this.sizes.width) * 2 - 1;
      this.mouse.y = -(e.clientY / this.sizes.height) * 2 + 1;
    })

    window.addEventListener("click", () => {
      if (this.currentIntersect) {
        console.log('click on model')
      }
    })

  }

  update() {
    if (this.points && this.raycaster) {
      this.raycaster.setFromCamera(this.mouse, this.camera)

      // objects to test with the raycaster
      this.intersects = this.raycaster.intersectObjects(this.beesToPoint, true)

      // for (const object of this.objectsToTest) {
      //   object.material.color.set("#C571FF");
      // }
      //
      // for (const intersect of intersects) {
      //   intersect.object.material.color.set("#0000ff");
      // }

      if (this.intersects.length) {
        if (this.currentIntersect) {

          this.points[this.currentIntersect.object.testId].element.classList.add('visible')

          const screenPosition = this.points[this.currentIntersect.object.testId].position.clone()
          screenPosition.project(this.camera)

          const translateX = screenPosition.x * this.sizes.width * 0.5
          const translateY = -screenPosition.y * this.sizes.height * 0.5
          this.points[this.currentIntersect.object.testId].element.style.transform = `translateX(${translateX}px) translateY(${translateY}px)`

        }
        this.currentIntersect = this.intersects[0]
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

    window.removeEventListener("mousemove", (e) => {
      this.mouse.x = (e.clientX / this.sizes.width) * 2 - 1;
      this.mouse.y = -(e.clientY / this.sizes.height) * 2 + 1;
    })
  }
}