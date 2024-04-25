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
    var renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    // document.body.appendChild( renderer.domElement );
    // use ref as a mount point of the Three.js scene instead of the document.body
    canvasRef.current && canvasRef.current.appendChild(renderer.domElement);
    var geometry = new THREE.BoxGeometry(1, 1, 1);
    var material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    var cube = new THREE.Mesh(geometry, material);
    scene.add(cube);
    camera.position.z = 20;
    camera.position.x = 10;

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.update();
    var animate = function () {
      requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };
    animate();
  }, []);
  return <div style={{ width: "100%", height: "100%" }} ref={canvasRef} />;
};
