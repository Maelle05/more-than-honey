import {Group, Mesh, MeshBasicMaterial, SphereGeometry, Vector2, Raycaster, Vector3} from 'three'
import WebGl from '../webglManager'

let hiveInstance = null

export default class HiveScene extends Group
{
  constructor(){
    if(hiveInstance) {
      return(
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
    this.resources.on(`sourcesReadyhive`, () =>
    {
      this.setup()
    })
  }

  setUpPoints(points) {
    this.points = [
      {
        position: new Vector3(-3, 0, 1),
        element: points[0]
      },
      {
        position: new Vector3(0, 0, 0),
        element: points[1]
      },
      {
        position: new Vector3(2,  1.5, 2),
        element: points[2]
      }
    ]
  }

  setup(){
    this.object1 = new Mesh(
      new SphereGeometry(0.5, 16, 16),
      new MeshBasicMaterial({ color: "#C571FF" })
    )
    this.object1.position.x = -3;
    this.object1.position.z = 1;
    this.object1.name = 1;

    this.object2 = new Mesh(
      new SphereGeometry(0.5, 16, 16),
      new MeshBasicMaterial({ color: "#C571FF" })
    )
    this.object2.name = 2;

    this.object3 = new Mesh(
      new SphereGeometry(0.5, 16, 16),
      new MeshBasicMaterial({ color: "#C571FF" })
    );
    this.object3.position.x = 2;
    this.object3.position.y = 1.5;
    this.object3.position.z = 2;
    this.object3.name = 3;

    this.add(this.object1, this.object2, this.object3)

    this.raycaster = new Raycaster()


    this.hive = this.resources.items.hiveModel.scene

    console.log(this.hive)
    

    this.init()
  }

  init(){
    // Set Camera position
    this.webGl.camera.position.set(0, 4, -50)

    // Add Hive
    this.add(this.hive)

    // Listener
    window.addEventListener("mousemove", (e) => {
      this.mouse.x = (e.clientX / this.sizes.width) * 2 - 1;
      this.mouse.y = -(e.clientY / this.sizes.height) * 2 + 1;
    })

    window.addEventListener("click", () => {
      if(this.currentIntersect) {
        console.log('click on model')
      }
    })

  }

  update(){
    if(this.points && this.raycaster) {
      for(const point of this.points)
      {
        this.raycaster.setFromCamera(this.mouse, this.camera)

        const screenPosition = point.position.clone()
        screenPosition.project(this.camera)
        const objectsToTest = [this.object1, this.object2, this.object3];

        const intersects = this.raycaster.intersectObjects(objectsToTest); // objects listed

        for (const object of objectsToTest) {
          object.material.color.set("#C571FF");
        }

        for (const intersect of intersects) {
          intersect.object.material.color.set("#0000ff");
        }

        if(intersects.length) {
          if(this.currentIntersect) {

            if(this.currentIntersect && JSON.stringify(this.currentIntersect.object.position) === JSON.stringify(point.position)) {
              point.element.classList.add('visible')
            }

          }
          this.currentIntersect = intersects[0]
        } else {

          if(!this.currentIntersect) {
            point.element.classList.remove('visible')

          }
          this.currentIntersect = null
        }

        const translateX = screenPosition.x * this.sizes.width * 0.5
        const translateY = - screenPosition.y * this.sizes.height * 0.5
        point.element.style.transform = `translateX(${translateX}px) translateY(${translateY}px)`
      }
    }
  }

  delete(){
    window.removeEventListener("click", () => {
      if(this.currentIntersect) {
        console.log('click on model')
      }
    })

    window.removeEventListener("mousemove", (e) => {
      this.mouse.x = (e.clientX / this.sizes.width) * 2 - 1;
      this.mouse.y = -(e.clientY / this.sizes.height) * 2 + 1;
    })
  }
}