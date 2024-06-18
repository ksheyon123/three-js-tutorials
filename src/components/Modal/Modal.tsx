import React, { ReactNode } from "react";
import * as styles from "./Modal.module.css";

interface IProps {
  title?: ReactNode;
  content?: ReactNode;
  buttons: ReactNode[];
}

const Modal: React.FC<IProps> = ({ title, content, buttons }) => {
  return (
    <div className={styles["modal-wrapper"]}>
      <div className={styles["modal"]}>
        {!!title && <div className={styles["modal-title"]}>{title}</div>}
        {!!content && <div className={styles["modal-content"]}></div>}
        <div className={styles["modal-buttons"]}>
          {buttons.map((el: any) => {
            const { onClick, name } = el;
            return (
              <button
                className={styles["modal-button"]}
                onClick={() => onClick()}
                {...el}
              >
                {name}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Modal;
