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
  const { calCoord } = useControl(scene);
  const { meshesRef, createObject, handleObjectLookAt } = useCreate();
  const { createCamera, handleCameraPosition, handleOrbitPosition } =
    useCamera();

  const canvasRef = useRef<HTMLDivElement>();

  const [isMoving, setIsMoving] = useState<boolean>(false);

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
    }
  }, [scene]);

  useEffect(() => {
    const isSingle = Object.keys(meshesRef.current).length === 1;
    if (isSingle) {
    }
  }, [meshesRef.current]);

  useEffect(() => {
    window.addEventListener("keypress", (e: KeyboardEvent) => {
      if (e.code === "Enter") {
        const obj = createObject({ x: 1, y: 0, z: 1 });
        scene.add(obj);
      }
    });

    window.addEventListener("keypress", keyPress);
    return () => window.removeEventListener("keypress", keyPress);
  }, [meshesRef.current, isMoving]);

  const keyPress = (e: KeyboardEvent) => {
    const obj = Object.values(meshesRef.current)[0];
    if (e.code === "KeyD") {
      calCoord(new THREE.Vector3(1, 0, 0), obj);
    } else if (e.code === "KeyW") {
      calCoord(new THREE.Vector3(0, 0, -1), obj);
    } else if (e.code === "KeyA") {
      calCoord(new THREE.Vector3(-1, 0, 0), obj);
    } else if (e.code === "KeyS") {
      calCoord(new THREE.Vector3(0, 0, 1), obj);
    } else if (e.code === "Space") {
      calCoord(new THREE.Vector3(0, 1, 0), obj, "jump");
    }
    if (e.code !== "Enter") {
      let timeId: any;
      new Promise(
        (resolve) =>
          (timeId = setTimeout(() => {
            console.log("Timeout");
            calCoord(new THREE.Vector3(0, -1, 0), obj);
            resolve("");
          }, 500))
      ).finally(() => clearTimeout(timeId));
    }
  };

  return (
    <div
      style={{ width: "100%", height: "100%" }}
      ref={canvasRef as RefObject<HTMLDivElement>}
    />
  );
};
