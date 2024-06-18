import React, { useContext, useState } from "react";
import { InitContext } from "@/contexts/initContext";

import * as styles from "./FunctionBox.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronRight,
  faChevronLeft,
} from "@fortawesome/free-solid-svg-icons";
import { ModalContext } from "@/contexts/ModalContext";
const FunctionBox: React.FC = () => {
  const { scene } = useContext(InitContext);
  const { toggleModal } = useContext(ModalContext);

  const [isOpen, setIsOpen] = useState<boolean>(false);
  const toggler = () => {
    setIsOpen((prev) => !prev);
  };

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
                title: "설치하시겠습니까?",
                buttons: [
                  { onClick: () => toggleModal(), name: "취소" },
                  { onClick: () => toggleModal(), name: "확인" },
                ],
              })
            }
          >
            aa
          </div>
          <div className={styles["box-item"]}>a</div>
          <div className={styles["box-item"]}>a</div>
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
