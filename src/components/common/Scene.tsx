import React, { useEffect, useRef } from "react";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

import * as THREE from "three";

export const Scene: React.FC = () => {
  const canvasRef = useRef<any>();

  useEffect(() => {
    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera(
      90, // 카메라 시야각
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    const axisHelper = new THREE.AxesHelper();
    scene.add(axisHelper);
    var renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    // document.body.appendChild( renderer.domElement );
    // use ref as a mount point of the Three.js scene instead of the document.body
    canvasRef.current && canvasRef.current.appendChild(renderer.domElement);
    var geometry = new THREE.ConeGeometry(0.5, 1.5, 32);
    var material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    var cube = new THREE.Mesh(geometry, material);
    scene.add(cube);
    camera.position.set(0, 0, 5);
    // console.log(camera);

    console.log(camera.quaternion);
    const forward = new THREE.Vector3(0, 0, -10).applyQuaternion(
      camera.quaternion
    );
    console.log(new THREE.Vector3().copy(camera.position).add(forward));
    camera.lookAt(new THREE.Vector3().copy(camera.position).add(forward));
    // For cube
    // cube.matrixAutoUpdate = false;
    // const position = new THREE.Vector3(1, 0, 1);
    // cube.matrix.setPosition(position);
    // const eye = position.clone();
    // const target = new THREE.Vector3(0, 1, 0);
    // const up = new THREE.Vector3(0, 0, 1);
    // cube.matrix.lookAt(eye, target, up);

    // For camera
    // camera.matrixAutoUpdate = false;
    // camera.matrix.setPosition(position);
    // camera.matrix.lookAt(eye, target, up);

    const controls = new OrbitControls(camera, renderer.domElement);
    // controls.update();
    var animate = function () {
      requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };
    animate();
  }, []);
  return <div style={{ width: "100%", height: "100%" }} ref={canvasRef} />;
};
