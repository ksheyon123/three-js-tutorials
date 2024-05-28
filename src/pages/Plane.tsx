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
  const { scene, renderer } = useContext(InitContext);
  const canvasRef = useRef<HTMLDivElement>();
  const {} = useCamera();
  const {} = useControl(scene);
  const { createObject, createPlane } = useCreate();

  const [isRender, setIsRender] = useState<boolean>(false);

  useEffect(() => {
    if (renderer) {
      canvasRef.current && canvasRef.current.appendChild(renderer.domElement);
      setIsRender(true);
    }
  }, [renderer]);

  useEffect(() => {
    let animationHandleId: any;
    if (isRender) {
      const obj = createObject();
      const plane = createPlane();

      scene.add(obj);
      scene.add(plane);
      const animate = () => {
        animationHandleId = requestAnimationFrame(animate);
      };
      return () => cancelAnimationFrame(animationHandleId);
    }
  }, [isRender]);

  return (
    <div>
      <div ref={canvasRef as RefObject<HTMLDivElement>} />
    </div>
  );
};

export default Plane;
