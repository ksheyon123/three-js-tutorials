import React, { useContext, useEffect, useState } from "react";
import { InitContext } from "@/contexts/initContext";

import * as styles from "./FunctionBox.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronRight,
  faChevronLeft,
} from "@fortawesome/free-solid-svg-icons";
import { ModalContext } from "@/contexts/ModalContext";

const FunctionBox: React.FC = () => {
  const { turretWorker } = useContext(InitContext);
  const { toggleModal } = useContext(ModalContext);

  const [isOpen, setIsOpen] = useState<boolean>(false);
  const toggler = () => {
    setIsOpen((prev) => !prev);
  };

  const install = (turret: string) => {
    turretWorker.postMessage({
      command: "turret_install",
      props: { turret },
    });
  };

  const upgrade = (turret: string) => {
    turretWorker.postMessage({
      command: "turret_upgrade",
      props: { turret, upgradeType: "delaylv" },
    });
  };

  const turrets = [
    {
      name: "기본",
    },
    {
      name: "관통",
    },
    {
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
          {turrets.map(({ name }) => {
            return (
              <div
                className={styles["box-item"]}
                onClick={() =>
                  toggleModal({
                    title: "설치하시겠습니까?",
                    buttons: [
                      {
                        onClick: () => {
                          install("basic");
                          toggleModal();
                        },
                        name: "확인",
                      },
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
