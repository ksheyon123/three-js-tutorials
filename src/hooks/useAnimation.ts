import { useRef } from "react";

export const useAnimation = () => {
  const animationHandle = useRef<any>();
  const runner = (cb: Function) => {
    const animate = () => {
      cb();
      animationHandle.current = requestAnimationFrame(animate);
    };
    animate();
    return () => cancelAnimate();
  };

  const cancelAnimate = () => cancelAnimationFrame(animationHandle.current);

  return {
    runner,
    cancelAnimate,
  };
};
