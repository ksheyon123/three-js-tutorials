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
  const {
    keyControl,
    calCoord,
    drop,
    onKeyDown,
    onKeyUp,
    //
    dropToCenter,
    isOnTheSphere,
  } = useControl(scene);
  const { handleCameraPosition } = useCamera();
  const { meshesRef, createObject, handleObjectLookAt } = useCreate();
  // const obj = Object.values(meshesRef.current)[0];
  const [myObj, setMyObj] = useState<THREE.Mesh>();
  // const { createOrbit } = useCamera();
  const canvasRef = useRef<HTMLDivElement>();

  const [isLoaded, setIsLoaded] = useState<boolean>(false);

  useEffect(() => {
    if (scene && renderer && camera) {
      // document.body.appendChild( renderer.domElement );
      // use ref as a mount point of the Three.js scene instead of the document.body
      canvasRef.current && canvasRef.current.appendChild(renderer.domElement);

      const obj = createObject(
        { x: 1, y: 1, z: 1 },
        { x: 0, y: 10.5, z: 0 },
        "box"
      );

      // const obj = createObject(
      //   { r: 1, w: 10, h: 10 },
      //   { x: 0, y: 10, z: 0 },
      //   "sphere"
      // );
      setMyObj(obj);
      scene.add(obj);

      // const ground = createObject(
      //   { x: 30, y: 30 },
      //   { x: 0, y: 0, z: 0 },
      //   "plane"
      // );

      const ground = createObject(
        { r: 10, w: 200, h: 200 },
        { x: 0, y: 0, z: 0 },
        "sphere"
      );
      scene.add(ground);
      setIsLoaded(true);
    }
  }, [scene, camera, renderer]);

  useEffect(() => {
    if (isLoaded && myObj && camera && orbit) {
      let { position } = myObj;
      let handleId: any;

      var animate = () => {
        const cP = camera.position;
        const oP = orbit.target;
        const cV2 = new THREE.Vector2(cP.x, cP.z);
        const oV2 = new THREE.Vector2(oP.x, oP.z);
        const direction = oV2.sub(cV2).normalize();

        // const { x, y, z } = keyPress(keyControl, position, direction);
        const { x, y, z } = calCoord(position, direction);
        position.x = x;
        position.y = y;
        position.z = z;

        const toCenter = dropToCenter(position);
        position.x = toCenter.x;
        position.y = toCenter.y;
        position.z = toCenter.z;

        handleCameraPosition(camera, myObj, orbit);

        handleId = requestAnimationFrame(animate);

        orbit.update();
        renderer.render(scene, camera);
      };
      animate();
      return () => cancelAnimationFrame(handleId);
    }
  }, [isLoaded, camera, orbit, myObj]);

  useEffect(() => {
    window.addEventListener("keypress", (e: KeyboardEvent) => {
      if (e.code === "Enter") {
        // const obj = createObject({ x: 0, y: 0, z: 0 });
        // const size = {};
        // const coord = { x: 0, y: 0, z: 0 };
        // const obj = createObject(size, coord);
        // scene.add(obj);
        // const obj = createObject(
        //   { r: 1, w: 10, h: 10 },
        //   { x: 0, y: 10, z: 0 },
        //   "sphere"
        // );
        // setMyObj(obj);
        // scene.add(obj);
      }
    });

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
    };
  }, [meshesRef.current]);

  // const keyPress = (
  //   e: KeyPress,
  //   position: THREE.Vector3,
  //   direction: THREE.Vector2
  // ) => {
  //   if (e.KeyD) {
  //     const dirD = direction.rotateAround(new THREE.Vector2(0, 0), Math.PI / 2);
  //     let { x, y, z } = calCoord(
  //       position,
  //       new THREE.Vector3(dirD.x, 0, dirD.y)
  //     );
  //     return { x, y, z };
  //   } else if (e.KeyA) {
  //     const dirA = direction
  //       .rotateAround(new THREE.Vector2(0, 0), Math.PI / 2)
  //       .negate();
  //     let { x, y, z } = calCoord(
  //       position,
  //       new THREE.Vector3(dirA.x, 0, dirA.y)
  //     );
  //     return { x, y, z };
  //   } else if (e.KeyS) {
  //     const dirS = direction.negate();
  //     let { x, y, z } = calCoord(
  //       position,
  //       new THREE.Vector3(dirS.x, 0, dirS.y)
  //     );
  //     return { x, y, z };
  //   } else if (e.KeyW) {
  //     const dirW = direction;
  //     let { x, y, z } = calCoord(
  //       position,
  //       new THREE.Vector3(dirW.x, 0, dirW.y)
  //     );

  //     return { x, y, z };
  //   } else {
  //     return position;
  //   }
  // };

  return (
    <div
      style={{ width: "100%", height: "100%", backgroundColor: "#FFF" }}
      ref={canvasRef as RefObject<HTMLDivElement>}
    />
  );
};
