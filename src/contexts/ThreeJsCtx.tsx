import React, { createContext } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

type MoveAction = "ArrowUp" | "ArrowLeft" | "ArrowDown" | "ArrowRight";
class ThreeJs {
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  renderer: THREE.WebGLRenderer;
  controls: OrbitControls;
  gridHelper: THREE.GridHelper;
  obj: any;

  hasGrid: boolean;

  coord = {
    x: 0,
    y: 0,
    z: 0,
  };

  objKeys = new Map<string, any>();

  constructor() {
    this.animate = this.animate.bind(this);
    this.cameraCoordinate = this.cameraCoordinate.bind(this);
    this.render = this.render.bind(this);
  }

  createScene() {
    this.scene = new THREE.Scene();
  }

  createCamera(a: number, b: number, c: number, d: number) {
    this.camera = new THREE.PerspectiveCamera(a, b, c, d);
    this.camera.position.z = 5;
    this.camera.position.y = -5;
  }

  cameraCoordinate(x?: number) {
    const copy = {
      ...this.obj.position,
    };
    const cameraOffset = new THREE.Vector3(0, -5, 5);
    this.camera.position.copy(copy).add(cameraOffset);
    this.camera.lookAt(new THREE.Vector3(copy.x, copy.y, copy.z));
    // this.camera.rotation.z = this.angle.z
    // this.camera.rotation.x = this.angle.x;
    // this.camera.rotation.y = this.angle.y;
    // this.camera.rotation.z = this.angle.z;
    // this.controls.object.rotation.x = this.angle.x;
    // this.controls.object.rotation.y = this.angle.y;
    // this.controls.object.rotation.z = this.angle.z;
    // this.controls.object.rotation.set(this.angle.x, this.angle.y, this.angle.z);
    this.controls.target.set(copy.x, copy.y, copy.z);
    this.controls.update();
  }

  createRenderer(options: any) {
    this.renderer = new THREE.WebGLRenderer(options);
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  createOrbit() {
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.addEventListener("change", (e) => {
      const x = this.camera.rotation.x;
      const y = this.camera.rotation.y;
      const z = this.camera.rotation.z;
    });
    return () =>
      this.controls.removeEventListener("change", (e) => {
        console.log(e);
      });
  }

  createObject(idx?: number) {
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshBasicMaterial({
      color: "0x000000",
      wireframe: true,
    });
    this.obj = new THREE.Mesh(geometry, material);

    this.obj.position.x = 0;
    this.obj.position.z = 0.5;
    this.obj.position.y = 0;
    this.objKeys.set("user", this.obj);
    this.scene.add(this.obj);
  }

  showGrid() {
    const size = 10;
    const divisions = 10;

    if (!this.gridHelper) {
      const gridHelper = new THREE.GridHelper(size, divisions);
      gridHelper.rotateX(1.5078);
      this.scene.add(gridHelper);
      this.gridHelper = gridHelper;
    } else {
      this.scene.remove(this.gridHelper);
      this.gridHelper = null;
    }
    this.render();
  }

  createRndObj() {
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshBasicMaterial({
      color: "0x000000",
      wireframe: true,
    });
    const rndObj = new THREE.Mesh(geometry, material);

    rndObj.position.x = Math.floor(Math.random() * 10);
    rndObj.position.z = Math.floor(Math.random() * 10);
    rndObj.position.y = 0.5;
    const uuid = rndObj.uuid;
    this.objKeys.set(uuid, rndObj);
    this.scene.add(rndObj);
  }

  move(key: MoveAction) {
    console.log(key);
    switch (key) {
      case "ArrowUp":
        this.obj.position.y += 0.5;
        break;
      case "ArrowLeft":
        this.obj.position.x -= 0.5;
        break;
      case "ArrowDown":
        this.obj.position.y -= 0.5;

        break;
      case "ArrowRight":
        this.obj.position.x += 0.5;
        break;
      default:
        break;
    }
    this.cameraCoordinate();
    this.animate();
  }

  animate() {
    requestAnimationFrame(this.animate);
    this.render();
  }

  render() {
    this.renderer.render(this.scene, this.camera);
  }

  switctControl() {}
}

export const ThreeJsCtx = createContext<IContextProps>({
  ctx: null,
});

export const ThreeJsCtxProvider = ({ children }: any) => {
  const ctx = new ThreeJs();
  return (
    <ThreeJsCtx.Provider
      value={{
        ctx,
      }}
    >
      {children}
    </ThreeJsCtx.Provider>
  );
};

interface IContextProps {
  ctx: ThreeJs | undefined;
}
