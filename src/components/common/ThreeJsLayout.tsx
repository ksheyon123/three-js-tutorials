import React from "react";
import { Outlet } from "react-router-dom";

const ThreeJsLayout: React.FC = () => {
  return (
    <div>
      <Outlet />
    </div>
  );
};

export default ThreeJsLayout;
