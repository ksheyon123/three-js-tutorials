import React, { useContext, useState } from "react";
import { InitContext } from "@/contexts/initContext";

import * as styles from "./FunctionBox.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronRight,
  faChevronLeft,
} from "@fortawesome/free-solid-svg-icons";
import { ModalContext } from "@/contexts/ModalContext";
import { useBullet } from "@/hooks/useBullet";

const FunctionBox: React.FC = () => {
  const { scene, worker } = useContext(InitContext);
  const { createBullet } = useBullet(scene);
  const { toggleModal } = useContext(ModalContext);

  const [isOpen, setIsOpen] = useState<boolean>(false);
  const toggler = () => {
    setIsOpen((prev) => !prev);
  };

  const turrets = [
    {
      onClick: () => {
        worker.postMessage({
          key: "turretInstall",
          spec: {
            type: "basic",
            damage: 1,
            speed: 3,
            delay: 500,
          },
        });
        toggleModal();
      },
      name: "기본",
    },
    {
      onClick: () => {
        worker.postMessage({
          key: "turretInstall",
          spec: {
            type: "basic",
            damage: 1,
            speed: 3,
            delay: 1000,
            color: 0xff0000,
          },
        });
        toggleModal();
      },
      name: "관통",
    },
    {
      onClick: () => {},
      name: "스플래쉬",
    },
  ];

  return (
    <div className={styles.functionbox} onClick={() => toggler()}>
      {isOpen && (
        <div className={styles["box-items"]}>
          <div className={styles["toggle-btn-r"]}>
            <FontAwesomeIcon
              style={{ width: 20, height: 40 }}
              icon={faChevronRight}
            />
          </div>

          <div
            className={styles["box-item"]}
            onClick={() =>
              toggleModal({
                title: "업그레이드 하시겠습니까?",
                buttons: [
                  { onClick: () => toggleModal(), name: "취소" },
                  { onClick: () => toggleModal(), name: "확인" },
                ],
              })
            }
          >
            기본
          </div>
          {turrets.map(({ onClick, name }) => {
            return (
              <div
                className={styles["box-item"]}
                onClick={() =>
                  toggleModal({
                    title: "설치하시겠습니까?",
                    buttons: [
                      { onClick: () => toggleModal(), name: "취소" },
                      { onClick: () => onClick(), name: "확인" },
                    ],
                  })
                }
              >
                {name}
              </div>
            );
          })}
        </div>
      )}
      {!isOpen && (
        <div className={styles["toggle-btn-l"]}>
          <FontAwesomeIcon
            style={{ width: 20, height: 40 }}
            icon={faChevronLeft}
          />
        </div>
      )}
    </div>
  );
};

export default FunctionBox;
