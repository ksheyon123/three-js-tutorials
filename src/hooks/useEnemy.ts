import { useEffect, useRef } from "react";
import * as THREE from "three";
import { useCreate } from "./useCreate";
import { useMove } from "./useMove";

type EnemyStatus = {
  [key: string]: {
    object: THREE.Object3D;
    speed: number;
    forward?: THREE.Vector3;
  };
};

export const useEnemy = (scene: THREE.Scene) => {
  const { createObject } = useCreate();

  const hz = 1 / 60;
  const enemyStatusRef = useRef<EnemyStatus>({});
  const removeRef = useRef<THREE.Object3D[]>([]);

  useEffect(() => {
    let timerId: any;
    timerId = setInterval(() => {
      const deg = Math.random() * 90;
      const x = Math.sin(deg) * 5;
      const z = Math.cos(deg) * 5;

      const enemy = createObject(
        { w: 0.1, h: 0.1, d: 0.1 },
        { x: x, y: 0, z: z },
        "enemy",
        [
          new THREE.MeshBasicMaterial({ color: 0xfff }), // +x 면
          new THREE.MeshBasicMaterial({ color: 0xfff }), // -x 면
          new THREE.MeshBasicMaterial({ color: 0xfff }), // +y 면
          new THREE.MeshBasicMaterial({ color: 0xfff }), // -y 면
          new THREE.MeshBasicMaterial({ color: 0xfff }), // +z 면
          new THREE.MeshBasicMaterial({ color: 0xfff }), // -z 면
        ]
      );
      enemyStatusRef.current = {
        ...enemyStatusRef.current,
        [enemy.uuid]: {
          object: enemy,
          speed: 3,
        },
      };
      scene.add(enemy);
    }, 1000);
    return () => clearInterval(timerId);
  }, []);

  const getPosition = (uuid: string) => {
    if (enemyStatusRef.current[uuid]) {
      const curPosition = enemyStatusRef.current[uuid].object.position.clone();
      const forward = new THREE.Vector3(0, 0, 0).sub(curPosition).normalize();
      const weightedForward = forward.multiplyScalar(
        enemyStatusRef.current[uuid].speed * hz
      );

      const newPosition = curPosition.add(weightedForward);
      return newPosition;
    }
  };

  const chkEnemyCollided = (uuid: string) => {
    const curPosition = enemyStatusRef.current[uuid].object.position.clone();
    const forward = new THREE.Vector3(0, 0, 0).sub(curPosition).normalize();
    const raycaster = new THREE.Raycaster();
    raycaster.set(curPosition, forward);

    const objects = scene.children.filter((el) => el.name === "bullet");

    // Perform the raycasting
    const intersects = raycaster.intersectObjects(objects);

    // Check if there is an intersection close to the object
    for (let i = 0; i < intersects.length; i++) {
      if (intersects[i].distance <= 0.5) {
        removeRef.current.push(enemyStatusRef.current[uuid].object);
      }
    }
  };
  const enemyRemove = () => {
    removeRef.current.map((el) => {
      el.removeFromParent();
      delete enemyStatusRef.current[el.uuid];
      removeRef.current = [];
    });
  };

  return {
    getPosition,
    enemyRemove,
    chkEnemyCollided,
  };
};
