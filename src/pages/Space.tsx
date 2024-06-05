import React, {
  ReactNode,
  RefObject,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { InitContext } from "@/contexts/initContext";
import SpaceLayout from "@/components/pageComponent/Space/Layout/Layout";

interface IProps {}

const Space: React.FC = () => {
  const { renderer, camera, scene } = useContext(InitContext);
  const canvasRef = useRef<HTMLDivElement>();

  const [isRender, setIsRender] = useState<boolean>(false);

  useEffect(() => {
    if (renderer) {
      canvasRef.current && canvasRef.current.appendChild(renderer.domElement);
      setIsRender(true);
    }
  }, [renderer]);

  useEffect(() => {
    let animationId: any;
    const animate = () => {
      animationId = requestAnimationFrame(animate);
    };
    animate();
    return () => cancelAnimationFrame(animationId);
  }, []);

  useEffect(() => {
    const ref = canvasRef.current;
    if (ref) {
      ref.addEventListener("mousemove", () => {});
      return () => {
        ref.removeEventListener("mousemove", () => {});
      };
    }
  }, []);

  return (
    <SpaceLayout>
      <div ref={canvasRef as RefObject<HTMLDivElement>} />;
    </SpaceLayout>
  );
};

export default Space;
