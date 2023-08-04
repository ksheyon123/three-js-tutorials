import React, { createContext } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

type MoveAction = "w" | "s" | "a" | "d";
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
    this.azimuthDetector = this.azimuthDetector.bind(this);
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
    this.controls.target.set(copy.x, copy.y, copy.z - 0.5);
    this.controls.update();
  }

  createRenderer(options: any) {
    this.renderer = new THREE.WebGLRenderer(options);
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  deltaAngle: number = 0;

  azimuthDetector(e: any) {
    console.log(this.deltaAngle);
    const azimuth = this.controls.getAzimuthalAngle();
    this.deltaAngle = azimuth;
    console.log(this.deltaAngle);

    const angle = Math.PI / 2;
    if (azimuth < -angle || azimuth > angle) {
      this.controls.enableRotate = false;
    } else {
      this.controls.enableRotate = true;
    }
  }

  createOrbit() {
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.addEventListener("change", this.azimuthDetector);
    return () =>
      this.controls.removeEventListener("change", this.azimuthDetector);
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

  createGrid() {
    const size = 10;
    const divisions = 10;
    const gridHelper = new THREE.GridHelper(size, divisions);
    gridHelper.rotateX(1.5078);
    this.scene.add(gridHelper);
    this.gridHelper = gridHelper;
    this.render();
  }

  createRndObj() {
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshBasicMaterial({
      color: "0x000000",
      wireframe: true,
    });
    const rndObj = new THREE.Mesh(geometry, material);

    const pn = Math.random() * 10 > 5 ? -1 : 1;

    rndObj.position.x = pn * Math.floor(Math.random() * 5);
    rndObj.position.z = 0.5;
    rndObj.position.y = pn * Math.floor(Math.random() * 5);
    const uuid = rndObj.uuid;
    this.objKeys.set(uuid, rndObj);
    this.scene.add(rndObj);
  }

  move(key: MoveAction) {
    switch (key) {
      case "w":
        this.obj.position.y += 0.5;
        break;
      case "a":
        this.obj.position.x -= 0.5;
        break;
      case "s":
        this.obj.position.y -= 0.5;
        break;
      case "d":
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
