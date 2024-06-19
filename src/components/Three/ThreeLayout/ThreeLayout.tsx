import React, { useContext, useEffect } from "react";
import { Outlet } from "react-router-dom";

import FunctionBox from "@/components/Three/FunctionBox/FunctionBox";

import * as styles from "./ThreeLayout.module.css";
import { InitContext } from "@/contexts/initContext";
import { ModalContext } from "@/contexts/ModalContext";

const ThreeLayout: React.FC = () => {
  const { enemyWorker } = useContext(InitContext);
  const { toggleModal } = useContext(ModalContext);

  useEffect(() => {
    toggleModal({
      buttons: [
        {
          name: "시작",
          onClick: () => {
            enemyWorker.postMessage({
              command: "start",
            });
            toggleModal();
          },
        },
      ],
    });
  }, []);

  return (
    <div className={styles.layout}>
      <FunctionBox />
      <Outlet />
    </div>
  );
};

export default ThreeLayout;
