import { Key, useRef, useState } from "react";
import * as THREE from "three";

type Keys = "KeyW" | "KeyS" | "KeyA" | "KeyD" | "Space";

export type KeyPress = {
  [K in Keys]: boolean;
};

export const useControl = (scene: THREE.Scene) => {
  const velocity_x = 1; // [m/s]
  const velocity_y = 5; // [m/s]
  const jumpVel = 10;
  const mvVel = 3;
  const g = 9.8; // [m/s2]
  const initialHeight = 0;

  const animationFrame = 1 / 60; // [60hz]

  const velRef = useRef<{ delV: number; g: number }>({
    delV: 0,
    g: 0,
  });

  const keyPressRef = useRef<{
    KeyA: boolean;
    KeyS: boolean;
    KeyD: boolean;
    KeyW: boolean;
  }>({
    KeyA: false,
    KeyS: false,
    KeyD: false,
    KeyW: false,
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
      velRef.current.delV = jumpVel;
      velRef.current.g = g;
    }
    keyPressRef.current = {
      ...keyPressRef.current,
      [key]: true,
    };
    setKeyControl((prev) => ({
      ...prev,
      [key]: true,
    }));
  };

  const onKeyUp = (e: KeyboardEvent) => {
    const key = e.code as Keys;
    if (key !== "Space") {
      keyPressRef.current = {
        ...keyPressRef.current,
        [key]: false,
      };
      setKeyControl((prev) => ({
        ...prev,
        [key]: false,
      }));
    }
  };

  const calCoord = (position: THREE.Vector3, direction: THREE.Vector2) => {
    const { x, y, z } = position;
    const { KeyA, KeyD, KeyS, KeyW } = keyPressRef.current;
    let _direction: THREE.Vector3;
    if (KeyA) {
      const dirA = direction
        .rotateAround(new THREE.Vector2(0, 0), Math.PI / 2)
        .negate();
      _direction = new THREE.Vector3(dirA.x, 0, dirA.y);
    } else if (KeyD) {
      const dirD = direction.rotateAround(new THREE.Vector2(0, 0), Math.PI / 2);
      _direction = new THREE.Vector3(dirD.x, 0, dirD.y);
    } else if (KeyS) {
      const dirS = direction.negate();
      _direction = new THREE.Vector3(dirS.x, 0, dirS.y);
    } else if (KeyW) {
      const dirW = direction;
      _direction = new THREE.Vector3(dirW.x, 0, dirW.y);
    } else {
      return { ...position };
    }
    const next = new THREE.Vector3(x, y, z).add(
      _direction.multiplyScalar(animationFrame)
    );

    // console.log("next", next);
    // if (isOnTheSphere(next)) {
    //   return position;
    // } else {
    return next;
    // }
  };

  const dropToCenter = (position: THREE.Vector3) => {
    const { x, y, z } = position;
    const { delV } = getVelocity();
    const newX = position.x + delV * animationFrame;
    const newY = position.y + delV * animationFrame;
    const newZ = position.z + delV * animationFrame;
    const next = new THREE.Vector3(0, 0, 0)
      .sub(new THREE.Vector3(x, y, z))
      .normalize()
      .negate();
    const newVector = new THREE.Vector3(
      next.x * newX,
      next.y * newY,
      next.z * newZ
    );

    if (!isOnTheSphere(newVector)) {
      console.log(newVector.x, newVector.y, newVector.z);
      return newVector;
    }

    return position;
  };

  const isOnTheSphere = (nextPosition: THREE.Vector3) => {
    const onlyMesh = scene.children.filter(
      (el) => el.type !== "GridHelper" && el.type !== "AxesHelper"
    );
    const distance = nextPosition.distanceTo(onlyMesh[1].position);
    // console.log("distance", distance);
    if (distance < 10.5) {
      initVelocity();
      return true;
    }
    return false;
  };

  const drop = (position: THREE.Vector3) => {
    const { x, y, z } = position;
    const { delV } = getVelocity();
    const newY = position.y + delV * animationFrame;
    // console.log(y, newY);
    const next = new THREE.Vector3(x, newY, z);
    if (collisionChk(position, next)) {
      // resetVelY();
      return new THREE.Vector3(x, y, z);
    }
    return new THREE.Vector3(x, newY, z);
  };

  const getVelocity = () => {
    velRef.current.delV =
      velRef.current.delV - velRef.current.g * animationFrame;
    return velRef.current;
  };

  const initVelocity = () => {
    velRef.current.delV = 0;
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
    const isCollide = Math.floor(distance * 100) / 100 <= 0.4;
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
    isOnTheSphere,
    dropToCenter,
  };
};
