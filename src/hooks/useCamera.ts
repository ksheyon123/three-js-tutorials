import { useRef } from "react";
import * as THREE from "three";

export const useCamera = () => {
  const keyPressRef = useRef<{
    ArrowRight: boolean;
    ArrowLeft: boolean;
    ArrowUp: boolean;
    ArrowDown: boolean;
  }>({
    ArrowRight: false,
    ArrowLeft: false,
    ArrowUp: false,
    ArrowDown: false,
  });

  const keyDownCamera = (e: KeyboardEvent) => {
    const key = e.code;
    keyPressRef.current = {
      ...keyPressRef.current,
      [key]: true,
    };
  };

  const keyUpCamera = (e: KeyboardEvent) => {
    const key = e.code;
    keyPressRef.current = {
      ...keyPressRef.current,
      [key]: false,
    };
  };

  const createCamera = () => {
    var camera = new THREE.PerspectiveCamera(
      75, // 카메라 시야각
      window.innerWidth / window.innerHeight, // 카메라 비율
      0.1, // Near
      1000 // Far
    );
    return camera;
  };

  const moveCamera = (camera: THREE.PerspectiveCamera, objP: THREE.Vector3) => {
    const { ArrowRight, ArrowLeft, ArrowDown, ArrowUp } = keyPressRef.current;
    if (ArrowRight) {
      camera.rotateY(-Math.PI / 60);
    }
  };

  return { createCamera, moveCamera, keyDownCamera, keyUpCamera };
};
