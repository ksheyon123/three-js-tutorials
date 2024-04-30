import * as THREE from "three";
import { useCallback, useState } from "react";
import { resolve } from "path";

export const useControl = (scene: THREE.Scene) => {
  const move = (cVec: THREE.Vector3, tVec: THREE.Vector3) => {
    const coord = calCoord(cVec, tVec);
    return coord;
  };

  const drop = (cVec: THREE.Vector3) => {
    const coord = gravity(cVec);
    if (coord.y > 0) {
      return coord;
    } else if (coord.y <= 0) {
      return new THREE.Vector3(coord.x, 0, coord.z);
    }
  };

  const calCoord = (
    cVec: THREE.Vector3,
    tVec: THREE.Vector3
  ): THREE.Vector3 => {
    const { x, y, z } = cVec;
    const newCoord = new THREE.Vector3(x, y, z).add(tVec);

    if (!collisionChk(cVec, newCoord)) {
      return newCoord;
    } else {
      return cVec;
    }
  };

  const gravity = (cVec: THREE.Vector3): THREE.Vector3 => {
    const { x, y, z } = cVec;
    const g = new THREE.Vector3(0, -1, 0);
    const newCoord = new THREE.Vector3(x, y, z).add(g);

    if (!collisionChk(cVec, newCoord)) {
      if (newCoord.y > 0) {
        return gravity(newCoord);
      } else if (newCoord.y < 0) {
        return new THREE.Vector3(x, 0, z);
      } else {
        return newCoord;
      }
    } else {
      return cVec;
    }
  };

  const collisionChk = (cVec: THREE.Vector3, tVec: THREE.Vector3) => {
    const raycaster = new THREE.Raycaster();
    const direction = new THREE.Vector3().subVectors(tVec, cVec).normalize(); // Direction the ray should go
    console.log("direction", direction);
    const origin = cVec; // Starting point of the ray
    raycaster.set(origin, direction);
    const onlyMesh = scene.children.filter(
      (el) => el.type !== "GridHelper" && el.type !== "AxesHelper"
    );
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
    drop,
  };
};