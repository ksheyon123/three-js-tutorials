import { useRef } from "react";
import * as THREE from "three";
import { useCreate } from "./useCreate";

export const useRaycaster = (
  scene: THREE.Scene,
  camera: THREE.PerspectiveCamera
) => {
  const { getMeshObjects, drawOutLine, removeOutLine } = useCreate();
  const coordRef = useRef<THREE.Vector3 | null>(null);

  const chkIsArrived = (position: THREE.Vector3) => {
    if (!coordRef.current) {
      return null;
    } else {
      const { x: cX, z: cZ } = coordRef.current;
      const v1 = new THREE.Vector2(cX, cZ);
      const { x: pX, z: pZ } = position;
      const v2 = new THREE.Vector2(pX, pZ);
      const distanceTo = v1.distanceTo(v2);

      if (distanceTo < 0.1) {
        coordRef.current = null;
        return null;
      }

      const normal = coordRef.current.clone().sub(position).normalize();
      mouseDownRef.current.isMoving = false;

      return normal;
    }
  };

  const mouseDownRef = useRef<any>({
    screenX: 0,
    screenY: 0,
    isMoving: false,
  });

  const handleRayUpEvent = (e: MouseEvent) => {
    if (
      e.screenX === mouseDownRef.current.screenX &&
      e.screenY === mouseDownRef.current.screenY
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
        mouseDownRef.current.isMoving = true;
        coordRef.current = intersection;
      }
    }
  };

  const hoverObjRef = useRef<any>();

  const handleRayHover = (e: MouseEvent) => {
    const mouse = new THREE.Vector2();
    mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;

    // 카메라와 연관된 광선 생성
    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(mouse, camera);

    // Raycaster를 사용하여 광선이 교차하는 모든 객체의 배열을 얻습니다.
    const obstacle = scene.children.filter((el) => el.name === "obstacle")[0];
    const intersects = raycaster.intersectObject(obstacle);

    if (intersects.length > 0) {
      hoverObjRef.current = obstacle.uuid;
      console.log(obstacle.uuid);
      const { obj } = getMeshObjects()[obstacle.uuid];
      console.log(obj);
      drawOutLine(scene, obj);
    } else {
      // hoverObjRef.current = undefined;
      const o = getMeshObjects()[obstacle.uuid];
      if (o?.outline) {
        removeOutLine(scene, o.outline);
      }
    }
  };

  const handleRayDownEvent = (e: MouseEvent) => {
    mouseDownRef.current = {
      ...mouseDownRef.current,
      screenX: e.screenX,
      screenY: e.screenY,
    };
  };

  const hoverObj = () => {
    return hoverObjRef.current;
  };

  return {
    chkIsArrived,
    handleRayUpEvent,
    handleRayDownEvent,
    handleRayHover,
    hoverObj,
  };
};
