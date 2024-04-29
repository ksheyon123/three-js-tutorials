import * as THREE from "three";
import { useCallback, useState } from "react";
import { resolve } from "path";

export const useControl = (scene: THREE.Scene) => {
  const move = (obj: THREE.Mesh, tVec: THREE.Vector3) => {
    // Move toward on the block
    // Move on the block toward the obstacle

    // Move toward no obstacle
    // Move toward block
    // Jump
    const curVec = obj.position;
    const { x, y, z } = calCoord(curVec, tVec);
    obj.position.set(x, y, z);
  };

  const calCoord = (
    cVec: THREE.Vector3,
    tVec: THREE.Vector3,
    iter: number = 3
  ): THREE.Vector3 => {
    const { x, y, z } = cVec;
    const newCoord = new THREE.Vector3(x, y, z).add(tVec);

    if (!collisionChk(cVec, newCoord)) {
      if (iter === 0) return new THREE.Vector3(0, 0, 0);
      if (newCoord.y === 0) {
        console.log("On the ground");
        return newCoord;
      }
      return calCoord(newCoord, new THREE.Vector3(0, -1, 0), iter - 1);
    } else {
      return cVec;
    }
  };

  const collisionChk = (cVec: THREE.Vector3, tVec: THREE.Vector3) => {
    const raycaster = new THREE.Raycaster();
    const direction = new THREE.Vector3().subVectors(tVec, cVec).normalize(); // Direction the ray should go
    const origin = cVec; // Starting point of the ray
    raycaster.set(origin, direction);
    const onlyMesh = scene.children.filter(
      (el) => el.type !== "GridHelper" && el.type !== "AxesHelper"
    );
    console.log(onlyMesh);
    const intersects = raycaster.intersectObjects(onlyMesh);

    if (intersects.length > 0) {
      console.log("Collision detected with", intersects[0].object);
      return true;
    } else {
      console.log("No collision detected.");
      return false;
    }
  };

  return {
    move,
  };
};
