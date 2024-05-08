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
import { useCamera } from "@/hooks/useCamera";

export const Scene: React.FC = () => {
  const { scene, renderer, camera, orbit } = useContext(InitContext);
  const { keyControl, calCoord, calY, drop, onKeyDown, onKeyUp } =
    useControl(scene);
  const { handleCameraPosition } = useCamera();
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

      const obj = createObject({ x: 1, y: 1, z: 1 }, { x: 0, y: 5, z: 0 });
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
    if (isLoaded && myObj && camera && orbit) {
      let { position } = myObj;
      let handleId: any;

      var animate = () => {
        keyPress(keyControl, position);
        if (keyControl.Space) {
          position.y = calY(position).y;
        } else {
          position.y = drop(position).y;
        }
        handleCameraPosition(camera, myObj, orbit);

        handleId = requestAnimationFrame(animate);

        orbit.update();
        renderer.render(scene, camera);
      };
      animate();
      return () => cancelAnimationFrame(handleId);
    }
  }, [isLoaded, keyControl, camera, orbit]);

  useEffect(() => {
    window.addEventListener("keypress", (e: KeyboardEvent) => {
      if (e.code === "Enter") {
        // const obj = createObject({ x: 0, y: 0, z: 0 });
        const size = {};
        const coord = { x: 0, y: 0, z: 0 };
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
      let { x, y, z } = calCoord(position, new THREE.Vector3(1, 0, 0));
      position.x = x;
      position.y = y;
      position.z = z;
    } else if (e.KeyA) {
      let { x, y, z } = calCoord(position, new THREE.Vector3(-1, 0, 0));
      position.x = x;
      position.y = y;
      position.z = z;
    } else if (e.KeyS) {
      let { z } = calCoord(position, new THREE.Vector3(0, 0, 1));
      position.z = z;
    } else if (e.KeyW) {
      let { z } = calCoord(position, new THREE.Vector3(0, 0, -1));
      position.z = z;
    } else if (e.Space) {
      // // if (keyControl.Space) {
      // position.y = calY(position);
      // if (position.y <= 0) {
      //   position.y = 0;
      //   resetVelY();
      //   keyControl["Space"] = false;
      // }
      // // }
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
