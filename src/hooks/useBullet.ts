import { useEffect, useRef } from "react";
import * as THREE from "three";
import { useCreate } from "./useCreate";
import { useMove } from "./useMove";

type BulletStatus = {
  [key: string]: {
    object: THREE.Object3D;
    forward: THREE.Vector3;
    damage: number;
  };
};

export const useBullet = (scene: THREE.Scene) => {
  const { createObject } = useCreate();
  const { move, chkIsCollided } = useMove(scene);
  const isNormalReady = useRef<boolean>(false);
  const bulletStatusRef = useRef<BulletStatus>({});
  const removeRef = useRef<THREE.Object3D[]>([]);

  useEffect(() => {
    let timerId: any;
    timerId = setInterval(() => {
      isNormalReady.current = true;
    }, 10);
    return () => clearInterval(timerId);
  }, []);

  const bulletMove = (uuid: string) => {
    const missiles = bulletStatusRef.current;
    if (missiles[uuid]) {
      const { forward, object } = missiles[uuid];
      const newPosition = move(forward, object.position);
      return newPosition;
    }
  };

  const chkBulletCollided = (uuid: string) => {
    const missiles = bulletStatusRef.current;
    const { forward, object } = missiles[uuid];
    const curPosition = object.position.clone();
    const raycaster = new THREE.Raycaster();
    raycaster.set(curPosition, forward);

    const objects = scene.children.filter((el) => el.name === "enemy");

    // Perform the raycasting
    const intersects = raycaster.intersectObjects(objects);

    // Check if there is an intersection close to the object
    for (let i = 0; i < intersects.length; i++) {
      if (intersects[i].distance <= 0.5) {
        removeRef.current.push(bulletStatusRef.current[uuid].object);
      }
    }
    return false;
  };

  const bulletRemove = () => {
    removeRef.current.map((el) => {
      el.removeFromParent();
      delete bulletStatusRef.current[el.uuid];
      removeRef.current = [];
    });
  };

  const remove = (uuid: string) => {
    delete bulletStatusRef.current[uuid];
  };

  const createBullet = (position: THREE.Vector3) => {
    if (isNormalReady.current) {
      isNormalReady.current = false;
      const targetPosition = position.clone();
      const forward = targetPosition
        .sub(new THREE.Vector3(0, 0, 0))
        .normalize();
      const bullet = getBullet();
      bulletStatusRef.current = {
        ...bulletStatusRef.current,
        [bullet.uuid]: {
          forward,
          object: bullet,
          damage: 1,
        },
      };
      scene.add(bullet);
    }
  };

  const getBullet = () => {
    const missile = createObject(
      { w: 0.05, h: 0.05, d: 0.05 },
      { x: 0, y: 0, z: 0 },
      "bullet",
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
    createBullet,
    chkBulletCollided,
    bulletMove,
    bulletRemove,
    remove,
  };
};
