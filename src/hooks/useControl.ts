import { Key, useRef, useState } from "react";
import * as THREE from "three";

type Keys = "KeyW" | "KeyS" | "KeyA" | "KeyD" | "Space";

export type KeyPress = {
  [K in Keys]: boolean;
};

export const useControl = (scene: THREE.Scene) => {
  const velocity_x = 1; // [m/s]
  const velocity_y = 5; // [m/s]
  const defaultVelocidy = 20;
  const gravity = 9.8; // [m/s2]
  const initialHeight = 0;

  const animationFrame = 1 / 60; // [60hz]

  const velRef = useRef<{ vx: number; vy: number; vz: number; g: number }>({
    vx: 0,
    vy: 0,
    vz: 0,
    g: 0,
  });

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
      velRef.current.vx = defaultVelocidy;
      velRef.current.vy = defaultVelocidy;
      velRef.current.vz = defaultVelocidy;
      velRef.current.g = gravity;
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
    // console.log("next", next);
    if (collisionChk(position, next)) {
      return position;
    } else {
      return next;
    }
  };

  const jump = (position: THREE.Vector3) => {
    const { vx, vy, vz } = getVelocity();
    const newX = position.x + vx * animationFrame;
    const newY = position.y + vy * animationFrame;
    const newZ = position.z + vz * animationFrame;
    const next = new THREE.Vector3(0, 0, 0)
      .sub(new THREE.Vector3(newX, newY, newZ))
      .negate();
    if (!collisionChk(position, next)) {
      return position;
    }
    return next;
  };

  const dropToCenter = (position: THREE.Vector3) => {
    const { x, y, z } = position;
    const { vx, vy, vz } = getVelocity();
    const newX = position.x + vx * animationFrame;
    const newY = position.y + vy * animationFrame;
    const newZ = position.z + vz * animationFrame;
    const next = new THREE.Vector3(0, 0, 0)
      .sub(new THREE.Vector3(x, y, z))
      .normalize()
      .negate()
      .multiplyScalar(newY);

    if (collisionChk(position, next)) {
      return position;
    }

    return next;
  };

  const isOnTheSphere = () => {
    const onlyMesh = scene.children.filter(
      (el) => el.type !== "GridHelper" && el.type !== "AxesHelper"
    );
    const distance = onlyMesh[0].position.distanceTo(onlyMesh[1].position);
    console.log("distance", distance);
    if (distance <= 10.5) {
      initVelocity();
      return true;
    }
    return false;
  };

  const drop = (position: THREE.Vector3) => {
    const { x, y, z } = position;
    const { vx, vy, vz } = getVelocity();
    const newY = position.y + vy * animationFrame;
    // console.log(y, newY);
    const next = new THREE.Vector3(x, newY, z);
    if (collisionChk(position, next)) {
      // resetVelY();
      return new THREE.Vector3(x, y, z);
    }
    return new THREE.Vector3(x, newY, z);
  };

  const getVelocity = () => {
    velRef.current.vx = velRef.current.vx - velRef.current.g * animationFrame;
    velRef.current.vy = velRef.current.vy - velRef.current.g * animationFrame;
    velRef.current.vz = velRef.current.vz - velRef.current.g * animationFrame;
    return velRef.current;
  };

  const initVelocity = () => {
    velRef.current.vx = 0;
    velRef.current.vy = 0;
    velRef.current.vz = 0;
    velRef.current.g = 0;
  };

  // const resetVelY = () => {
  //   velRef.current.vx = 0;
  //   velRef.current.vy = 0;
  //   velRef.current.vz = 0;
  //   setKeyControl((prev) => ({
  //     ...prev,
  //     Space: false,
  //   }));
  // };

  const l = 0.5;
  const collisionChk = (cVec: THREE.Vector3, tVec: THREE.Vector3) => {
    const raycaster = new THREE.Raycaster();
    const direction = new THREE.Vector3().subVectors(tVec, cVec).normalize(); // Direction the ray should go
    const origin = cVec; // Starting point of the ray
    // console.log(origin, direction);
    raycaster.set(origin, direction);
    const onlyMesh = scene.children.filter(
      (el) => el.type !== "GridHelper" && el.type !== "AxesHelper"
    );

    // const longest = Math.sqrt(l * l + Math.pow(Math.sqrt(2) * l, 2));
    const intersects = raycaster.intersectObjects(onlyMesh);
    const distance = intersects[0]?.distance || 0.5;
    const isCollide = Math.floor(distance * 100) / 100 <= 0.5;
    if (intersects.length > 0 && isCollide) {
      // console.log("True");
      initVelocity();
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

    // Test
    jump,
    isOnTheSphere,
    dropToCenter,
  };
};
