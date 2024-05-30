import { useRef } from "react";
import * as THREE from "three";

type KeyState = {
  [key: string]: boolean;
};

type ObjectState = {
  vel: number;
  g: number;
  jVel: number;
  isJump: boolean;
  isAcc: boolean;
};

export const useMove = () => {
  const hz = 1 / 60;
  const vel = 3;
  const jVel = 5;
  const g = 9.8;
  const objectStateRef = useRef<ObjectState>({
    vel,
    g,
    jVel,
    isJump: false,
    isAcc: false,
  });
  const keyStateRef = useRef<KeyState>({
    W: false,
    S: false,
    D: false,
    A: false,
  });

  const keyDownEventHandler = (e: KeyboardEvent) => {
    const code = e.code;
    keyStateRef.current = {
      ...keyStateRef.current,
      [code]: true,
    };
    if (code === "Space" && !objectStateRef.current.isJump) {
      objectStateRef.current.jVel = jVel;
      objectStateRef.current.g = g;
      objectStateRef.current.isJump = true;
    }
    if (code === "Shift") {
      objectStateRef.current.isAcc = true;
    }
  };
  const keyUpEventHandler = (e: KeyboardEvent) => {
    const code = e.code;
    keyStateRef.current = {
      ...keyStateRef.current,
      [code]: false,
    };

    if (code === "Shift") {
      objectStateRef.current.isAcc = false;
    }
  };

  const calJumpVelocity = () => {
    const { jVel } = objectStateRef.current;
    objectStateRef.current.jVel = jVel - g * hz;
  };

  const getQuaternion = (vBefore: THREE.Vector3, vAfter: THREE.Vector3) => {
    const vbn = vBefore.clone().normalize();
    const van = vAfter.clone().normalize();
    const quaternion = new THREE.Quaternion();
    quaternion.setFromUnitVectors(vbn, van);
    return quaternion;
  };

  const getPosition = (
    curPosition: THREE.Vector3,
    direction: THREE.Vector3
  ) => {};

  const lookAt = () => {};

  const gravity = (curPosition: THREE.Vector3) => {
    if (objectStateRef.current.isJump) {
      return;
    }
    return curPosition;
  };

  const accelerate = () => {
    const curVel = objectStateRef.current.vel;
    if (curVel !== vel * 2) {
      objectStateRef.current.vel += 0.02;
    }
  };

  const onTheGround = () => {};

  return {};
};
