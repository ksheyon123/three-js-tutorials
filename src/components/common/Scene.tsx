import React, { useEffect, useRef } from "react";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

import * as THREE from "three";
import { useCreate } from "@/hooks/useCreate";
import { useCamera } from "@/hooks/useCamera";

export const Scene: React.FC = () => {
  const { createObject, handleObjectLookAt } = useCreate();
  const { createCamera, handleCameraPosition } = useCamera();
  const canvasRef = useRef<any>();

  /**
   * @param scene THREE.Scene which receives projected object.
   * @description Draw grid on the z-x plain
   */
  const drawGridHelper = (scene: THREE.Scene) => {
    const size = 10;
    const divisions = 10;

    const gridHelper = new THREE.GridHelper(size, divisions);
    scene.add(gridHelper);
  };

  /**
   * @param scene THREE.Scene which receives projected object.
   */
  const drawAxisHelper = (scene: THREE.Scene) => {
    const axisHelper = new THREE.AxesHelper();
    scene.add(axisHelper);
  };

  useEffect(() => {
    var scene = new THREE.Scene();
    drawGridHelper(scene);
    drawAxisHelper(scene);

    var renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    // document.body.appendChild( renderer.domElement );
    // use ref as a mount point of the Three.js scene instead of the document.body
    canvasRef.current && canvasRef.current.appendChild(renderer.domElement);

    const obj = createObject();
    scene.add(obj);
    handleObjectLookAt(obj);

    const camera = createCamera();
    handleCameraPosition(camera, obj);
    const controls = new OrbitControls(camera, renderer.domElement);
    // controls.target.set(3, 3, 3);
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
