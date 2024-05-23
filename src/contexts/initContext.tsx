import WebGL from "three/addons/capabilities/WebGL.js";
import * as THREE from "three";
import React, { ReactNode, createContext, useEffect, useState } from "react";
import { useCamera } from "@/hooks/useCamera";
import { useCreate } from "@/hooks/useCreate";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

interface IProps {
  children: ReactNode;
}

const InitContext = createContext<{
  scene: THREE.Scene | null;
  renderer: THREE.WebGLRenderer | null;
  camera: THREE.PerspectiveCamera | null;
  radius: number;
  obj: THREE.Mesh | null;
}>({
  scene: null,
  renderer: null,
  camera: null,
  radius: 0,
  obj: null,
});

const InitProvider: React.FC<IProps> = ({ children }) => {
  const { createCamera } = useCamera();
  const { createObject } = useCreate();
  const [scene, setScene] = useState<THREE.Scene>();
  const [renderer, setRenderer] = useState<THREE.WebGLRenderer>();
  const [camera, setCamera] = useState<THREE.PerspectiveCamera>();
  const [obj, setObj] = useState<THREE.Mesh>();

  const radius = 10;
  const squareSize = 1;
  const height = 1;

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
    // drawGridHelper(scene);
    // drawAxisHelper(scene);

    camera.position.set(0, 0, 20);
    // handleCameraPosition(camera); // Initial Camera Position

    const world = createObject(
      { r: radius, w: 20 * radius, h: 20 * radius },
      { x: 0, y: 0, z: 0 },
      "sphere"
    );
    scene.add(world);

    const obj = createObject(
      { x: squareSize, y: height, z: squareSize },
      { x: 0, y: radius + height / 2, z: 0 },
      "box"
    );

    setObj(obj);
    scene.add(obj);

    setScene(scene);
    setCamera(camera);
    setRenderer(renderer);
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
        radius,
        obj,
      }}
    >
      {!!scene && children}
    </InitContext.Provider>
  );
};

export { InitContext, InitProvider };
