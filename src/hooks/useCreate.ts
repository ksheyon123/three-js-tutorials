import { useRef, useState } from "react";
import * as THREE from "three";

type Sphere = {
  r: number;
  w: number;
  h: number;
};

export const useCreate = () => {
  const meshesRef = useRef<{ [key: string]: THREE.Mesh }>({});

  const createPlane = () => {
    const planeGeo = new THREE.PlaneGeometry(30, 30);
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

  const createObject = () => {
    const material = [
      new THREE.MeshBasicMaterial({ color: 0xff0000 }), // +x 면
      new THREE.MeshBasicMaterial({ color: 0xff0000 }), // -x 면
      new THREE.MeshBasicMaterial({ color: 0xff0000 }), // +y 면 (파란색으로 다른 면과 차별화)
      new THREE.MeshBasicMaterial({ color: 0xff0000 }), // -y 면
      new THREE.MeshBasicMaterial({ color: 0xff0000 }), // +z 면
      new THREE.MeshBasicMaterial({ color: 0x0000ff }), // -z 면
    ];
    var geometry = new THREE.BoxGeometry(1, 1, 1);
    const obj = new THREE.Mesh(geometry, material);
    obj.position.set(0, 0, 0);

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
