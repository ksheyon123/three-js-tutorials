import * as THREE from "three";
import { useCreate } from "./useCreate";

export const useControl = (scene: THREE.Scene) => {
  const getCoord = (obj: THREE.Mesh) => {
    const coord = obj.position.clone();
    return coord;
  };

  const setCoord = (vector3: THREE.Vector3, obj: THREE.Mesh) => {
    const curCoord = getCoord(obj);
    const copiedCoord = structuredClone(curCoord);
    const newCoord = new THREE.Vector3(
      copiedCoord.x,
      copiedCoord.y,
      copiedCoord.z
    ).add(vector3);
    if (!collisionChk(curCoord, newCoord)) {
      const { x, y, z } = newCoord;
      obj.position.set(x, y, z);
    }
  };

  const collisionChk = (cVec: THREE.Vector3, tVec: THREE.Vector3) => {
    const raycaster = new THREE.Raycaster();
    const copiedCoord = structuredClone(tVec);
    const newCoord = new THREE.Vector3(
      copiedCoord.x,
      copiedCoord.y,
      copiedCoord.z
    );
    const direction = newCoord.normalize(); // Direction the ray should go
    console.log(direction);
    const origin = cVec; // Starting point of the ray

    console.log(origin);
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
    getCoord,
    setCoord,
  };
};
