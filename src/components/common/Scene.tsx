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

    camera.position.set(0, 0, 10);

    var geometry = new THREE.ConeGeometry(0.5, 1.5, 32);
    var material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    var cone = new THREE.Mesh(geometry, material);

    scene.add(cone);

    // Set the position of the cone
    cone.position.set(0, 0, 0);

    cone.matrixAutoUpdate = false;

    const position = new THREE.Vector3(0, 0, 0); // Object coordinate
    cone.matrix.setPosition(position);
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
    cone.matrix.lookAt(eye, target, up);

    // Update the matrix
    cone.matrixWorldNeedsUpdate = true;

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
