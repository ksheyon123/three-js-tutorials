import { useRef, useState } from "react";
import * as THREE from "three";

type Sphere = {
  r: number;
  w: number;
  h: number;
};

export const useCreate = () => {
  const [meshes, setMeshes] = useState<{ [key: string]: THREE.Mesh }>({});
  // const meshesRef = useRef<{ [key: string]: THREE.Mesh }>({});

  const highlight = (scene: THREE.Scene, obj: THREE.Mesh) => {
    const edges = new THREE.EdgesGeometry(obj.geometry);
    const lineMaterial = new THREE.LineBasicMaterial({ color: 0x000000 }); // Outline color
    const outline = new THREE.LineSegments(edges, lineMaterial);
    scene.add(outline);
  };

  const createPlane = (name = "plane") => {
    const planeGeo = new THREE.PlaneGeometry(60, 60);
    const planeMat = new THREE.MeshPhongMaterial({
      color: 0x25004d,
      side: THREE.DoubleSide,
    });
    const obj = new THREE.Mesh(planeGeo, planeMat);
    obj.name = name;
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

  const createObject = (size?: any, coord?: any, type = "object") => {
    const material = [
      new THREE.MeshBasicMaterial({ color: 0xffd400 }), // +x 면
      new THREE.MeshBasicMaterial({ color: 0xffd400 }), // -x 면
      new THREE.MeshBasicMaterial({ color: 0xffd400 }), // +y 면 (파란색으로 다른 면과 차별화)
      new THREE.MeshBasicMaterial({ color: 0xffd400 }), // -y 면
      new THREE.MeshBasicMaterial({ color: 0xff0000 }), // +z 면
      new THREE.MeshBasicMaterial({ color: 0x0000ff }), // -z 면
    ];
    var geometry = new THREE.BoxGeometry(
      size?.w || 1,
      size?.h || 1,
      size?.d || 1
    );
    const obj = new THREE.Mesh(geometry, material);
    obj.position.set(coord?.x || 0, coord?.y || 0, coord?.z || 0);

    obj.name = type;
    setMeshes((prev) => ({
      ...prev,
      [obj.uuid]: obj,
    }));
    // meshesRef.current = {
    //   ...meshesRef.current,
    //   [obj.uuid]: obj,
    // };
    // console.log(meshesRef.current);
    return obj;
  };

  return {
    meshes,
    createObject,
    createSphere,
    createPlane,
    highlight,
  };
};
