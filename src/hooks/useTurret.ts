import { useContext, useEffect, useRef } from "react";
import * as THREE from "three";

import { InitContext } from "@/contexts/initContext";

type BulletStatus = {
  [key: string]: THREE.Object3D;
};

export const useTurret = (scene: THREE.Scene) => {
  const { turretWorker } = useContext(InitContext);
  const bulletStatusRef = useRef<BulletStatus>({});
  const removeRef = useRef<THREE.Object3D[]>([]);

  useEffect(() => {
    turretWorker.onmessage = (e: any) => {
      const { damage, speed, color } = e.data;
      createTurret(damage, speed, color);
    };
  }, [turretWorker]);

  const getNeareast = (): THREE.Object3D => {
    const allEnemies = scene.children.filter((el) => el.name === "enemy");
    let closestObject = null;
    let minDistance = Infinity;

    allEnemies.forEach((obj) => {
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

  const bulletMove = (uuid: string) => {
    const missile = bulletStatusRef.current[uuid];
    if (missile) {
      const curPosition = missile.position.clone();
      const forward = missile.userData.forward.clone().normalize();
      const weightedForward = forward.multiplyScalar(
        missile.userData.speed * (1 / 60)
      );

      const newPosition = curPosition.add(weightedForward);
      return newPosition;
    }
  };

  const chkBulletCollided = (uuid: string) => {
    const missile = bulletStatusRef.current[uuid];
    if (missile) {
      const objects = scene.children.filter(
        (el) => el.name === "enemy" || el.name === "outline"
      );

      const movingBox = createBoundingBox(missile);
      for (const object of objects) {
        if (object !== missile) {
          // Don't check against itself
          const objectBox = createBoundingBox(object);
          if (movingBox.intersectsBox(objectBox)) {
            if (
              object.name === "outline" ||
              (object.name === "enemy" && !missile.userData?.unremovable)
            ) {
              removeRef.current.push(missile);
            }
          }
        }
      }
    }
  };

  const createBoundingBox = (object: THREE.Object3D) => {
    return new THREE.Box3().setFromObject(object);
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

  const rockOn = () => {};

  const createTurret = (
    damage: number,
    speed: number,
    color = 0x000000,
    unremovable?: boolean
  ) => {
    const material = new THREE.MeshBasicMaterial({ color });
    // Create a 2D geometry (a plane in this case)
    const geometry = new THREE.PlaneGeometry(0.1, 0.1);
    // Create a mesh
    const bullet = new THREE.Mesh(geometry, material);
    bullet.name = "bullet";
    const nearestEnemy = getNeareast();

    if (nearestEnemy) {
      // rockOnWorker.postMessage({
      //   key: "rockOn",
      //   data: { uuid: nearestEnemy.uuid },
      // });
      bullet.userData = {
        damage,
        speed,
        unremovable,
        forward: nearestEnemy.position.clone().normalize(),
      };
      bulletStatusRef.current = {
        ...bulletStatusRef.current,
        [bullet.uuid]: bullet,
      };
      scene.add(bullet);
    }
  };

  return {
    createTurret,
    chkBulletCollided,
    bulletMove,
    bulletRemove,
    remove,
  };
};
