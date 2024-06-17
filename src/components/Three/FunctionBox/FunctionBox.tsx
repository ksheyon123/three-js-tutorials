import React, { useContext, useState } from "react";
import { InitContext } from "@/contexts/initContext";

import * as styles from "./FunctionBox.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronRight,
  faChevronLeft,
} from "@fortawesome/free-solid-svg-icons";
const FunctionBox: React.FC = () => {
  const { scene } = useContext(InitContext);

  const [isOpen, setIsOpen] = useState<boolean>(false);
  const toggler = () => {
    setIsOpen((prev) => !prev);
  };

  return (
    <div className={styles.functionbox} onClick={() => toggler()}>
      {isOpen && (
        <div className="box-items">
          <div className="box-item">aa</div>
          <div className="box-item">a</div>
          <div className="box-item">a</div>
        </div>
      )}
      {!isOpen && (
        <div className="drawer">
          <FontAwesomeIcon icon={faChevronRight} />
        </div>
      )}
    </div>
  );
};

export default FunctionBox;
