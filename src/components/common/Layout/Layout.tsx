import React, { ReactNode } from "react";
import { layout } from "./Layout.module.css";

interface IProps {
  children: ReactNode;
}

const Layout: React.FC<IProps> = ({ children }) => {
  return <main className={layout}>{children}</main>;
};

export { Layout };
