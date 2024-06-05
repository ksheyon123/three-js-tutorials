import React, { ReactNode } from "react";
import * as styles from "./Layout.module.css";
import { RNB } from "@/components/pageComponent/Space/RNB/RNB";

interface IProps {
  children: ReactNode;
}

const Layout: React.FC<IProps> = ({ children }) => {
  return (
    <div className={styles.layout}>
      <RNB />
      <div>{children}</div>
    </div>
  );
};

export default Layout;
