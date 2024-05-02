import React, {
  RefObject,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

import * as THREE from "three";
import { useCreate } from "@/hooks/useCreate";
import { useControl, KeyPress } from "@/hooks/useControl";
import { InitContext } from "@/contexts/initContext";

export const Scene: React.FC = () => {
  const { scene, renderer, camera, orbit } = useContext(InitContext);
  const { keyControl, move, drop, onKeyDown, onKeyUp } = useControl(scene);
  const { meshesRef, createObject, handleObjectLookAt } = useCreate();
  // const { createOrbit } = useCamera();
  const canvasRef = useRef<HTMLDivElement>();

  const [isLoaded, setIsLoaded] = useState<boolean>(false);

  useEffect(() => {
    if (scene && renderer && camera) {
      // document.body.appendChild( renderer.domElement );
      // use ref as a mount point of the Three.js scene instead of the document.body
      canvasRef.current && canvasRef.current.appendChild(renderer.domElement);

      const obj = createObject({ x: 1, y: 1, z: 1 }, { x: 0, y: 0, z: 0 });
      scene.add(obj);
      const plane = createObject(
        { x: 30, y: 30 },
        { x: 0, y: 0, z: 0 },
        "plane"
      );
      scene.add(plane);
      setIsLoaded(true);
    }
  }, [scene, camera, renderer]);

  useEffect(() => {
    if (isLoaded) {
      keyPress(keyControl);
      let handleId: any;
      var animate = function () {
        handleId = requestAnimationFrame(animate);
        // keyPress(keyControl);
        orbit.update();
        renderer.render(scene, camera);
      };
      animate();
      return () => cancelAnimationFrame(handleId);
    }
  }, [isLoaded, keyControl, orbit]);

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

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
    };
  }, [meshesRef.current]);

  const keyPress = (e: KeyPress) => {
    const obj = Object.values(meshesRef.current)[0];
    const position = obj.position;
    const key = (e: KeyPress) => {
      if (e.KeyD) {
        return move(position, new THREE.Vector3(1, 0, 0));
      } else if (e.KeyA) {
        return move(position, new THREE.Vector3(-1, 0, 0));
      } else if (e.KeyS) {
        return move(position, new THREE.Vector3(0, 0, 1));
      } else if (e.KeyW) {
        return move(position, new THREE.Vector3(0, 0, -1));
      } else if (e.Space) {
        return move(position, new THREE.Vector3(0, 1, 0));
      }
    };
    const v = key(e);
    if (v) {
      const { x, y, z } = v;
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
