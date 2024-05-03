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
  const { keyControl, move, onKeyDown, onKeyUp } = useControl(scene);
  const { meshesRef, createObject, handleObjectLookAt } = useCreate();
  // const obj = Object.values(meshesRef.current)[0];
  const [myObj, setMyObj] = useState<any>({ position: { y: 0, x: 0, z: 0 } });
  // const { createOrbit } = useCamera();
  const canvasRef = useRef<HTMLDivElement>();

  const [isLoaded, setIsLoaded] = useState<boolean>(false);

  useEffect(() => {
    if (scene && renderer && camera) {
      // document.body.appendChild( renderer.domElement );
      // use ref as a mount point of the Three.js scene instead of the document.body
      canvasRef.current && canvasRef.current.appendChild(renderer.domElement);

      const obj = createObject({ x: 1, y: 1, z: 1 }, { x: 0, y: 0, z: 0 });
      setMyObj(obj);
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
    if (isLoaded && myObj) {
      let { position } = myObj;
      // const obj = Object.values(meshesRef.current)[0];
      let handleId: any;
      let vy = 5;
      let h = 0;
      const g = 9.8;
      const ms = 0.0167; // [1/hz]
      var animate = () => {
        // position.y = position.y;

        if (keyControl.Space) {
          h += vy * ms;
          vy = vy - g * ms;
          // h = 0;
          // vy = 0;
          if (h < 0) {
            vy = 0;
            h = 0;
            keyControl["Space"] = false;
          }
          position.y = h;
        }

        if (keyControl.KeyA) {
          position.x -= ms;
        } else if (keyControl.KeyD) {
          position.x += ms;
        }
        handleId = requestAnimationFrame(animate);

        // keyPress(keyControl, position);
        // obj.position.x = x;
        // obj.position.z = z;

        orbit.update();
        renderer.render(scene, camera);
      };
      animate();
      return () => cancelAnimationFrame(handleId);
    }
  }, [isLoaded, keyControl, orbit, myObj.position.y]);

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

  const keyPress = (e: KeyPress, position: THREE.Vector3) => {
    if (e.KeyD) {
      return (position.x += 1);
      // return move(position, new THREE.Vector3(1, 0, 0));
    } else if (e.KeyA) {
      return (position.x -= 1);
    } else if (e.KeyS) {
      return (position.z += 1);
    } else if (e.KeyW) {
      return (position.z -= 1);
    } else {
      return position;
    }
  };

  return (
    <div
      style={{ width: "100%", height: "100%", backgroundColor: "#FFF" }}
      ref={canvasRef as RefObject<HTMLDivElement>}
    />
  );
};
