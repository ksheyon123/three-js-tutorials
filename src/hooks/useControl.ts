import { Key, useRef, useState } from "react";
import * as THREE from "three";

type Keys = "KeyW" | "KeyS" | "KeyA" | "KeyD" | "Space";

export type KeyPress = {
  [K in Keys]: boolean;
};

export const useControl = (scene: THREE.Scene) => {
  const [keyControl, setKeyControl] = useState<KeyPress>({
    KeyA: false,
    KeyS: false,
    KeyD: false,
    KeyW: false,
    Space: false,
  });

  const gravity = 9.8; // [m/s^2]
  const velocity_x = 1; // [m/s]
  const velocity_y = 10;
  const initialHeight = 0;

  const animationFrame = 1 / 60; // [60hz]

  const onKeyDown = (e: KeyboardEvent) => {
    const key = e.code as Keys;
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

  const move = (cVec: THREE.Vector3, tVec: THREE.Vector3) => {
    const coord = calCoord(cVec, tVec);
    return coord;
  };

  const jump = (h: number, velY: number) => {
    return {
      height: h + calVelY(velY) * animationFrame,
      velY: calVelY(velY),
    };
  };

  const calVelY = (velY: number) => {
    return velY - gravity * animationFrame;
  };

  const calCoord = (
    cVec: THREE.Vector3,
    tVec: THREE.Vector3
  ): THREE.Vector3 => {
    const { x, y, z } = cVec;
    const newCoord = new THREE.Vector3(x, y, z).add(
      tVec.multiplyScalar(animationFrame)
    );

    if (!collisionChk(cVec, newCoord)) {
      return newCoord;
    } else {
      return cVec;
    }
  };

  const falling = (cVec: THREE.Vector3): THREE.Vector3 => {
    const { x, y, z } = cVec;
    const g = new THREE.Vector3(0, -1, 0);
    const newCoord = new THREE.Vector3(x, y, z).add(g);

    if (!collisionChk(cVec, newCoord)) {
      if (newCoord.y > 0) {
        return falling(newCoord);
      } else if (newCoord.y < 0) {
        return new THREE.Vector3(x, 0, z);
      } else {
        return newCoord;
      }
    } else {
      return cVec;
    }
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

    if (intersects.length > 0 && intersects[0].distance < 1) {
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
    move,
    // jump,
    jump,
  };
};
