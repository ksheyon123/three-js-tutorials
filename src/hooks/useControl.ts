import { InitContext } from "@/contexts/initContext";
import { Key, useContext, useRef, useState } from "react";
import * as THREE from "three";

type Keys = "KeyW" | "KeyS" | "KeyA" | "KeyD" | "Space";

export type KeyPress = {
  [K in Keys]: boolean;
};

export const useControl = (scene: THREE.Scene) => {
  const radius = 10;
  const velocity_x = 1; // [m/s]
  const velocity_y = 5; // [m/s]
  const jumpVel = 10; // [m/s]
  const g = 9.8; // [m/s2]

  const animationFrame = 1 / 60; // [60hz]

  const directionRef = useRef<THREE.Vector3>(new THREE.Vector3(0, 0, 0));
  const velRef = useRef<{ delV: number; g: number }>({
    delV: 0,
    g,
  });

  const keyPressRef = useRef<{
    KeyA: boolean;
    KeyS: boolean;
    KeyD: boolean;
    KeyW: boolean;
    Space: boolean;
  }>({
    KeyA: false,
    KeyS: false,
    KeyD: false,
    KeyW: false,
    Space: false,
  });

  const keyDownObject = (e: KeyboardEvent) => {
    const key = e.code as Keys;
    if (key === "Space") {
      velRef.current.delV = jumpVel;
      velRef.current.g = g;
    }
    keyPressRef.current = {
      ...keyPressRef.current,
      [key]: true,
    };
  };

  const keyUpObject = (e: KeyboardEvent) => {
    const key = e.code as Keys;
    if (key !== "Space") {
      keyPressRef.current = {
        ...keyPressRef.current,
        [key]: false,
      };
    }
  };

  const rotate = (vBefore: THREE.Vector3, vAfter: THREE.Vector3) => {
    const vbn = vBefore.clone().normalize();
    const van = vAfter.clone().normalize();
    const quaternion = new THREE.Quaternion();
    quaternion.setFromUnitVectors(vbn, van);
    return quaternion;
  };

  const move = (position: THREE.Vector3) => {
    const { x, y, z } = position;
    const { KeyA, KeyD, KeyS, KeyW } = keyPressRef.current;
    // 1 이라는 Scalar 값을 분해
    let _direction: THREE.Vector3 = new THREE.Vector3(0, 0, 0);
    if (!KeyA && !KeyD && !KeyS && !KeyW) {
      return position;
    }

    const theta = Math.asin(y / 10.5);
    const phi = Math.atan2(z, x);

    if (KeyA) {
      const newDirection0 = new THREE.Vector3(-1, 0, 0);
      _direction.add(newDirection0);
    }
    if (KeyD) {
      const newDirection1 = new THREE.Vector3(1, 0, 0);
      _direction.add(newDirection1);
    }
    if (KeyS) {
      const newDirection2 = new THREE.Vector3(0, 0, 1);
      _direction.add(newDirection2);
    }
    if (KeyW) {
      const newDirection3 = new THREE.Vector3(0, 0, -1);
      _direction.add(newDirection3);
    }

    const next = position
      .clone()
      .add(_direction.multiplyScalar(animationFrame));

    return next;
  };

  const dropToCenter = (position: THREE.Vector3) => {
    const { x, y, z } = position;
    const { delV } = getVelocity();
    const jumpDirection = new THREE.Vector3(0, 0, 0)
      .sub(new THREE.Vector3(x, y, z))
      .normalize()
      .negate();
    const d = delV * animationFrame;
    const tempP = new THREE.Vector3(x, y, z);
    const nextCoord = tempP.add(jumpDirection.multiplyScalar(d));
    return isOnTheSphere(position, nextCoord);
    // return nextCoord;
  };

  const isOnTheSphere = (
    curPosition: THREE.Vector3,
    nextPosition: THREE.Vector3
  ) => {
    const onlyMesh = scene.children.filter(
      (el) => el.type !== "GridHelper" && el.type !== "AxesHelper"
    );
    const distance = nextPosition.distanceTo(onlyMesh[0].position);

    if (distance <= radius + 0.5) {
      initVelocity();
      return curPosition;
    } else {
      return nextPosition;
    }
  };

  const getVelocity = () => {
    velRef.current.delV =
      velRef.current.delV - velRef.current.g * animationFrame;
    return velRef.current;
  };

  const initVelocity = () => {
    velRef.current.delV = 0;
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

    // const longest = Math.sqrt(l * l + Math.pow(Math.sqrt(2) * l, 2));
    const intersects = raycaster.intersectObjects(onlyMesh);
    if (intersects.length > 0) {
      return true;
    } else {
      return false;
    }
  };

  return {
    keyDownObject,
    keyUpObject,
    rotate,
    move,
    dropToCenter,
  };
};
