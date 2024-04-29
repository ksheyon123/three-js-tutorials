import * as THREE from "three";
import { useState } from "react";

export const useControl = (scene: THREE.Scene) => {
  const getCoord = (obj: THREE.Mesh) => {
    const coord = obj.position;
    return coord;
  };

  const setCoord = (v: THREE.Vector3, obj: THREE.Mesh) => {
    const curCoord = getCoord(obj);
    const { x, y, z } = curCoord;
    const newCoord = new THREE.Vector3(x, y, z).add(v);

    if (!collisionChk(curCoord, newCoord)) {
      const { x, y, z } = newCoord;
      obj.position.set(x, y, z);
      if (y !== 0) {
        setCoord(new THREE.Vector3(0, -1, 0), obj);
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
    setCoord,
  };
};
