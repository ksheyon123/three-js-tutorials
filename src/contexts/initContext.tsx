import WebGL from "three/addons/capabilities/WebGL.js";
import * as THREE from "three";
import React, {
  ReactNode,
  createContext,
  useEffect,
  useRef,
  useState,
} from "react";

interface IProps {
  children: ReactNode;
}

const InitContext = createContext<any>({});

const InitProvider: React.FC<IProps> = ({ children }) => {
  //   const [isWebGlMounted, setIsWebGlMounted] = useState<boolean>(false);
  const [objects, setObjects] = useState<Map<string, any>>();
  const threeJs = useRef<any>(THREE);
  useEffect(() => {
    if (WebGL.isWebGLAvailable()) {
    } else {
      alert("Unable to use webgl");
    }
  }, []);

  //   const createScene = (obj: any) => {
  //     const scene = new THREE.Scene();
  //     scene.add(obj);
  //     const renderer = new THREE.WebGLRenderer();
  //     renderer.render(scene, )
  //   };

  return (
    <InitContext.Provider
      value={{
        setObjects,
        objects,
      }}
    >
      {children}
    </InitContext.Provider>
  );
};

export { InitContext, InitProvider };
