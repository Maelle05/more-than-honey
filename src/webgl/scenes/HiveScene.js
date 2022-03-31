import {Group, Vector2, Raycaster, Vector3} from 'three'
import WebGl from '../webglManager'
import Bee from "@/webgl/entities/BlueBee"

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
    this.resources = this.webGl.resources
    this.camera = this.webGl.camera

    this.raycaster = null
    this.currentIntersect = null

    this.mouse = new Vector2()
    this.sizes = {
      width: window.innerWidth,
      height: window.innerHeight,
    }

    // Wait for resources
    this.resources.on(`sourcesReadyhive`, () => {
      this.setup()
    })
  }

  setUpPoints(points) {
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

    this.object1 = new Bee()
    this.object1.model.position.x = -3
    this.object1.model.position.z = 1
    this.object1.model.rotation.y = Math.PI
    this.object1.model.children[1].testId = 0


    this.object2 = new Bee()
    this.object2.testId = 1


    this.object3 = new Bee()
    this.object3.model.position.x = 2
    this.object3.model.position.y = 1.5
    this.object3.model.position.z = 2
    this.object3.model.children[1].testId = 2

    this.add(this.object1.model, this.object2.model, this.object3.model)

    this.objectsToTest = [this.object1.model, this.object2.model, this.object3.model]

    this.raycaster = new Raycaster()

    this.hive = this.resources.items.hiveModel.scene

    this.init()
  }

  init() {
    // Set Camera position
    this.camera.position.set(0, 4, -40)

    // Add hive
    this.add(this.hive)

    // Add bee
    // for (let i = 0; i < this.points.length; i++) {
    //   const bee = this.bee.model.clone()
    //   console.log(bee, this.points[i].position.x)
    //   bee.position.x = this.points[i].position.x
    //   bee.position.y = this.points[i].position.y
    //   bee.position.z = this.points[i].position.z
    //   bee.children[1].testId = this.points[i].id
    //   this.add(bee)
    // }

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


      this.intersects = this.raycaster.intersectObjects(this.objectsToTest, true) // objects listed

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