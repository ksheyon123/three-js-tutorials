import { useRef, useState } from "react";
import * as THREE from "three";

type Size = {
  x?: number;
  y?: number;
  z?: number;
  r?: number;
  w?: number;
  h?: number;
};

type Coord = {
  x?: number;
  y?: number;
  z?: number;
};

export const useCreate = () => {
  const meshesRef = useRef<{ [key: string]: THREE.Mesh }>({});

  const createObject = (size: Size, coord: Coord, type = "box") => {
    let obj: any;
    if (type === "plane") {
      const planeGeo = new THREE.PlaneGeometry(size.x || 30, size.y || 30);
      const planeMat = new THREE.MeshPhongMaterial({
        color: 0x25004d,
        side: THREE.DoubleSide,
      });
      obj = new THREE.Mesh(planeGeo, planeMat);
      obj.name = "plane";
      obj.rotation.x = Math.PI * -0.5; // Rotate plane which is on the x-y plane to the z-x plane
      obj.position.y = -0.5; // Rotate plane which is on the x-y plane to the z-x plane
    } else if (type === "sphere") {
      const geometry = new THREE.SphereGeometry(size.r, size.w, size.h);
      const material = new THREE.MeshBasicMaterial({ color: 0xffff00 });
      const sphere = new THREE.Mesh(geometry, material);
      obj = sphere;
      obj.name = "sphere";
      obj.position.x = 0;
      obj.position.y = 0;
      obj.position.z = 0;
    } else {
      const material = [
        new THREE.MeshBasicMaterial({ color: 0xff0000 }), // +x 면
        new THREE.MeshBasicMaterial({ color: 0xff0000 }), // -x 면
        new THREE.MeshBasicMaterial({ color: 0xff0000 }), // +y 면 (파란색으로 다른 면과 차별화)
        new THREE.MeshBasicMaterial({ color: 0xff0000 }), // -y 면
        new THREE.MeshBasicMaterial({ color: 0xff0000 }), // +z 면
        new THREE.MeshBasicMaterial({ color: 0x0000ff }), // -z 면
      ];
      var geometry = new THREE.BoxGeometry(
        size.x || 1,
        size.y || 1,
        size.z || 1
      );
      obj = new THREE.Mesh(geometry, material);
      obj.position.set(coord.x || 0, coord.y || 0, coord.z || 0);
    }

    meshesRef.current = {
      ...meshesRef.current,
      [obj.uuid]: obj,
    };
    return obj;
  };

  const handleObjectLookAt = (obj: THREE.Mesh) => {
    obj.matrixAutoUpdate = false;

    const position = new THREE.Vector3(0, 0, 0); // Object coordinate
    obj.matrix.setPosition(position);
    const eye = position.clone();
    // Calculate the orientation to look at (1, 0, 1)
    var target = new THREE.Vector3(1, 1, 1);
    var up = new THREE.Vector3(0, 1, 0); // Using the global up vector

    // Calculate direction from position to target
    var direction = new THREE.Vector3()
      .subVectors(target, position)
      .normalize();

    // Calculate new up vector that is orthogonal to the direction
    var right = new THREE.Vector3().crossVectors(direction, up).normalize();
    var correctedUp = new THREE.Vector3()
      .crossVectors(right, direction)
      .normalize();

    // Apply lookAt matrix using manual calculation
    obj.matrix.lookAt(eye, target, up);

    // Update the matrix
    obj.matrixWorldNeedsUpdate = true;
  };

  return {
    meshesRef,
    createObject,
    handleObjectLookAt,
  };
};
