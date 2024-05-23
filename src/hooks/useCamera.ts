import { useRef } from "react";
import * as THREE from "three";

export const useCamera = () => {
  const yRadianRef = useRef<number>();
  const xRadianRef = useRef<number>();
  const zRadianRef = useRef<number>();
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

  const moveCamera = (cP: THREE.Vector3, vDirection: THREE.Vector3) => {
    const { ArrowRight, ArrowLeft, ArrowDown, ArrowUp } = keyPressRef.current;
    const { x, y, z } = vDirection;
    if (ArrowRight) {
    }
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
