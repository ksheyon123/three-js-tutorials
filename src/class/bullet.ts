import * as THREE from "three";

class Bullet {
  vel: number;
  damage: number;
  forwardDirection: THREE.Vector2;
  scene: THREE.Scene;
  bullet: THREE.Object3D;
  constructor(props: any) {
    this.scene = props.scene;
  }

  create(props: any) {
    this.vel = props.vel;
    this.damage = props.damage;
    this.forwardDirection = props.forwardDirection;

    const geometry = new THREE.CircleGeometry(0.1, 32);
    const material = new THREE.MeshBasicMaterial({ color: 0xffff00 });
    const circle = new THREE.Mesh(geometry, material);
    this.bullet = circle;
    this.scene.add(circle);
  }

  move() {}

  collide() {
    const movingObject = this.bullet;
    const movingBox = this.createBoundingBox(movingObject);
    for (const object of this.scene.children) {
      if (object !== movingObject) {
        // Don't check against itself
        const objectBox = this.createBoundingBox(object);
        if (movingBox.intersectsBox(objectBox)) {
          return true;
        }
      }
    }
  }

  remove() {
    this.bullet.removeFromParent();
  }

  private createBoundingBox(object: THREE.Object3D) {
    return new THREE.Box3().setFromObject(object);
  }
}
export default Bullet;
