import { useRef } from "react";

type KeyState = {
  [key: string]: boolean;
};

type ObjectState = {
  vel: number;
  g: number;
  jVel: number;
  isJumping: boolean;
};

export const useMove = () => {
  const hz = 1 / 60;
  const vel = 3;
  const jVel = 5;
  const g = 9.8;
  const objectStateRef = useRef<ObjectState>({
    vel,
    g,
    jVel,
    isJumping: false,
  });
  const keyStateRef = useRef<KeyState>({
    W: false,
    S: false,
    D: false,
    A: false,
  });

  const keyDownEventHandler = (e: KeyboardEvent) => {
    const code = e.code;
    keyStateRef.current = {
      ...keyStateRef.current,
      [code]: true,
    };
    if (code === "Space" && !objectStateRef.current.isJumping) {
      objectStateRef.current.jVel = jVel;
      objectStateRef.current.isJumping = true;
    }
  };
  const keyUpEventHandler = (e: KeyboardEvent) => {
    const code = e.code;
    keyStateRef.current = {
      ...keyStateRef.current,
      [code]: false,
    };
  };

  const calJumpVelocity = () => {
    const { jVel } = objectStateRef.current;
    objectStateRef.current.jVel = jVel - g * hz;
  };

  const movement = () => {};

  const gravity = () => {};

  return {};
};
