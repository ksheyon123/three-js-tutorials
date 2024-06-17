import { useEffect, useRef } from "react";
import * as THREE from "three";
import { useCreate } from "./useCreate";
import { useMove } from "./useMove";

type BulletStatus = {
  [key: string]: {
    object: THREE.Object3D;
    forward: THREE.Vector3;
    target: THREE.Object3D;
    damage: number;
    move: Function;
    remove: Function;
    collide: Function;
  };
};

export const useBullet = (scene: THREE.Scene) => {
  const { createObject } = useCreate();
  const { move, chkIsCollided } = useMove(scene);
  const isNormalReady = useRef<boolean>(false);
  const bulletStatusRef = useRef<BulletStatus>({});
  const removeRef = useRef<THREE.Object3D[]>([]);

  const getNeareast = (): THREE.Object3D => {
    const allObjects = scene.children.filter((el) => el.name === "enemy");
    let closestObject = null;
    let minDistance = Infinity;

    allObjects.forEach((obj) => {
      const worldPosition = new THREE.Vector3();
      obj.getWorldPosition(worldPosition);

      const distance = worldPosition.distanceTo(new THREE.Vector3(0, 0, 0));

      if (distance < minDistance) {
        minDistance = distance;
        closestObject = obj;
      }
    });

    return closestObject;
  };

  useEffect(() => {
    let timerId: any;
    timerId = setInterval(() => {
      const obj = getNeareast();
      if (obj) {
        createBullet(obj.position);
      }
    }, 1000);
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
        console.log("Bullet");
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
    const targetPosition = position.clone();
    const forward = targetPosition.sub(new THREE.Vector3(0, 0, 0)).normalize();
    const object = getBullet();
    bulletStatusRef.current = {
      ...bulletStatusRef.current,
      [object.uuid]: {
        forward,
        object,
        damage: 1,
        target: getNeareast(),
        move: () => {},
        remove: () => {},
        collide: () => {},
      },
    };
    scene.add(object);
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
