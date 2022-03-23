import {Group, Mesh, MeshBasicMaterial, SphereGeometry, Vector2, Raycaster} from 'three'
import WebGl from '../webglManager'

// to move somewhere else
const mouse = new Vector2()
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
}
let currentIntersect = null

window.addEventListener("mousemove", (e) => {
  mouse.x = (e.clientX / sizes.width) * 2 - 1;
  mouse.y = -(e.clientY / sizes.height) * 2 + 1;

 // console.log(mouse);
})

window.addEventListener("click", () => {
  if(currentIntersect) {
    console.log('clic on element')
  }
})

export default class HiveScene extends Group
{
  constructor(){
    super()
    this.webGl = new WebGl()
    this.scene = this.webGl.scene
    this.resources = this.webGl.resources
    this.camera = this.webGl.camera

    this.raycaster = null

    // Wait for resources
    this.resources.on(`sourcesReadyhive`, () =>
    {
      this.setup()
    })
  }

  setup(){
    // Set Camera position
    // this.webGl.camera.position.set(0, 2.62, -10)
    
    this.object1 = new Mesh(
      new SphereGeometry(0.5, 16, 16),
      new MeshBasicMaterial({ color: "#ff0000" })
    )
    this.object1.position.x = -2;

    this.object2 = new Mesh(
      new SphereGeometry(0.5, 16, 16),
      new MeshBasicMaterial({ color: "#ff0000" })
    )

    this.object3 = new Mesh(
      new SphereGeometry(0.5, 16, 16),
      new MeshBasicMaterial({ color: "#ff0000" })
    );
    this.object3.position.x = 2;

    this.add(this.object1, this.object2, this.object3)

    this.raycaster = new Raycaster()

  }

  update(){
    this.raycaster.setFromCamera(mouse, this.camera)

    const objectsToTest = [this.object1, this.object2, this.object3];

    const intersects = this.raycaster.intersectObjects(objectsToTest); // objects listed
    // console.log(intersects.length);

    for (const object of objectsToTest) {
      object.material.color.set("#ff0000");
    }

    for (const intersect of intersects) {
      intersect.object.material.color.set("#0000ff");
    }

    if(intersects.length) {
      if(!currentIntersect) {
        console.log("mouse enter")
      }
      currentIntersect = intersects[0]
    } else {

      if(currentIntersect) {
        console.log("mouse leave")
      }
      currentIntersect = null
    }
  }

  delete(){
    
  }
}