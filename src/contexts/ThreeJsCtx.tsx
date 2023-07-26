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

  constructor() {
    this.animate = this.animate.bind(this);
  }

  createScene() {
    this.scene = new THREE.Scene();
  }

  createCamera(a: number, b: number, c: number, d: number) {
    this.camera = new THREE.PerspectiveCamera(a, b, c, d);
    this.camera.position.x = -2.5;
    this.camera.position.y = 5;
  }

  cameraCoordinate(x?: number) {
    const copy = {
      ...this.obj.position,
    };
    const cameraOffset = new THREE.Vector3(-2.5, 5, 0);
    console.log(this.obj.position);
    this.camera.position.copy(copy).add(cameraOffset);
    console.log(this.camera.position);
  }

  createRenderer(options: any) {
    this.renderer = new THREE.WebGLRenderer(options);
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  createOrbit() {
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.addEventListener("change", this.render);
    return () => this.controls.removeEventListener("change", this.render);
  }

  createObject(idx?: number) {
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshBasicMaterial({
      color: "0x000000",
      wireframe: true,
    });
    this.obj = new THREE.Mesh(geometry, material);

    this.obj.position.x = this.coord.x;
    this.obj.position.z = this.coord.z;
    this.obj.position.y = this.coord.y + 0.5;
    this.scene.add(this.obj);
  }

  showGrid() {
    const size = 10;
    const divisions = 10;

    if (!this.gridHelper) {
      const gridHelper = new THREE.GridHelper(size, divisions);
      this.scene.add(gridHelper);
      this.gridHelper = gridHelper;
    } else {
      this.scene.remove(this.gridHelper);
      this.gridHelper = null;
    }
    this.render();
  }

  move(key: MoveAction) {
    console.log(key);
    switch (key) {
      case "ArrowUp":
        this.obj.position.x += 0.5;
        this.coord.x += 0.5;
        break;
      case "ArrowLeft":
        this.obj.position.z -= 0.5;
        break;
      case "ArrowDown":
        this.obj.position.x -= 0.5;
        this.coord.x -= 0.5;

        break;
      case "ArrowRight":
        this.obj.position.z += 0.5;

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
