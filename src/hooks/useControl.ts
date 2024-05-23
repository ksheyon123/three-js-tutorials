import { InitContext } from "@/contexts/initContext";
import { Key, useContext, useRef, useState } from "react";
import * as THREE from "three";

type Keys = "KeyW" | "KeyS" | "KeyA" | "KeyD" | "Space";

export type KeyPress = {
  [K in Keys]: boolean;
};

export const useControl = (scene: THREE.Scene) => {
  const { radius } = useContext(InitContext);
  const velocity_x = 1; // [m/s]
  const velocity_y = 5; // [m/s]
  const jumpVel = 10; // [m/s]
  const g = 9.8; // [m/s2]

  const animationFrame = 1 / 60; // [60hz]

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
    const vbn = vBefore.normalize();
    const van = vAfter.normalize();
    const quaternion = new THREE.Quaternion();
    quaternion.setFromUnitVectors(
      vbn.multiplyScalar(10),
      van.multiplyScalar(10)
    );
    return quaternion;
  };

  const move = (position: THREE.Vector3, direction: THREE.Vector2) => {
    const { x, y, z } = position;
    const { KeyA, KeyD, KeyS, KeyW } = keyPressRef.current;
    let _direction: THREE.Vector3 = new THREE.Vector3(0, 0, 0);

    if (!KeyA && !KeyD && !KeyS && !KeyW) {
      return position;
    }

    if (KeyA) {
      const dirA = direction
        .rotateAround(new THREE.Vector2(0, 0), Math.PI / 2)
        .negate();
      const newDirection0 = new THREE.Vector3(dirA.x, 0, dirA.y);
      _direction.add(newDirection0);
    }
    if (KeyD) {
      const dirD = direction.rotateAround(new THREE.Vector2(0, 0), Math.PI / 2);
      const newDirection1 = new THREE.Vector3(dirD.x, 0, dirD.y);
      _direction.add(newDirection1);
    }
    if (KeyS) {
      const dirS = direction.negate();
      const newDirection2 = new THREE.Vector3(dirS.x, 0, dirS.y);
      _direction.add(newDirection2);
    }
    if (KeyW) {
      const dirW = direction;
      const newDirection3 = new THREE.Vector3(dirW.x, 0, dirW.y);
      _direction.add(newDirection3);
    }

    const next = new THREE.Vector3(x, y, z).add(
      _direction.multiplyScalar(animationFrame)
    );

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
