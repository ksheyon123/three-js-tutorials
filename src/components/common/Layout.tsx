import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { ThreeJsCtxProvider } from "@/contexts/ThreeJsCtx";
import { Menu } from "./";

const Layout = ({ children }: any) => {
  const [isShow, setIsShow] = useState<boolean>(false);
  const showMenu = (e: KeyboardEvent) => {
    if (e.key === "Escape") {
      if (isShow) setIsShow(false);
      if (!isShow) setIsShow(true);
    }
  };
  useEffect(() => {
    window.addEventListener("keydown", showMenu);
    return () => window.removeEventListener("keydown", showMenu);
  }, [isShow]);

  return (
    <ThreeJsCtxProvider>
      <StyledLayout>
        {isShow && <Menu close={() => setIsShow(false)} />}
        {children}
      </StyledLayout>
    </ThreeJsCtxProvider>
  );
};

const StyledLayout = styled.div`
  width: 100vw;
  height: 100vh;
`;

export { Layout };
