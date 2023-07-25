import React, { useEffect } from "react";
import { renderer } from "@/contexts/renderer";

interface IProps {
  size: { x: number; y: number };
}

const ThreeJs: React.FC = ({ size }: IProps) => {
  const { x, y } = size;
  renderer.setSize;

  return <div className="obj"></div>;
};

export { ThreeJs };
