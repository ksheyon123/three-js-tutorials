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
  const { scene, renderer, camera, obj } = useContext(InitContext);
  const { move, rotate, keyDownObject, keyUpObject, dropToCenter } =
    useControl(scene);
  const {
    moveCamera,
    zoomInOut,
    keyDownCameraEvent,
    keyUpCameraEvent,
    zoomInOutCameraEvent,
  } = useCamera();
  const { meshesRef, createObject, handleObjectLookAt } = useCreate();
  const canvasRef = useRef<HTMLDivElement>();

  const [isLoaded, setIsLoaded] = useState<boolean>(false);

  useEffect(() => {
    if (scene && renderer && camera) {
      // document.body.appendChild( renderer.domElement );
      // use ref as a mount point of the Three.js scene instead of the document.body
      canvasRef.current && canvasRef.current.appendChild(renderer.domElement);
      setIsLoaded(true);
    }
  }, [scene, camera, renderer]);

  useEffect(() => {
    if (isLoaded && obj && camera) {
      let { position } = obj;
      let handleId: any;

      var animate = () => {
        const cP = camera.position;
        const oP = obj.position;
        const cV2 = new THREE.Vector2(cP.x, cP.z);
        const oV2 = new THREE.Vector2(oP.x, oP.z);
        const direction = oV2.sub(cV2).normalize();

        const distanceCtoO = 10.5;

        const vBefore = position
          .clone()
          .normalize()
          .multiplyScalar(distanceCtoO);
        const mvCoord = move(position, direction);
        const toCenter = dropToCenter(mvCoord);

        const vAfter = toCenter
          .clone()
          .normalize()
          .multiplyScalar(distanceCtoO);

        // if (Math.floor(position.length() * 100) / 100 === 10.5) {
        const prevQuaternion = obj.quaternion;
        const quaternion = rotate(vBefore, vAfter);
        const resultQuaternion = new THREE.Quaternion();
        resultQuaternion.multiplyQuaternions(quaternion, prevQuaternion);
        obj.quaternion.copy(resultQuaternion);
        // }

        position.x = toCenter.x;
        position.y = toCenter.y;
        position.z = toCenter.z;

        // Handle Camera Position
        // camera.position.set(
        //   position.x,
        //   position.y + distanceCtoO,
        //   position.z + distanceCtoO
        // );
        // camera.lookAt(position.x, position.y, position.z);
        // moveCamera(camera.position, position);
        // zoomInOut(camera);
        handleId = requestAnimationFrame(animate);

        renderer.render(scene, camera);
      };
      animate();
      return () => cancelAnimationFrame(handleId);
    }
  }, [isLoaded, camera, obj]);

  useEffect(() => {
    window.addEventListener("keydown", keyDownObject);
    window.addEventListener("keydown", keyDownCameraEvent);
    window.addEventListener("keyup", keyUpObject);
    window.addEventListener("keyup", keyUpCameraEvent);
    window.addEventListener("wheel", zoomInOutCameraEvent);
    return () => {
      window.removeEventListener("keydown", keyDownObject);
      window.removeEventListener("keydown", keyDownCameraEvent);
      window.removeEventListener("keyup", keyUpObject);
      window.removeEventListener("keyup", keyUpCameraEvent);
      window.removeEventListener("wheel", zoomInOutCameraEvent);
    };
  }, [meshesRef.current]);

  return (
    <div
      style={{ width: "100%", height: "100%", backgroundColor: "#FFF" }}
      ref={canvasRef as RefObject<HTMLDivElement>}
    />
  );
};
