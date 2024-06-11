import { useEffect, useRef } from "react";
import * as THREE from "three";
import { useCreate } from "./useCreate";
import { useMove } from "./useMove";

type MissileStatus = {
  [key: string]: {
    object: THREE.Object3D;
    forward: THREE.Vector3;
  };
};

export const useFire = (scene: THREE.Scene) => {
  const { createObject } = useCreate();
  const { move, chkIsCollided } = useMove(scene);
  const isNormalReady = useRef<boolean>(false);
  const missileStatus = useRef<MissileStatus>({});

  useEffect(() => {
    let timerId: any;
    timerId = setInterval(() => {
      isNormalReady.current = true;
    }, 1000);
    return () => clearInterval(timerId);
  }, []);

  const bulletMove = (uuid: string) => {
    const missiles = missileStatus.current;
    const { forward, object } = missiles[uuid];
    const { x, y, z } = move(forward, object.position);
    const isCollided = chkIsCollided(object.position, forward);
    if (isCollided) {
      object.removeFromParent();
      delete missileStatus.current[uuid];
    }
    object.position.set(x, y, z);
  };

  const fireNormalBullet = (position: THREE.Vector3) => {
    if (isNormalReady.current) {
      isNormalReady.current = false;
      const targetPosition = position.clone();
      const forward = targetPosition
        .sub(new THREE.Vector3(0, 0, 0))
        .normalize();
      const missile = getMissile();
      missileStatus.current = {
        ...missileStatus.current,
        [missile.uuid]: {
          forward,
          object: missile,
        },
      };
      scene.add(missile);
    }
  };

  const getMissile = () => {
    const missile = createObject(
      { w: 0.05, h: 0.05, d: 0.05 },
      { x: 0, y: 0, z: 0 },
      "missile",
      [
        new THREE.MeshBasicMaterial({ color: 0xffffff }), // +x 면
        new THREE.MeshBasicMaterial({ color: 0xffffff }), // -x 면
        new THREE.MeshBasicMaterial({ color: 0xffffff }), // +y 면
        new THREE.MeshBasicMaterial({ color: 0xffffff }), // -y 면
        new THREE.MeshBasicMaterial({ color: 0xffffff }), // +z 면
        new THREE.MeshBasicMaterial({ color: 0xffffff }), // -z 면
      ]
    );
    return missile;
  };

  return {
    fireNormalBullet,
    bulletMove,
  };
};
