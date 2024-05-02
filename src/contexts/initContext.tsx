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

const InitContext = createContext<{ scene: THREE.Scene | null }>({
  scene: null,
});

const InitProvider: React.FC<IProps> = ({ children }) => {
  //   const [isWebGlMounted, setIsWebGlMounted] = useState<boolean>(false);
  const [scene, setScene] = useState<THREE.Scene>();

  /**
   * @param scene THREE.Scene which receives projected object.
   * @description Draw grid on the z-x plain
   */
  const drawGridHelper = (scene: THREE.Scene) => {
    const size = 10;
    const divisions = 10;

    const gridHelper = new THREE.GridHelper(size, divisions);
    scene.add(gridHelper);
  };

  /**
   * @param scene THREE.Scene which receives projected object.
   */
  const drawAxisHelper = (scene: THREE.Scene) => {
    const axisHelper = new THREE.AxesHelper();
    scene.add(axisHelper);
  };

  const init = () => {
    var scene = new THREE.Scene();
    // drawGridHelper(scene);
    drawAxisHelper(scene);
    setScene(scene);
  };

  useEffect(() => {
    if (WebGL.isWebGLAvailable()) {
      init();
    } else {
      alert("Unable to use webgl");
    }
  }, []);

  return (
    <InitContext.Provider
      value={{
        scene,
      }}
    >
      {!!scene && children}
    </InitContext.Provider>
  );
};

export { InitContext, InitProvider };
