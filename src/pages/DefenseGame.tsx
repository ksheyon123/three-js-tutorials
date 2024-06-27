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
import { PlayerContext } from "@/contexts/PlayerContext";

const Shooting: React.FC = () => {
  const { renderer, camera, scene } = useContext(InitContext);
  const canvasRef = useRef<HTMLDivElement>();

  const { createObject } = useCreate();
  const { chkBulletCollided, bulletMove, bulletRemove } = useTurret(scene);
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

  const getOutline = () => {
    // Create the ring geometry
    const innerRadius = 15; // Inner radius of the hollow circle
    const outerRadius = 15.1; // Outer radius of the hollow circle
    const segments = 64; // Number of segments for the circle

    const geometry = new THREE.RingGeometry(innerRadius, outerRadius, segments);

    // Create a material for the ring
    const material = new THREE.MeshBasicMaterial({
      color: 0xffff00,
      side: THREE.DoubleSide,
    });

    // Create a mesh combining the geometry and material
    const ring = new THREE.Mesh(geometry, material);
    ring.name = "outline";
    return ring;
  };

  useEffect(() => {
    if (isRender) {
      let animationId: any;

      const base = new THREE.Vector3(0, 0, 0);
      // Assign plane object to the scene;

      const shooter = getShooter();
      scene.add(shooter);

      const outline = getOutline();
      scene.add(outline);
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
            const { x, y, z } = d;
            el.position.set(x, y, z);
          }
        });

        bullets.map((el) => {
          const d = bulletMove(el.uuid);
          if (d) {
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
