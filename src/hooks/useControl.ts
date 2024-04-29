import * as THREE from "three";
import { useCallback, useState } from "react";
import { resolve } from "path";

export const useControl = (scene: THREE.Scene) => {
  const getCoord = (obj: THREE.Mesh) => {
    const coord = obj.position;
    return coord;
  };

  const move = (obj: THREE.Mesh, v: THREE.Vector3) => {
    // Move toward on the block
    // Move on the block toward the obstacle

    // Move toward no obstacle
    // Move toward block
    // Jump
    const { x, y, z } = calCoord(obj, v);
    obj.position.set(x, y, z);
  };

  const toTheBottom = (obj: THREE.Mesh) => {
    const { y } = obj.position;
    if (y > 0) {
      //   calCoord(new THREE.Vector3(0, -1, 0), obj);
    }
  };

  const calCoord = (
    obj: THREE.Mesh,
    v: THREE.Vector3,
    iter: number = 3
  ): THREE.Vector3 => {
    const curCoord = getCoord(obj);
    const { x, y, z } = curCoord;
    const newCoord = new THREE.Vector3(x, y, z).add(v);

    if (!collisionChk(curCoord, newCoord)) {
      if (iter === 0) return new THREE.Vector3(0, 0, 0);
      if (newCoord.y === 0) {
        return newCoord;
      }
      const yCoord = calCoord(
        obj,
        new THREE.Vector3(newCoord.x, newCoord.y - 1, newCoord.z),
        iter - 1
      );

      if (yCoord.y === 0) {
        return yCoord;
      }
      //   calCoord(new THREE.Vector3(x, y - 1, z), obj);
      //   obj.position.set(x, y, z);
    } else {
      return curCoord;
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
