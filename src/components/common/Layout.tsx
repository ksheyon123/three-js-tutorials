import React from "react";
import { ThreeJsCtxProvider } from "@/contexts/ThreeJsCtx";

const Layout = ({ children }: any) => {
  return (
    <ThreeJsCtxProvider>
      <div>{children}</div>
    </ThreeJsCtxProvider>
  );
};

export { Layout };
