import React, { useEffect, useState, useContext } from "react";
import { ThreeJsCtx } from "@/contexts/ThreeJsCtx";

export default () => {
  const { ctx } = useContext(ThreeJsCtx);
  const [activeBtn, setActiveBtn] = useState<string>("");
  const [number, setNumber] = useState<number>(-2.5);
  const handleOnKeyDown = (e: KeyboardEvent) => {
    setActiveBtn(e.key);
    ctx.move(e.key as "ArrowUp" | "ArrowDown" | "ArrowLeft" | "ArrowRight");
  };
  const handleOnKeyUp = (e: KeyboardEvent) => {
    setActiveBtn("");
  };

  //   useEffect(() => {
  //     if (activeBtn) {
  //       let id = setTimeout(() => {
  //         setActiveBtn("");
  //       }, 2000);
  //       return () => clearTimeout(id);
  //     }
  //   }, [activeBtn]);

  useEffect(() => {
    window.addEventListener("keydown", handleOnKeyDown);
    window.addEventListener("keyup", handleOnKeyUp);
    return () => {
      window.removeEventListener("keydown", handleOnKeyDown);
      window.removeEventListener("keyup", handleOnKeyUp);
    };
  }, []);
  return {
    activeBtn,
  };
};
