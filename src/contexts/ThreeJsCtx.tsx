import React, { createContext } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

class ThreeJs {
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  renderer: THREE.WebGLRenderer;
  controls: OrbitControls;
  obj: any;

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

    this.obj.position.x = this.coordX;
    this.scene.add(this.obj);

    this.camera.position.z = 10;
  }

  showGrid() {
    const size = 10;
    const divisions = 10;

    const gridHelper = new THREE.GridHelper(size, divisions);
    this.scene.add(gridHelper);
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
