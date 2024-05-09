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
    console.log("next", next);
    if (collisionChk(position, next)) {
      return position;
    } else {
      return next;
    }
  };

  const drop = (position: THREE.Vector3) => {
    const { x, y, z } = position;
    const vel = calVelY();
    const newY = position.y + vel * animationFrame;
    // console.log(y, newY);
    const next = new THREE.Vector3(x, newY, z);
    if (collisionChk(position, next)) {
      // resetVelY();
      return new THREE.Vector3(x, y, z);
    }
    return new THREE.Vector3(x, newY, z);
  };

  const calY = (position: THREE.Vector3) => {
    const { x, y, z } = position;
    const vel = calVelY();
    const newY = position.y + vel * animationFrame;
    const next = new THREE.Vector3(position.x, newY, position.z);
    if (collisionChk(position, next)) {
      resetVelY();
      return new THREE.Vector3(x, y, z);
    }
    return new THREE.Vector3(x, newY, z);
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
    // console.log(origin, direction);
    raycaster.set(origin, direction);
    const onlyMesh = scene.children.filter(
      (el) => el.type !== "GridHelper" && el.type !== "AxesHelper"
    );
    // const meshes = onlyMesh.splice(1);
    // const sphereMesh = meshes.filter((el) => el.name === "sphere");
    const intersects = raycaster.intersectObjects(onlyMesh);

    if (intersects.length > 0) {
      return true;
    } else {
      return false;
    }
  };

  return {
    keyControl,
    onKeyDown,
    onKeyUp,
    calCoord,
    drop,
    calY,
    calVelY,
    resetVelY,
  };
};
