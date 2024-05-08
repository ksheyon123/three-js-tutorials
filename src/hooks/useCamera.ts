import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

export const useCamera = () => {
  const createCamera = () => {
    var camera = new THREE.PerspectiveCamera(
      75, // 카메라 시야각
      window.innerWidth / window.innerHeight, // 카메라 비율
      0.1, // Near
      1000 // Far
    );
    return camera;
  };
  const handleCameraPosition = (
    camera: THREE.PerspectiveCamera,
    obj?: THREE.Mesh,
    orbit?: OrbitControls
  ) => {
    if (obj) {
      const { x, y, z } = obj.position.clone();
      orbit.target.set(x, y, z);
    } else {
      camera.position.set(0, 0, 5);
    }
    // camera.matrix.setPosition(position);
  };

  const createOrbit = (
    camera: THREE.PerspectiveCamera,
    renderer: THREE.WebGLRenderer
  ) => {
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.target.set(0, 0, 0);
    return controls;
  };
  return { createCamera, handleCameraPosition, createOrbit };
};
