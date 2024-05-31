import { InitContext } from "@/contexts/initContext";
import { useCamera } from "@/hooks/useCamera";
import { useControl } from "@/hooks/useControl";
import { useCreate } from "@/hooks/useCreate";
import React, {
  RefObject,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

const Plane: React.FC = () => {
  const { scene, renderer, camera } = useContext(InitContext);
  const canvasRef = useRef<HTMLDivElement>();
  const {
    moveCamera,
    zoomCamera,
    handleMouseDownEvent,
    handleMouseUpEvent,
    handleMouseMoveEvent,
  } = useCamera();
  const {} = useControl(scene);
  const { createObject, createPlane } = useCreate();

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
      const animate = () => {
        const position = obj.position.clone();
        // console.log(position);

        // resizeCanvasToDisplaySize();
        // Write code from here...
        camera.lookAt(position.x, position.y, position.z);

        const { x: cX, y: cY, z: cZ } = moveCamera(position);
        camera.position.set(cX, cY, cZ);

        animationHandleId = requestAnimationFrame(animate);
        renderer.render(scene, camera);
      };
      animate();
      return () => cancelAnimationFrame(animationHandleId);
    }
  }, [isRender, scene, camera]);

  useEffect(() => {
    const ref = canvasRef.current;
    if (ref) {
      ref.addEventListener("mousedown", handleMouseDownEvent);
      ref.addEventListener("mouseup", handleMouseUpEvent);
      ref.addEventListener("mousemove", handleMouseMoveEvent);
      ref.addEventListener("mouseout", handleMouseUpEvent);
      ref.addEventListener("wheel", (e) => {
        if (e.deltaY > 0) {
          zoomCamera(camera, true);
        }

        if (e.deltaY < 0) {
          zoomCamera(camera, false);
        }
      });
      return () => {
        ref.removeEventListener("mousedown", handleMouseDownEvent);
        ref.removeEventListener("mouseup", handleMouseUpEvent);
        ref.removeEventListener("mousemove", handleMouseMoveEvent);
        ref.removeEventListener("mouseout", handleMouseUpEvent);
        ref.removeEventListener("wheel", (e) => {
          console.log(e);
        });
      };
    }
  }, [canvasRef]);

  return <div ref={canvasRef as RefObject<HTMLDivElement>} />;
};

export default Plane;
