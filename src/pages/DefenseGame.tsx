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
import InformationBar from "@/components/Three/InformationDock/InformationBar";

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