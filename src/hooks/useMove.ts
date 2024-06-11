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
  isMoving: boolean;
};

export const useMove = (scene: THREE.Scene) => {
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
    isMoving: false,
  });
  const keyStateRef = useRef<KeyState>({
    KeyW: false,
    KeyS: false,
    KeyD: false,
    KeyA: false,
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
    const newJVel = jVel - g * hz;
    objectStateRef.current.jVel = newJVel;
    return newJVel;
  };

  const getQuaternion = (vBefore: THREE.Vector3, vAfter: THREE.Vector3) => {
    const vbn = vBefore.clone().normalize();
    const van = vAfter.clone().normalize();
    const quaternion = new THREE.Quaternion();
    quaternion.setFromUnitVectors(vbn, van);
    return quaternion;
  };
  const direction = (direction: THREE.Vector3) => {
    let _direction: THREE.Vector3 = new THREE.Vector3(0, 0, 0);
    const { KeyW, KeyS, KeyA, KeyD } = keyStateRef.current;

    if (!KeyW && !KeyS && !KeyA && !KeyD) {
      return null;
    }

    if (KeyW) {
      const copyOfDirection = direction.clone();
      _direction.add(copyOfDirection);
    }
    if (KeyS) {
      const copyOfDirection = direction.clone().negate();
      _direction.add(copyOfDirection);
    }
    if (KeyA) {
      const copyOfDirection = direction.clone();
      const angle = Math.PI / 2; // 90도는 π/2 라디안
      const axis = new THREE.Vector3(0, 1, 0); // Y축

      const quaternion = new THREE.Quaternion();
      quaternion.setFromAxisAngle(axis, angle);

      // 벡터에 쿼터니언을 적용하여 회전
      copyOfDirection.applyQuaternion(quaternion);
      _direction.add(copyOfDirection);
    }
    if (KeyD) {
      const copyOfDirection = direction.clone();

      const angle = -Math.PI / 2; // 90도는 π/2 라디안
      const axis = new THREE.Vector3(0, 1, 0); // Y축

      const quaternion = new THREE.Quaternion();
      quaternion.setFromAxisAngle(axis, angle);

      // 벡터에 쿼터니언을 적용하여 회전
      copyOfDirection.applyQuaternion(quaternion);
      _direction.add(copyOfDirection);
    }
    return _direction;
  };

  const move = (forward: THREE.Vector3, curPosition: THREE.Vector3) => {
    accelerate();
    decelerate();
    const copyOfForward = forward.clone();
    const copyOfCurPosition = curPosition.clone();
    const weightedForward = copyOfForward.multiplyScalar(
      objectStateRef.current.vel * hz
    );
    if (!chkIsCollided(curPosition, forward)) {
      const newPosition = copyOfCurPosition.add(weightedForward);
      return newPosition;
    }
    return curPosition;
  };

  const jump = (position: THREE.Vector3) => {
    const _p = position.clone();
    const vel = calJumpVelocity();
    const newP = new THREE.Vector3(_p.x, _p.y + vel * hz, _p.z);
    const direction = newP.clone().sub(_p);
    if (chkIsCollided(_p, direction)) {
      return position;
    } else {
      return newP;
    }
  };

  const lookAt = (forward: THREE.Vector3, position: THREE.Vector3) => {
    // Calculate a point in the desired direction from the cube's current position
    const copyOfForwar = forward.clone();
    copyOfForwar.y = 0;
    const targetPosition = new THREE.Vector3().addVectors(
      position,
      copyOfForwar.negate()
    );
    return targetPosition;
  };

  const accelerate = () => {
    if (objectStateRef.current.isAcc) {
      const curVel = objectStateRef.current.vel;
      if (curVel <= vel * 3) {
        objectStateRef.current.vel += 0.05;
      }
    }
  };

  const decelerate = () => {
    if (!objectStateRef.current.isAcc) {
      const curVel = objectStateRef.current.vel;
      if (curVel >= vel) {
        objectStateRef.current.vel -= 0.05;
      }
    }
  };

  const chkIsCollided = (position: THREE.Vector3, direction: THREE.Vector3) => {
    // Set the raycaster position and direction
    const raycaster = new THREE.Raycaster();
    raycaster.set(position, direction);

    const objects = scene.children.filter(
      (el) =>
        el.name === "plane" || el.name === "obstacle" || el.name === "enemy"
    );

    // Perform the raycasting
    const intersects = raycaster.intersectObjects(objects);

    // Check if there is an intersection close to the object
    for (let i = 0; i < intersects.length; i++) {
      if (intersects[i].distance <= 0.5) {
        // 점프 중인 경우
        if (objectStateRef.current.isJump) {
          objectStateRef.current.isJump = false;
        }
        // Adjust the distance threshold as needed
        return true;
      }
    }
    return false;
  };

  return {
    keyDownEventHandler,
    keyUpEventHandler,
    getQuaternion,
    move,
    lookAt,
    jump,
    direction,
    chkIsCollided,
  };
};
