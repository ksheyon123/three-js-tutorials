import WebGL from "three/addons/capabilities/WebGL.js";
import * as THREE from "three";
import React, {
  ReactNode,
  createContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { useCamera } from "@/hooks/useCamera";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

interface IProps {
  children: ReactNode;
}

const InitContext = createContext<{
  scene: THREE.Scene | null;
  renderer: THREE.WebGLRenderer | null;
  camera: THREE.PerspectiveCamera | null;
  orbit: OrbitControls | null;
}>({
  scene: null,
  renderer: null,
  camera: null,
  orbit: null,
});

const InitProvider: React.FC<IProps> = ({ children }) => {
  const { createCamera, handleCameraPosition, createOrbit } = useCamera();

  //   const [isWebGlMounted, setIsWebGlMounted] = useState<boolean>(false);
  const [scene, setScene] = useState<THREE.Scene>();
  const [renderer, setRenderer] = useState<THREE.WebGLRenderer>();
  const [camera, setCamera] = useState<THREE.PerspectiveCamera>();
  const [orbit, setOrbit] = useState<OrbitControls>();

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

  const createRenderer = () => {
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0xffffff);
    return renderer;
  };

  const init = () => {
    const scene = new THREE.Scene();
    const camera = createCamera();
    const renderer = createRenderer();
    const orbit = createOrbit(camera, renderer);
    // drawGridHelper(scene);
    drawAxisHelper(scene);

    handleCameraPosition(camera); // Initial Camera Position

    setScene(scene);
    setCamera(camera);
    setRenderer(renderer);
    setOrbit(orbit);
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
        renderer,
        camera,
        orbit,
      }}
    >
      {!!scene && children}
    </InitContext.Provider>
  );
};

export { InitContext, InitProvider };
