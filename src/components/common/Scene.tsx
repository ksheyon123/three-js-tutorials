import React, { RefObject, useEffect, useRef, useState } from "react";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

import * as THREE from "three";
import { useCreate } from "@/hooks/useCreate";
import { useCamera } from "@/hooks/useCamera";
import { useControl } from "@/hooks/useControl";

export const Scene: React.FC = () => {
  const { getCoord, setCoord } = useControl();
  const { meshesRef, createObject, handleObjectLookAt } = useCreate();
  const { createCamera, handleCameraPosition, handleOrbitPosition } =
    useCamera();

  const canvasRef = useRef<HTMLDivElement>();

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
    console.log(obj.uuid);
    scene.add(obj);
    // handleObjectLookAt(obj);

    const camera = createCamera();
    handleCameraPosition(camera, obj);
    const controls = handleOrbitPosition(obj, camera, renderer);
    // controls.update();
    var animate = function () {
      requestAnimationFrame(animate);

      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    window.addEventListener("keypress", (e: KeyboardEvent) => {
      if (e.code === "Space") {
        const obj = createObject({ x: 1, y: 1, z: 1 });
        scene.add(obj);
      }
    });
  }, []);

  useEffect(() => {
    const isSingle = Object.keys(meshesRef.current).length === 1;
    if (isSingle) {
      // window.addEventListener("keypress", (e: KeyboardEvent) => {
      //   if (e.code === "KeyD") {
      //     setCoord(new THREE.Vector3(1, 0, 0), obj);
      //   } else if (e.code === "KeyW") {
      //     setCoord(new THREE.Vector3(0, 0, -1), obj);
      //   } else if (e.code === "KeyA") {
      //     setCoord(new THREE.Vector3(-1, 0, 0), obj);
      //   } else if (e.code === "KeyS") {
      //     setCoord(new THREE.Vector3(0, 0, 1), obj);
      //   }
      // });
    }
  }, [meshesRef.current]);

  return (
    <div
      style={{ width: "100%", height: "100%" }}
      ref={canvasRef as RefObject<HTMLDivElement>}
    />
  );
};
