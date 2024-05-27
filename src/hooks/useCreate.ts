import { useRef, useState } from "react";
import * as THREE from "three";

type Sphere = {
  r: number;
  w: number;
  h: number;
};

type Size = {
  x: number;
  y: number;
  z: number;
};

type Coord = {
  x: number;
  y: number;
  z: number;
};

export const useCreate = () => {
  const meshesRef = useRef<{ [key: string]: THREE.Mesh }>({});

  const createPlane = (size: any) => {
    const planeGeo = new THREE.PlaneGeometry(size.x || 30, size.y || 30);
    const planeMat = new THREE.MeshPhongMaterial({
      color: 0x25004d,
      side: THREE.DoubleSide,
    });
    const obj = new THREE.Mesh(planeGeo, planeMat);
    obj.name = "plane";
    obj.rotation.x = Math.PI * -0.5; // Rotate plane which is on the x-y plane to the z-x plane
    obj.position.y = -0.5;
    return obj;
  };

  const createSphere = (size: Sphere) => {
    const geometry = new THREE.SphereGeometry(size.r, size.w, size.h);
    const material = new THREE.MeshBasicMaterial({ color: 0xffff00 });
    const sphere = new THREE.Mesh(geometry, material);
    sphere.name = "sphere";
    sphere.position.x = 0;
    sphere.position.y = 0;
    sphere.position.z = 0;
    return sphere;
  };

  const createObject = (size: Size, coord: Coord, type = "box") => {
    const material = [
      new THREE.MeshBasicMaterial({ color: 0xff0000 }), // +x 면
      new THREE.MeshBasicMaterial({ color: 0xff0000 }), // -x 면
      new THREE.MeshBasicMaterial({ color: 0xff0000 }), // +y 면 (파란색으로 다른 면과 차별화)
      new THREE.MeshBasicMaterial({ color: 0xff0000 }), // -y 면
      new THREE.MeshBasicMaterial({ color: 0xff0000 }), // +z 면
      new THREE.MeshBasicMaterial({ color: 0x0000ff }), // -z 면
    ];
    var geometry = new THREE.BoxGeometry(size.x || 1, size.y || 1, size.z || 1);
    const obj = new THREE.Mesh(geometry, material);
    obj.position.set(coord.x || 0, coord.y || 0, coord.z || 0);

    meshesRef.current = {
      ...meshesRef.current,
      [obj.uuid]: obj,
    };
    return obj;
  };

  return {
    meshesRef,
    createObject,
    createSphere,
    createPlane,
  };
};
