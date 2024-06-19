import { InitContext } from "@/contexts/initContext";
import { useCreate } from "@/hooks/useCreate";
import { useTurret } from "@/hooks/useTurret";
import { useMove } from "@/hooks/useMove";
import React, {
  RefObject,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import * as THREE from "three";
import { useEnemy } from "@/hooks/useEnemy";

const Shooting: React.FC = () => {
  const { renderer, camera, scene } = useContext(InitContext);
  const canvasRef = useRef<HTMLDivElement>();

  const { createObject, createPlane } = useCreate();
  const { chkBulletCollided, bulletMove, bulletRemove, remove } =
    useTurret(scene);
  const { getPosition, chkEnemyCollided, enemyRemove } = useEnemy(scene);

  const [isRender, setIsRender] = useState<boolean>(false);

  useEffect(() => {
    if (renderer) {
      canvasRef.current && canvasRef.current.appendChild(renderer.domElement);
      setIsRender(true);
    }
  }, [renderer]);

  const getShooter = () => {
    const obj = createObject({}, {}, "i", [
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

      const shooter = getShooter();
      scene.add(shooter);
      // Set camera
      camera.position.set(0, 0, 30);
      camera.lookAt(base);

      const animate = () => {
        animationId = requestAnimationFrame(animate);

        const enemies = scene.children.filter((el) => el.name === "enemy");
        const bullets = scene.children.filter((el) => el.name === "bullet");

        enemies.map((el) => {
          chkEnemyCollided(el.uuid);
        });

        bullets.map((el) => {
          chkBulletCollided(el.uuid);
        });

        enemyRemove();
        bulletRemove();

        enemies.map((el) => {
          const d = getPosition(el.uuid);
          if (d) {
            if (d.distanceTo(base) < 0.2) {
              el.removeFromParent();
            }
            const { x, y, z } = d;
            el.position.set(x, y, z);
          }
        });

        bullets.map((el) => {
          const d = bulletMove(el.uuid);
          if (d) {
            if (d.distanceTo(base) > 15) {
              el.removeFromParent();
              remove(el.uuid);
            }
            const { x, y, z } = d;
            el.position.set(x, y, z);
          }
        });

        renderer.render(scene, camera);
      };
      animate();
      return () => cancelAnimationFrame(animationId);
    }
  }, [isRender]);

  // useEffect(() => {
  //   if (isRender) {
  //     let timerId: any;
  //     timerId = setInterval(() => {
  //       const deg = Math.random() * 90;
  //       const x = Math.sin(deg) * 5;
  //       const z = Math.cos(deg) * 5;

  //       const enemy = createObject(
  //         { w: 0.1, h: 0.1, d: 0.1 },
  //         { x: x, y: 0, z: z },
  //         "enemy",
  //         [
  //           new THREE.MeshBasicMaterial({ color: 0xfff }), // +x 면
  //           new THREE.MeshBasicMaterial({ color: 0xfff }), // -x 면
  //           new THREE.MeshBasicMaterial({ color: 0xfff }), // +y 면
  //           new THREE.MeshBasicMaterial({ color: 0xfff }), // -y 면
  //           new THREE.MeshBasicMaterial({ color: 0xfff }), // +z 면
  //           new THREE.MeshBasicMaterial({ color: 0xfff }), // -z 면
  //         ]
  //       );
  //       scene.add(enemy);
  //     }, 3000);
  //     return () => clearInterval(timerId);
  //   }
  // }, [isRender]);

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
