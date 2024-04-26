import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

export const useCamera = () => {
  const createCamera = () => {
    var camera = new THREE.PerspectiveCamera(
      90, // 카메라 시야각
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    return camera;
  };
  const handleCameraPosition = (
    camera: THREE.PerspectiveCamera,
    obj: THREE.Mesh
  ) => {
    camera.position.set(0, 0, 1);

    const coord = obj.position.clone();
    const position = new THREE.Vector3(0, 0, 5);
    // camera.matrix.setPosition(position);
  };
  return { createCamera, handleCameraPosition };
};
