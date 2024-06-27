import React, { useContext, useEffect } from "react";
import { Outlet } from "react-router-dom";

import FunctionBox from "@/components/Three/FunctionBox/FunctionBox";

import * as styles from "./ThreeLayout.module.css";
import { InitContext } from "@/contexts/initContext";
import { ModalContext } from "@/contexts/ModalContext";
import InformationBar from "../InformationBar/InformationBar";
import { COMMAND } from "@/constants/command";

const ThreeLayout: React.FC = () => {
  const { enemyWorker, turretWorker } = useContext(InitContext);
  const { toggleModal } = useContext(ModalContext);

  useEffect(() => {
    toggleModal({
      buttons: [
        {
          name: "시작",
          onClick: () => {
            enemyWorker.postMessage({
              command: COMMAND.GET_ROUND_INFO,
            });
            turretWorker.postMessage({
              command: COMMAND.GET_TURRET_INFO,
            });
            toggleModal();
          },
        },
      ],
    });
  }, []);

  return (
    <div className={styles.layout}>
      <InformationBar />
      <FunctionBox />
      <Outlet />
    </div>
  );
};

export default ThreeLayout;
