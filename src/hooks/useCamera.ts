import { useRef } from "react";
import * as THREE from "three";

export const useCamera = () => {
  const thetaRef = useRef<number>(90); // on xz plane
  const piRef = useRef<number>(60); // about y Axis

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

  const zoomRef = useRef<number>();

  const keyDownCameraEvent = (e: KeyboardEvent) => {
    const key = e.code;
    keyPressRef.current = {
      ...keyPressRef.current,
      [key]: true,
    };
  };

  const keyUpCameraEvent = (e: KeyboardEvent) => {
    const key = e.code;
    keyPressRef.current = {
      ...keyPressRef.current,
      [key]: false,
    };
  };

  const zoomInOutCameraEvent = (e: any) => {
    zoomRef.current = e.wheelDelta;
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

  const moveCamera = (oP: THREE.Vector3, cP: THREE.Vector3) => {
    const r = 10;
    const { ArrowRight, ArrowLeft, ArrowDown, ArrowUp } = keyPressRef.current;
    const { x, y, z } = oP;

    if (ArrowRight) {
      thetaRef.current = thetaRef.current - 1;
    } else if (ArrowLeft) {
      thetaRef.current = thetaRef.current + 1;
    } else if (ArrowUp) {
      piRef.current = piRef.current + 1;
    } else if (ArrowDown) {
      piRef.current = piRef.current - 1;
    }
    const theta = THREE.MathUtils.degToRad(thetaRef.current);
    const phi = THREE.MathUtils.degToRad(piRef.current);
    const direction = new THREE.Vector3(
      Math.cos(phi) * Math.cos(theta), // X 방향
      Math.sin(phi), // Y 방향
      Math.cos(phi) * Math.sin(theta) // Z 방향
    );
    return {
      x: x + r * direction.x,
      y: y + r * direction.y,
      z: z + r * direction.z,
    };
  };

  const zoomInOut = (camera: THREE.PerspectiveCamera) => {
    if (zoomRef.current > 0) {
      camera.zoom = camera.zoom + 1;
    } else {
      camera.zoom = camera.zoom - 1;
    }
    camera.updateMatrixWorld();
  };

  return {
    createCamera,
    moveCamera,
    zoomInOut,
    keyDownCameraEvent,
    keyUpCameraEvent,
    zoomInOutCameraEvent,
  };
};
