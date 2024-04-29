import React, {
  RefObject,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

import * as THREE from "three";
import { useCreate } from "@/hooks/useCreate";
import { useCamera } from "@/hooks/useCamera";
import { useControl } from "@/hooks/useControl";
import { InitContext } from "@/contexts/initContext";

export const Scene: React.FC = () => {
  const { scene } = useContext(InitContext);
  const { setCoord } = useControl(scene);
  const { meshesRef, createObject, handleObjectLookAt } = useCreate();
  const { createCamera, handleCameraPosition, handleOrbitPosition } =
    useCamera();

  const canvasRef = useRef<HTMLDivElement>();

  useEffect(() => {
    if (scene) {
      var renderer = new THREE.WebGLRenderer();
      renderer.setSize(window.innerWidth, window.innerHeight);
      // document.body.appendChild( renderer.domElement );
      // use ref as a mount point of the Three.js scene instead of the document.body
      canvasRef.current && canvasRef.current.appendChild(renderer.domElement);

      const obj = createObject();
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
        if (e.code === "Enter") {
          const obj = createObject({ x: 1, y: 0, z: 1 });
          scene.add(obj);
        }
      });

      window.addEventListener("keypress", (e: KeyboardEvent) => {
        if (e.code === "KeyD") {
          setCoord(new THREE.Vector3(1, 0, 0), obj);
        } else if (e.code === "KeyW") {
          setCoord(new THREE.Vector3(0, 0, -1), obj);
        } else if (e.code === "KeyA") {
          setCoord(new THREE.Vector3(-1, 0, 0), obj);
        } else if (e.code === "KeyS") {
          setCoord(new THREE.Vector3(0, 0, 1), obj);
        } else if (e.code === "Space") {
          setCoord(new THREE.Vector3(0, 1, 0), obj);
          setTimeout(() => setCoord(new THREE.Vector3(0, -1, 0), obj), 500);
        }
      });
    }
  }, [scene]);

  useEffect(() => {
    const isSingle = Object.keys(meshesRef.current).length === 1;
    if (isSingle) {
    }
  }, [meshesRef.current]);

  return (
    <div
      style={{ width: "100%", height: "100%" }}
      ref={canvasRef as RefObject<HTMLDivElement>}
    />
  );
};
