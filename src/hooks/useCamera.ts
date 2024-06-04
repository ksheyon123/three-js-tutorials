import { useRef } from "react";
import * as THREE from "three";

export const useCamera = () => {
  const thetaRef = useRef<number>(90); // on xz plane
  const piRef = useRef<number>(60); // about y Axis

  const mouseActiveRef = useRef<boolean>(false);

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

  const lookAtDirection = (camera: THREE.PerspectiveCamera) => {
    const lookDirection = new THREE.Vector3();
    camera.getWorldDirection(lookDirection);

    // Calculate the "look at" coordinate some distance D in front of the camera
    const lookAtCoord = lookDirection.add(camera.position).normalize();
    return lookAtCoord;
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

  const moveCamera = (oP: THREE.Vector3) => {
    const r = 10;
    // const { ArrowRight, ArrowLeft, ArrowDown, ArrowUp } = keyPressRef.current;
    const { x, y, z } = oP;

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

  const zoomCamera = (camera: THREE.PerspectiveCamera, zoomIn: boolean) => {
    const minFov = 15;
    const maxFov = 75;
    const zoomSpeed = 0.5;
    if (zoomIn) {
      camera.fov = Math.max(camera.fov - zoomSpeed, minFov);
    } else {
      camera.fov = Math.min(camera.fov + zoomSpeed, maxFov);
    }
    camera.updateProjectionMatrix();
  };

  const handleMouseDownEvent = (e: MouseEvent) => {
    mouseActiveRef.current = true;
  };
  const handleMouseUpEvent = (e: MouseEvent) => {
    mouseActiveRef.current = false;
  };

  const handleMouseMoveEvent = (e: MouseEvent) => {
    if (mouseActiveRef.current) {
      if (e.movementX < 0) {
        thetaRef.current -= 3;
      } else if (e.movementX > 0) {
        thetaRef.current += 3;
      }

      if (e.movementY < 0) {
        piRef.current -= 2;
      } else if (e.movementY > 0) {
        piRef.current += 2;
      }
    }
  };

  return {
    createCamera,
    moveCamera,
    zoomCamera,
    lookAtDirection,
    keyDownCameraEvent,
    keyUpCameraEvent,
    zoomInOutCameraEvent,
    handleMouseDownEvent,
    handleMouseUpEvent,
    handleMouseMoveEvent,
  };
};
