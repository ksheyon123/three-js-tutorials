import React, { useContext, useEffect, useRef } from "react";
import { ThreeJsCtx } from "@/contexts/ThreeJsCtx";
import { Controller } from "@/components/common";

const App = () => {
  const { ctx } = useContext(ThreeJsCtx);
  const ctxRef = useRef<any>(null);

  const init = () => {
    ctx.createScene();
    ctx.createRenderer({
      canvas: ctxRef.current,
      antialias: true,
    });
    ctx.createCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    ctx.renderer.render(ctx.scene, ctx.camera);
    ctx.createObject();
    ctx.createOrbit();
    ctx.animate();
    ctx.createGrid();
  };

  useEffect(() => {
    if (ctxRef) {
      init();
    }
  }, [ctxRef]);

  return (
    <div>
      <canvas style={{ backgroundColor: "red" }} ref={ctxRef}></canvas>
      <Controller />
    </div>
  );
};

export default App;
