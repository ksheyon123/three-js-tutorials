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
  const { scene, renderer, camera } = useContext(InitContext);
  const { move, rotate, keyDownObject, keyUpObject, dropToCenter } =
    useControl(scene);
  const {
    moveCamera,
    zoomCamera,
    keyDownCameraEvent,
    keyUpCameraEvent,
    zoomInOutCameraEvent,
  } = useCamera();
  const { createObject } = useCreate();
  const canvasRef = useRef<HTMLDivElement>();

  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [obj, setObj] = useState<any>();

  useEffect(() => {
    if (scene && renderer && camera) {
      // document.body.appendChild( renderer.domElement );
      // use ref as a mount point of the Three.js scene instead of the document.body
      canvasRef.current && canvasRef.current.appendChild(renderer.domElement);
      const obj = createObject();
      setObj(obj);
      scene.add(obj);
      setIsLoaded(true);
    }
  }, [scene, camera, renderer]);

  useEffect(() => {
    if (isLoaded && obj && camera) {
      let { position } = obj;
      let handleId: any;

      var animate = () => {
        // const cP = camera.position;
        // const oP = obj.position;
        // const cV2 = new THREE.Vector2(cP.x, cP.z);
        // const oV2 = new THREE.Vector2(oP.x, oP.z);
        // const direction = oV2.sub(cV2).normalize();

        // Handle Camera Position
        camera.lookAt(position.x, position.y, position.z);
        const { x: cX, y: cY, z: cZ } = moveCamera(position);
        camera.position.set(cX, cY, cZ);

        // Move function의 direction 성분을 고정 값이 아니라 원의 접선 방향의 단위 벡터로 정의해야함.
        const mvCoord = move(position);
        const toCenter = dropToCenter(mvCoord);

        const prevQuaternion = obj.quaternion;
        const quaternion = rotate(position, toCenter);
        const resultQuaternion = new THREE.Quaternion();
        resultQuaternion.multiplyQuaternions(quaternion, prevQuaternion);
        obj.quaternion.copy(resultQuaternion);

        // Set Position
        position.x = toCenter.x;
        position.y = toCenter.y;
        position.z = toCenter.z;

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
  }, []);

  return (
    <div
      style={{ width: "100%", height: "100%", backgroundColor: "#FFF" }}
      ref={canvasRef as RefObject<HTMLDivElement>}
    />
  );
};
