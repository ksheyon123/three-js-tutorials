import { useRef } from "react";
import * as THREE from "three";

export const useRaycaster = (
  scene: THREE.Scene,
  camera: THREE.PerspectiveCamera
) => {
  const coordRef = useRef<THREE.Vector3 | null>(null);

  const chkIsArrived = (position: THREE.Vector3) => {
    if (!coordRef.current) {
      return { normal: null };
    } else {
      const { x: cX, z: cZ } = coordRef.current;
      const v1 = new THREE.Vector2(cX, cZ);
      const { x: pX, z: pZ } = position;
      const v2 = new THREE.Vector2(pX, pZ);
      const distanceTo = v1.distanceTo(v2);

      if (distanceTo < 0.1) {
        coordRef.current = null;
        return { normal: null };
      }
      const normal = coordRef.current.clone().sub(position).normalize();
      return { normal };
    }
  };

  const mouseDownCoord = useRef<any>({
    screenX: 0,
    screenY: 0,
  });

  const handleRayUpEvent = (e: MouseEvent) => {
    if (
      e.screenX === mouseDownCoord.current.screenX &&
      e.screenY === mouseDownCoord.current.screenY
    ) {
      const mouse = new THREE.Vector2();
      mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;

      // 카메라와 연관된 광선 생성
      const raycaster = new THREE.Raycaster();
      raycaster.setFromCamera(mouse, camera);

      // Raycaster를 사용하여 광선이 교차하는 모든 객체의 배열을 얻습니다.
      const plane = scene.children.filter((el) => el.name === "plane")[0];
      const intersects = raycaster.intersectObject(plane);

      if (intersects.length > 0) {
        // 교차점을 얻고 해당 교차점의 좌표를 출력합니다.
        const intersection = intersects[0].point;
        coordRef.current = intersection;
      }
    }
  };

  const handleRayDownEvent = (e: MouseEvent) => {
    mouseDownCoord.current = {
      screenX: e.screenX,
      screenY: e.screenY,
    };
  };
  return {
    chkIsArrived,
    handleRayUpEvent,
    handleRayDownEvent,
  };
};
