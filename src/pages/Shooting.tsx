import { InitContext } from "@/contexts/initContext";
import { useCreate } from "@/hooks/useCreate";
import { useMove } from "@/hooks/useMove";
import React, {
  RefObject,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import * as THREE from "three";

const Shooting: React.FC = () => {
  const { renderer, camera, scene } = useContext(InitContext);
  const canvasRef = useRef<HTMLDivElement>();

  const { createObject, createPlane } = useCreate();
  const { move } = useMove(scene);

  const [isRender, setIsRender] = useState<boolean>(false);

  const rockOn = useRef();

  useEffect(() => {
    if (renderer) {
      canvasRef.current && canvasRef.current.appendChild(renderer.domElement);
      setIsRender(true);
    }
  }, [renderer]);

  const getShooter = () => {
    const obj = createObject({}, {}, "object", [
      new THREE.MeshBasicMaterial({ color: 0xffd400 }), // +x 면
      new THREE.MeshBasicMaterial({ color: 0xffd400 }), // -x 면
      new THREE.MeshBasicMaterial({ color: 0xffd400 }), // +y 면
      new THREE.MeshBasicMaterial({ color: 0xffd400 }), // -y 면
      new THREE.MeshBasicMaterial({ color: 0xff0000 }), // +z 면
      new THREE.MeshBasicMaterial({ color: 0x0000ff }), // -z 면
    ]);
    return obj;
  };

  useEffect(() => {
    if (isRender) {
      let animationId: any;

      const base = new THREE.Vector3(0, 0, 0);
      // Assign plane object to the scene;
      const plane = createPlane();
      scene.add(plane);

      // Assign Shooter object to the scene;
      //   const shooter = getShooter();
      //   scene.add(shooter);

      // Set camera
      camera.position.set(0, 10, 0);
      camera.lookAt(base);

      const animate = () => {
        const enemies = scene.children.filter((el) => el.name === "enemy");
        const missiles = scene.children.filter((el) => el.name === "missile");
        enemies.map((el) => {
          const position = el.position.clone();
          const forward = base.clone().sub(position).normalize();
          const newPosition = move(forward, position);
          const { x, y, z } = newPosition;
          const distance = base.distanceTo(newPosition);
          if (distance < 3) {
            if (!!el.userData?.missile) {
              const m = el.userData.missile as THREE.Mesh;
              const mForward = newPosition.clone().sub(m.position).normalize();
              const newMPosition = move(mForward, m.position);
              m.position.set(newMPosition.x, newMPosition.y, newMPosition.z);
              const mToE = newMPosition.distanceTo(newPosition);
              if (mToE < 0.2) {
                el.removeFromParent();
                m.removeFromParent();
              }
            } else {
              const missile = getMissile();
              el.userData = {
                missile,
              };
              scene.add(missile);
            }
          }
          if (distance < 0.3 && el.name === "enemy") {
            el.removeFromParent();
          }
          el.position.set(x, y, z);
        });

        missiles.map((el) => {});
        // scene.children.map((el) => {
        //   if (el.name === "missile") {
        //   }
        // });

        animationId = requestAnimationFrame(animate);
        renderer.render(scene, camera);
      };
      animate();
      return () => cancelAnimationFrame(animationId);
    }
  }, [isRender]);

  useEffect(() => {
    if (isRender) {
      let timerId: any;
      timerId = setInterval(() => {
        const deg = Math.random() * 90;
        const x = Math.sin(deg) * 5;
        const z = Math.cos(deg) * 5;

        const enemy = createObject(
          { w: 0.1, h: 0.1, d: 0.1 },
          { x: x, y: 0, z: z },
          "enemy",
          [
            new THREE.MeshBasicMaterial({ color: 0xfff }), // +x 면
            new THREE.MeshBasicMaterial({ color: 0xfff }), // -x 면
            new THREE.MeshBasicMaterial({ color: 0xfff }), // +y 면
            new THREE.MeshBasicMaterial({ color: 0xfff }), // -y 면
            new THREE.MeshBasicMaterial({ color: 0xfff }), // +z 면
            new THREE.MeshBasicMaterial({ color: 0xfff }), // -z 면
          ]
        );
        scene.add(enemy);
      }, 100);
      return () => clearInterval(timerId);
    }
  }, [isRender]);

  const getMissile = () => {
    const missile = createObject(
      { w: 0.05, h: 0.05, d: 0.05 },
      { x: 0, y: 0, z: 0 },
      "missile",
      [
        new THREE.MeshBasicMaterial({ color: 0xffffff }), // +x 면
        new THREE.MeshBasicMaterial({ color: 0xffffff }), // -x 면
        new THREE.MeshBasicMaterial({ color: 0xffffff }), // +y 면
        new THREE.MeshBasicMaterial({ color: 0xffffff }), // -y 면
        new THREE.MeshBasicMaterial({ color: 0xffffff }), // +z 면
        new THREE.MeshBasicMaterial({ color: 0xffffff }), // -z 면
      ]
    );
    return missile;
  };

  useEffect(() => {
    const ref = canvasRef.current;
    if (ref) {
      ref.addEventListener("mousemove", () => {});
      return () => {
        ref.removeEventListener("mousemove", () => {});
      };
    }
  }, []);

  return <div ref={canvasRef as RefObject<HTMLDivElement>} />;
};

export default Shooting;
