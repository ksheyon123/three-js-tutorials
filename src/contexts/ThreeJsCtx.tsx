import React, { createContext } from "react";
import * as THREE from "three";

class ThreeJs {
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  renderer: THREE.WebGLRenderer;
  obj: any;

  constructor() {}

  createScene() {
    this.scene = new THREE.Scene();
  }

  createCamera(a: number, b: number, c: number, d: number) {
    this.camera = new THREE.PerspectiveCamera(a, b, c, d);
  }

  createRenderer(options: any) {
    this.renderer = new THREE.WebGLRenderer(options);
  }

  createObject() {
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    const cube = new THREE.Mesh(geometry, material);
    this.obj = {
      ...this.obj,
      geometry: geometry,
      material: material,
      cube: cube,
    };
    this.scene.add(cube);

    this.camera.position.z = 5;
  }

  handleCamera() {
    console.log("HandleCamera");
    console.log(this.obj.cube);
    this.obj.cube.rotation.x += 0.01;
    this.obj.cube.rotation.y += 0.01;
    this.animate();
  }

  animate() {
    requestAnimationFrame(this.animate);
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
