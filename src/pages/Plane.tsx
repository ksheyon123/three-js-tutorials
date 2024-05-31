import { InitContext } from "@/contexts/initContext";
import { useCamera } from "@/hooks/useCamera";
import { useControl } from "@/hooks/useControl";
import { useCreate } from "@/hooks/useCreate";
import { useMove } from "@/hooks/useMove";
import { useRaycaster } from "@/hooks/useRaycaster";
import React, {
  RefObject,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import * as THREE from "three";

const Plane: React.FC = () => {
  const { scene, renderer, camera } = useContext(InitContext);
  const canvasRef = useRef<HTMLDivElement>();
  const {
    moveCamera,
    zoomCamera,
    lookAtDirection,
    handleMouseDownEvent,
    handleMouseUpEvent,
    handleMouseMoveEvent,
  } = useCamera();
  const { move, lookAt, keyUpEventHandler, keyDownEventHandler } = useMove();
  const { createObject, createPlane } = useCreate();
  const { handleClick } = useRaycaster(scene, camera);

  const [isRender, setIsRender] = useState<boolean>(false);

  useEffect(() => {
    if (renderer) {
      canvasRef.current && canvasRef.current.appendChild(renderer.domElement);
      setIsRender(true);
    }
  }, [renderer]);

  // const resizeCanvasToDisplaySize = () => {
  //   const canvas = renderer.domElement;
  //   // look up the size the canvas is being displayed
  //   const width = canvas.clientWidth;
  //   const height = canvas.clientHeight;

  //   // adjust displayBuffer size to match
  //   if (canvas.width !== width || canvas.height !== height) {
  //     // you must pass false here or three.js sadly fights the browser
  //     renderer.setSize(width, height, false);
  //     camera.aspect = width / height;
  //     camera.updateProjectionMatrix();

  //     // update any render target sizes here
  //   }
  // };

  useEffect(() => {
    let animationHandleId: any;
    if (isRender) {
      const obj = createObject();
      const plane = createPlane();

      scene.add(obj);
      scene.add(plane);
      const objectRotation = new THREE.Euler(0, 0, 0);
      const animate = () => {
        const position = obj.position.clone();
        // console.log(position);

        // resizeCanvasToDisplaySize();
        // Write code from here...

        const { x: cX, y: cY, z: cZ } = moveCamera(position);
        camera.position.set(cX, cY, cZ);

        const d = lookAtDirection(camera);
        d.y = 0;
        // const { x: newX, y: newY, z: newZ } = move(d, position);
        // obj.position.set(newX, newY, newZ);
        const p = lookAt(d, obj.position);
        obj.lookAt(p);
        camera.lookAt(position.x, position.y, position.z);

        animationHandleId = requestAnimationFrame(animate);
        renderer.render(scene, camera);
      };
      animate();
      return () => cancelAnimationFrame(animationHandleId);
    }
  }, [isRender, scene, camera]);

  // For Object
  useEffect(() => {
    window.addEventListener("keydown", keyDownEventHandler);
    window.addEventListener("keydown", keyUpEventHandler);
    return () => {
      window.removeEventListener("keyup", keyDownEventHandler);
      window.removeEventListener("keyup", keyUpEventHandler);
    };
  }, []);

  // For Camera
  useEffect(() => {
    const ref = canvasRef.current;
    if (ref) {
      const handleMouseWheelEvent = (e: WheelEvent) => {
        if (e.deltaY > 0) {
          zoomCamera(camera, true);
        }

        if (e.deltaY < 0) {
          zoomCamera(camera, false);
        }
      };

      ref.addEventListener("mousedown", handleMouseDownEvent);
      ref.addEventListener("click", handleClick);
      ref.addEventListener("mouseup", handleMouseUpEvent);
      ref.addEventListener("mousemove", handleMouseMoveEvent);
      ref.addEventListener("mouseout", handleMouseUpEvent);
      ref.addEventListener("wheel", handleMouseWheelEvent);
      return () => {
        ref.removeEventListener("mousedown", handleMouseDownEvent);
        ref.removeEventListener("click", handleClick);
        ref.removeEventListener("mouseup", handleMouseUpEvent);
        ref.removeEventListener("mousemove", handleMouseMoveEvent);
        ref.removeEventListener("mouseout", handleMouseUpEvent);
        ref.removeEventListener("wheel", handleMouseWheelEvent);
      };
    }
  }, [canvasRef]);

  return <div ref={canvasRef as RefObject<HTMLDivElement>} />;
};

export default Plane;
