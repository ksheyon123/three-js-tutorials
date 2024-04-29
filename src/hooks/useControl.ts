import * as THREE from "three";
import { useCallback, useState } from "react";
import { resolve } from "path";

export const useControl = (scene: THREE.Scene) => {
  const getCoord = (obj: THREE.Mesh) => {
    const coord = obj.position;
    return coord;
  };

  const move = () => {
    // Move toward no obstacle
    // Move toward block
    // Move toward on the block
    // Move on the block toward the obstacle
  };

  const jump = () => {};

  const calCoord = async (v: THREE.Vector3, obj: THREE.Mesh, type = "move") => {
    const curCoord = getCoord(obj);
    const { x, y, z } = curCoord;
    const newCoord = new THREE.Vector3(x, y, z).add(v);
    if (!collisionChk(curCoord, newCoord)) {
      let { x, y, z } = newCoord;

      if (type === "move") {
        if (y > 0) {
          calCoord(new THREE.Vector3(x, y - 1, z), obj);
        } else if (y === 0) {
          obj.position.set(x, y, z);
        }
      }

      if (type === "jump") {
        obj.position.set(x, y, z);
      }
    }
  };

  const collisionChk = (cVec: THREE.Vector3, tVec: THREE.Vector3) => {
    const raycaster = new THREE.Raycaster();
    const direction = new THREE.Vector3().subVectors(tVec, cVec).normalize(); // Direction the ray should go
    const origin = cVec; // Starting point of the ray

    raycaster.set(origin, direction);

    const intersects = raycaster.intersectObjects(scene.children);

    if (intersects.length > 0) {
      console.log("Collision detected with", intersects[0].object);
      return true;
    } else {
      console.log("No collision detected.");
      return false;
    }
  };

  return {
    calCoord,
  };
};
