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
  const {
    move,
    jump,
    lookAt,
    direction,
    keyUpEventHandler,
    keyDownEventHandler,
  } = useMove(scene);
  const { createObject, createPlane, meshes } = useCreate();
  const { chkIsArrived, handleRayUpEvent, handleRayDownEvent, handleRayHover } =
    useRaycaster(scene, camera);

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

  const createObstacle = () => {
    const min = -30;
    const max = 30;
    const obj = createObject(
      { w: 1, h: 1, d: 1 },
      { x: 0, y: 0, z: 2 },
      "obstacle"
    );
    return obj;
  };

  useEffect(() => {
    let animationHandleId: any;
    if (isRender) {
      const obj = createObject();
      const plane = createPlane();
      const obstacle = createObstacle();

      scene.add(obj);
      scene.add(plane);
      scene.add(obstacle);

      const animate = () => {
        const position = obj.position.clone();

        // resizeCanvasToDisplaySize();
        const { x: cX, y: cY, z: cZ } = moveCamera(position);
        camera.position.set(cX, cY, cZ);
        camera.lookAt(position.x, position.y, position.z);

        const cameraDirection = position
          .clone()
          .sub(camera.position.clone())
          .normalize();

        // Key normal direction
        const keyDirection =
          direction(cameraDirection.clone())?.normalize() || null;

        // Raycaster normal direction
        const rayDirection = chkIsArrived(position);

        const curDirection =
          rayDirection ||
          keyDirection ||
          new THREE.Vector3(0, 0, 0).normalize();

        curDirection.y = 0;
        const {
          x: newX,
          y: newY,
          z: newZ,
        } = jump(move(curDirection, position));
        obj.position.set(newX, newY, newZ);

        const p = lookAt(
          !rayDirection && !keyDirection ? cameraDirection : curDirection,
          obj.position
        );
        obj.lookAt(p);

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
    window.addEventListener("keyup", keyUpEventHandler);
    return () => {
      window.removeEventListener("keydown", keyDownEventHandler);
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

      ref.addEventListener("mousedown", (e) => {
        handleMouseDownEvent(e);
        handleRayDownEvent(e);
      });
      ref.addEventListener("mouseup", (e) => {
        handleMouseUpEvent(e);
        handleRayUpEvent(e);
      });
      ref.addEventListener("mousemove", (e) => {
        handleMouseMoveEvent(e);
        handleRayHover(e);
      });
      ref.addEventListener("mouseout", handleMouseUpEvent);
      ref.addEventListener("wheel", handleMouseWheelEvent);
      return () => {
        ref.removeEventListener("mousedown", (e) => {
          handleMouseDownEvent(e);
          handleRayDownEvent(e);
        });
        ref.removeEventListener("mouseup", (e) => {
          handleMouseUpEvent(e);
          handleRayUpEvent(e);
        });
        ref.removeEventListener("mousemove", (e) => {
          handleMouseMoveEvent(e);
          handleRayHover(e);
        });
        ref.removeEventListener("mouseout", handleMouseUpEvent);
        ref.removeEventListener("wheel", handleMouseWheelEvent);
      };
    }
  }, [canvasRef]);

  return <div ref={canvasRef as RefObject<HTMLDivElement>} />;
};

export default Plane;
