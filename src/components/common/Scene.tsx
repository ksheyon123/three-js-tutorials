import React, {
  RefObject,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

import * as THREE from "three";
import { useCreate } from "@/hooks/useCreate";
import { useCamera } from "@/hooks/useCamera";
import { useControl } from "@/hooks/useControl";
import { InitContext } from "@/contexts/initContext";

export const Scene: React.FC = () => {
  const { scene } = useContext(InitContext);
  const { move, drop } = useControl(scene);
  const { meshesRef, createObject, handleObjectLookAt } = useCreate();
  const { createCamera, handleCameraPosition, handleOrbitPosition } =
    useCamera();

  const canvasRef = useRef<HTMLDivElement>();

  const [isMoving, setIsMoving] = useState<boolean>(false);

  useEffect(() => {
    if (scene) {
      var renderer = new THREE.WebGLRenderer();
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setClearColor(0xffffff);
      // document.body.appendChild( renderer.domElement );
      // use ref as a mount point of the Three.js scene instead of the document.body
      canvasRef.current && canvasRef.current.appendChild(renderer.domElement);

      const obj = createObject({ x: 1, y: 1, z: 1 }, { x: 0, y: 0, z: 0 });
      const plane = createObject(
        { x: 30, y: 30 },
        { x: 0, y: 0, z: 0 },
        "plane"
      );

      scene.add(obj);
      scene.add(plane);
      // handleObjectLookAt(obj);

      const camera = createCamera();
      handleCameraPosition(camera, obj);
      const controls = handleOrbitPosition(camera, renderer);
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
        // const obj = createObject({ x: 0, y: 0, z: 0 });
        const size = {};
        const coord = { x: 1, y: 0, z: 0 };
        const obj = createObject(size, coord);
        scene.add(obj);
      }
    });

    window.addEventListener("keypress", keyPress);
    return () => window.removeEventListener("keypress", keyPress);
  }, [meshesRef.current, isMoving]);

  const keyPress = (e: KeyboardEvent) => {
    const obj = Object.values(meshesRef.current)[0];
    const position = obj.position;
    const key = (e: KeyboardEvent) => {
      switch (e.code) {
        case "KeyD":
          return move(position, new THREE.Vector3(1, 0, 0));
        case "KeyW":
          return move(position, new THREE.Vector3(0, 0, -1));
        case "KeyA":
          return move(position, new THREE.Vector3(-1, 0, 0));
        case "KeyS":
          return move(position, new THREE.Vector3(0, 0, 1));
        case "Space":
          return move(position, new THREE.Vector3(0, 1, 0));
      }
    };
    const v = key(e);

    if (!!v) {
      const { x, y, z } = drop(v);
      obj.position.set(x, y, z);
    }
  };

  return (
    <div
      style={{ width: "100%", height: "100%", backgroundColor: "#FFF" }}
      ref={canvasRef as RefObject<HTMLDivElement>}
    />
  );
};
