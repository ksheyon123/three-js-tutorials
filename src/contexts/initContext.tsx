import WebGL from "three/addons/capabilities/WebGL.js";
import * as THREE from "three";
import React, { ReactNode, createContext, useEffect, useState } from "react";
import { useCamera } from "@/hooks/useCamera";

// @ts-ignore
// import WorkerBuilder from "@/workers/worker-builder";
import TurretWorker from "@/workers/turret.worker.js";
// @ts-ignore
import EnemyWorker from "@/workers/enemy.worker.js";

interface IProps {
  children: ReactNode;
}

const InitContext = createContext<{
  scene: THREE.Scene | undefined;
  renderer: THREE.WebGLRenderer | undefined;
  camera: THREE.PerspectiveCamera | undefined;
  turretWorker: any;
  enemyWorker: any;
}>({
  scene: null,
  renderer: null,
  camera: null,
  turretWorker: null,
  enemyWorker: null,
});

const InitProvider: React.FC<IProps> = ({ children }) => {
  const { createCamera } = useCamera();
  const [scene, setScene] = useState<THREE.Scene>();
  const [renderer, setRenderer] = useState<THREE.WebGLRenderer>();
  const [camera, setCamera] = useState<THREE.PerspectiveCamera>();
  // const tWorker = new WorkerBuilder(turretWorker);
  // const eWorker = new WorkerBuilder(enemyWorker);

  const tWorker = new TurretWorker();
  const eWorker = new EnemyWorker();
  console.log(tWorker);
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
    console.log("INITIALIZED");
    const scene = new THREE.Scene();
    const camera = createCamera();
    const renderer = createRenderer();
    // drawGridHelper(scene);
    // drawAxisHelper(scene);

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
        turretWorker: tWorker,
        enemyWorker: eWorker,
      }}
    >
      {!!scene && children}
    </InitContext.Provider>
  );
};

export { InitContext, InitProvider };
