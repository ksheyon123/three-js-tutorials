import React from "react";
import { Outlet } from "react-router-dom";

import * as styles from "./ThreeLayout.module.css";

const ThreeLayout: React.FC = () => {
  return (
    <div className={styles.layout}>
      <Outlet />
    </div>
  );
};

export default ThreeLayout;
