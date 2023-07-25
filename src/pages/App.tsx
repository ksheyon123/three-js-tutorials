import React, { useContext, useEffect, useRef } from "react";
import { ThreeJsCtx } from "@/contexts/ThreeJsCtx";

const App = () => {
  const { ctx } = useContext(ThreeJsCtx);
  const ctxRef = useRef<any>(null);
  useEffect(() => {
    if (ctxRef) {
      ctx.createScene();
      ctx.createCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
      ctx.createRenderer({
        canvas: ctxRef.current,
        antialias: true,
      });

      ctx.renderer.setSize(window.innerWidth, window.innerHeight);
      ctx.createObject();
      ctx.renderer.render(ctx.scene, ctx.camera);
    }
  }, [ctxRef]);

  return (
    <div>
      <div>Application</div>
      <div onClick={() => ctx.handleCamera()}>Controller</div>
      <canvas ref={ctxRef}></canvas>
    </div>
  );
};

export default App;
