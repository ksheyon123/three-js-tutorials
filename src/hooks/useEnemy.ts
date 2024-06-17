import { useEffect, useRef } from "react";
import * as THREE from "three";

import WorkerBuilder from "@/workers/worker-builder";
import Worker from "@/workers/rockOn";

type EnemyStatus = {
  [key: string]: THREE.Mesh;
};

export const useEnemy = (scene: THREE.Scene) => {
  const hz = 1 / 60;
  const enemyStatusRef = useRef<EnemyStatus>({});
  const removeRef = useRef<THREE.Object3D[]>([]);

  const worker = new WorkerBuilder(Worker);

  useEffect(() => {
    let timerId: any;
    timerId = setInterval(() => {
      createEnemy(3, 1);
    }, 1000);
    return () => clearInterval(timerId);
  }, []);

  useEffect(() => {
    let timerId: any;
    timerId = setInterval(() => {
      createEnemy(10, 2);
    }, 3000);
    return () => clearInterval(timerId);
  }, []);

  const createEnemy = (speed: number, life: number) => {
    const deg = Math.random() * 90;
    const x = Math.sin(deg) * 5;
    const y = Math.cos(deg) * 5;
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    // Create a 2D geometry (a plane in this case)
    const geometry = new THREE.PlaneGeometry(0.5, 0.5);
    // Create a mesh
    const enemy = new THREE.Mesh(geometry, material);
    enemy.position.set(x * 5, y * 5, 0);
    enemy.name = "enemy";
    enemy.userData = {
      speed,
      life,
    };
    enemyStatusRef.current = {
      ...enemyStatusRef.current,
      [enemy.uuid]: enemy,
    };
    worker.postMessage({
      key: "update",
      id: enemy.uuid,
    });
    scene.add(enemy);
  };

  const getPosition = (uuid: string) => {
    if (enemyStatusRef.current[uuid]) {
      const curPosition = enemyStatusRef.current[uuid].position.clone();
      const forward = new THREE.Vector3(0, 0, 0).sub(curPosition).normalize();
      const weightedForward = forward.multiplyScalar(
        enemyStatusRef.current[uuid].userData.speed * hz
      );

      const newPosition = curPosition.add(weightedForward);
      return newPosition;
    }
  };

  const chkEnemyCollided = (uuid: string) => {
    const enemy = enemyStatusRef.current[uuid];

    const objects = scene.children.filter(
      (el) => el.name === "bullet" || el.name === "i"
    );

    const movingBox = createBoundingBox(enemy);
    for (const object of objects) {
      if (object !== enemy) {
        // Don't check against itself
        const objectBox = createBoundingBox(object);
        if (movingBox.intersectsBox(objectBox)) {
          removeRef.current.push(enemy);
        }
      }
    }
  };
  const createBoundingBox = (object: THREE.Object3D) => {
    return new THREE.Box3().setFromObject(object);
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
