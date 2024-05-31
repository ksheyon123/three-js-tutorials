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
    if (code === "ShiftLeft") {
      objectStateRef.current.isAcc = true;
    }
  };
  const keyUpEventHandler = (e: KeyboardEvent) => {
    const code = e.code;
    console.log(code);
    keyStateRef.current = {
      ...keyStateRef.current,
      [code]: false,
    };

    if (code === "ShiftLeft") {
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

  const move = (forward: THREE.Vector3, curPosition: THREE.Vector3) => {
    accelerate();
    decelerate();
    const copyOfForward = forward.clone();
    const copyOfCurPosition = curPosition.clone();
    console.log(objectStateRef.current.vel);
    const weightedForward = copyOfForward.multiplyScalar(
      objectStateRef.current.vel * hz
    );
    const newPosition = copyOfCurPosition.add(weightedForward);
    return newPosition;
  };

  // // Forward === direction
  // const lookAt = (forward: THREE.Vector3, quaternion: THREE.Quaternion) => {
  //   // Apply the object's quaternion to the forward vector
  //   const direction = forward.clone().applyQuaternion(quaternion);

  //   // Normalize the direction vector (optional, depends on your use case)
  //   const newForward = direction.normalize();
  //   // console.log(newForward.angleTo(forward));
  //   // return newForward.angleTo(forward);
  //   return newForward;
  // };

  const lookAt = (forward: THREE.Vector3, position: THREE.Vector3) => {
    // Calculate a point in the desired direction from the cube's current position
    const targetPosition = new THREE.Vector3().addVectors(position, forward);
    return targetPosition;
  };

  const gravity = (curPosition: THREE.Vector3) => {
    if (objectStateRef.current.isJump) {
      return;
    }
    return curPosition;
  };

  const accelerate = () => {
    if (objectStateRef.current.isAcc) {
      const curVel = objectStateRef.current.vel;
      if (curVel !== vel * 2) {
        console.log("ACC");
        objectStateRef.current.vel += 0.02;
      }
    }
  };

  const decelerate = () => {
    if (!objectStateRef.current.isAcc) {
      const curVel = objectStateRef.current.vel;
      if (curVel !== vel) {
        console.log("DE");
        objectStateRef.current.vel -= 0.02;
      }
    }
  };

  const onTheGround = (obj: THREE.Mesh, target: THREE.Mesh) => {
    const copiedObj = obj.clone();
    const copiedTarget = target.clone();
    const objPosition = copiedObj.position;
    const targetPosition = copiedTarget.position;
    const area = new THREE.Sphere();
    return new THREE.Vector3(0, 0, 0);
  };

  return {
    keyDownEventHandler,
    keyUpEventHandler,
    getQuaternion,
    move,
    lookAt,
  };
};
