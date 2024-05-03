import { Key, useRef, useState } from "react";
import * as THREE from "three";

type Keys = "KeyW" | "KeyS" | "KeyA" | "KeyD" | "Space";

export type KeyPress = {
  [K in Keys]: boolean;
};

export const useControl = (scene: THREE.Scene) => {
  const gravity = 9.8; // [m/s^2]
  const velocity_x = 1; // [m/s]
  const velocity_y = 5;
  const initialHeight = 0;

  const animationFrame = 1 / 60; // [60hz]

  const vyRef = useRef<{ vy: number }>({ vy: 0 });
  const [keyControl, setKeyControl] = useState<KeyPress>({
    KeyA: false,
    KeyS: false,
    KeyD: false,
    KeyW: false,
    Space: false,
  });

  const onKeyDown = (e: KeyboardEvent) => {
    const key = e.code as Keys;
    if (key === "Space") {
      vyRef.current.vy = velocity_y;
    }
    setKeyControl((prev) => ({
      ...prev,
      [key]: true,
    }));
  };

  const onKeyUp = (e: KeyboardEvent) => {
    const key = e.code as Keys;
    // const keyPress: KeyPress = keyControl;
    if (key !== "Space")
      setKeyControl((prev) => ({
        ...prev,
        [key]: false,
      }));
  };

  const calCoord = (position: THREE.Vector3, direction: THREE.Vector3) => {
    const { x, y, z } = position;
    const next = new THREE.Vector3(x, y, z).add(
      direction.multiplyScalar(animationFrame)
    );
    if (collisionChk(position, next)) {
      return position;
    } else {
      return next;
    }
  };

  const calY = (position: THREE.Vector3) => {
    const vel = calVelY();
    const newH = position.y + vel * animationFrame;
    const tVec = new THREE.Vector3(position.x, newH, position.z);
    if (collisionChk(position, tVec)) {
      resetVelY();
      return new THREE.Vector3(position.x, position.y, position.z);
    }
    return new THREE.Vector3(position.x, newH, position.z);
  };

  const calVelY = () => {
    vyRef.current.vy = vyRef.current.vy - gravity * animationFrame;
    return vyRef.current.vy;
  };

  const resetVelY = () => {
    vyRef.current.vy = 0;
    setKeyControl((prev) => ({
      ...prev,
      Space: false,
    }));
  };

  const collisionChk = (cVec: THREE.Vector3, tVec: THREE.Vector3) => {
    const raycaster = new THREE.Raycaster();
    const direction = new THREE.Vector3().subVectors(tVec, cVec).normalize(); // Direction the ray should go
    const origin = cVec; // Starting point of the ray
    raycaster.set(origin, direction);
    const onlyMesh = scene.children.filter(
      (el) => el.type !== "GridHelper" && el.type !== "AxesHelper"
    );
    const meshes = onlyMesh.splice(1);
    const intersects = raycaster.intersectObjects(meshes);

    if (intersects.length > 0 && intersects[0].distance <= 0.5) {
      console.log("Collision detected with", intersects[0].object);
      return true;
    } else {
      console.log("No collision detected.");
      return false;
    }
  };

  return {
    keyControl,
    onKeyDown,
    onKeyUp,
    calCoord,
    calY,
    calVelY,
    resetVelY,
  };
};
