import { useRef } from "react";
import * as THREE from "three";

export const useRaycaster = (
  scene: THREE.Scene,
  camera: THREE.PerspectiveCamera
) => {
  const coordRef = useRef<{ x: number; y: number; z: number }>();

  const handleClick = (event: MouseEvent) => {
    const mouse = new THREE.Vector2();
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    // 카메라와 연관된 광선 생성
    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(mouse, camera);

    // Raycaster를 사용하여 광선이 교차하는 모든 객체의 배열을 얻습니다.
    const plane = scene.children.filter((el) => el.name === "plane")[0];
    const intersects = raycaster.intersectObject(plane);

    if (intersects.length > 0) {
      // 교차점을 얻고 해당 교차점의 좌표를 출력합니다.
      const intersection = intersects[0].point;
      console.log("Intersection point:", intersection);
    }
  };
  return {
    handleClick,
  };
};
