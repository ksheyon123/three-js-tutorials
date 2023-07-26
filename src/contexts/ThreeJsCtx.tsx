import React, { createContext } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

class ThreeJs {
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  renderer: THREE.WebGLRenderer;
  controls: OrbitControls;
  gridHelper: THREE.GridHelper;
  obj: any;

  hasGrid: boolean;

  coordX: number;
  constructor() {
    this.animate = this.animate.bind(this);
    this.coordX = 0;
  }

  createScene() {
    this.scene = new THREE.Scene();
  }

  createCamera(a: number, b: number, c: number, d: number) {
    this.camera = new THREE.PerspectiveCamera(a, b, c, d);
  }

  createRenderer(options: any) {
    this.renderer = new THREE.WebGLRenderer(options);
  }

  createOrbit() {
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.addEventListener("change", this.render);
  }

  createObject(idx?: number) {
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshBasicMaterial({
      color: "0x000000",
      wireframe: true,
    });
    this.obj = new THREE.Mesh(geometry, material);

    this.obj.position.x = 0;
    this.obj.position.z = 0;
    this.obj.position.y = 0.5;
    this.scene.add(this.obj);
    this.camera.position.z = 10;
  }

  showGrid() {
    const size = 100;
    const divisions = 100;

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

  handleCamera() {
    // this.obj.rotation.x += 0.01;
    // this.obj.rotation.y += 0.01;
    this.camera.position.set(0, 2.5, 2.5); // Set position like this
    this.camera.lookAt(new THREE.Vector3(0, 0, 0));
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
