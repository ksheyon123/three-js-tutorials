import React from "react";
import { Outlet } from "react-router-dom";

import FunctionBox from "@/components/Three/FunctionBox/FunctionBox";

import * as styles from "./ThreeLayout.module.css";

const ThreeLayout: React.FC = () => {
  return (
    <div className={styles.layout}>
      <FunctionBox />
      <Outlet />
    </div>
  );
};

export default ThreeLayout;
