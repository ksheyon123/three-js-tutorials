import { PlayerContext } from "@/contexts/PlayerContext";
import { InitContext } from "@/contexts/initContext";
import { useContext, useEffect, useRef } from "react";
import * as THREE from "three";

type EnemyStatus = {
  [key: string]: THREE.Mesh;
};

export const useEnemy = (scene: THREE.Scene) => {
  const { enemyWorker } = useContext(InitContext);
  const { increasePoint, reduceLife } = useContext(PlayerContext);
  const hz = 1 / 60;
  const enemyStatusRef = useRef<EnemyStatus>({});
  const removeRef = useRef<THREE.Object3D[]>([]);

  const getCreateEvent = (e: any) => {
    const { data } = e;
    const { type } = data;
    if (type === "game_start") {
      const { life, speed, point } = data;
      createEnemy(speed, life, point);
    }
  };

  useEffect(() => {
    enemyWorker.addEventListener("message", getCreateEvent);
    return () => enemyWorker.removeEventListener("message", getCreateEvent);
  }, []);

  const createEnemy = (speed: number, life: number, point: number) => {
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
      point,
    };
    enemyStatusRef.current = {
      ...enemyStatusRef.current,
      [enemy.uuid]: enemy,
    };
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

    const objects = scene.children.filter((el) => el.name === "bullet");

    const object = scene.children.find((el) => el.name === "i");

    const movingBox = createBoundingBox(enemy);

    // REDUCE LIFE WHEN THE ENEMY TOUCH THE SHOOTER
    if (object.position.clone().distanceTo(enemy.position) <= 0.2) {
      console.log("BOOOOM!");
      removeRef.current.push(enemy);
      reduceLife();
    }

    // ELIMINATE THE ENEMY WHEN THE BULLET HIT IT
    for (const object of objects) {
      if (object !== enemy) {
        // Don't check against itself
        const objectBox = createBoundingBox(object);
        if (movingBox.intersectsBox(objectBox)) {
          enemy.userData.life = enemy.userData.life - object.userData.damage;
          if (enemy.userData.life <= 0) {
            removeRef.current.push(enemy);
            increasePoint(enemy.userData.point);
          }
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
      if (Object.keys(enemyStatusRef.current).length === 0) {
        enemyWorker.postMessage({
          command: "game_end",
        });
      }
    });
  };

  return {
    getPosition,
    enemyRemove,
    chkEnemyCollided,
  };
};
