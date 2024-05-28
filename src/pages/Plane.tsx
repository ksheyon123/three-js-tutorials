import { InitContext } from "@/contexts/initContext";
import { useCamera } from "@/hooks/useCamera";
import { useControl } from "@/hooks/useControl";
import { useCreate } from "@/hooks/useCreate";
import React, { RefObject, useContext, useEffect, useRef } from "react";

const Plane: React.FC = () => {
  const { scene, renderer } = useContext(InitContext);
  const canvasRef = useRef<HTMLDivElement>();
  const {} = useCamera();
  const {} = useControl(scene);
  const { createObject, createPlane } = useCreate();

  useEffect(() => {
    if (renderer) {
      canvasRef.current && canvasRef.current.appendChild(renderer.domElement);
    }
  }, [renderer]);

  return (
    <div>
      <div ref={canvasRef as RefObject<HTMLDivElement>} />
    </div>
  );
};

export default Plane;
