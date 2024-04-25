import WebGL from "three/addons/capabilities/WebGL.js";
import React, { ReactNode, createContext, useEffect, useState } from "react";

interface IProps {
  children: ReactNode;
}

const InitContext = createContext<any>({});

const InitProvider: React.FC<IProps> = ({ children }) => {
  //   const [isWebGlMounted, setIsWebGlMounted] = useState<boolean>(false);
  useEffect(() => {
    if (WebGL.isWebGLAvailable()) {
    } else {
      alert("Unable to use webgl");
    }
  }, []);

  return <InitContext.Provider value={{}}>{children}</InitContext.Provider>;
};

export { InitContext, InitProvider };
