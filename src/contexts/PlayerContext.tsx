import React, { ReactNode, createContext, useEffect, useState } from "react";

interface IProps {
  children: ReactNode;
}

type ContextType = {
  point: number;
  life: number;
  reduceLife: Function;
  increasePoint: Function;
};

export const PlayerContext = createContext<ContextType>({
  point: 0,
  life: 0,
  reduceLife: () => {},
  increasePoint: () => {},
});

export const PlayerProvider: React.FC<IProps> = ({ children }) => {
  const [point, setPoint] = useState<number>(0);
  const [life, setLife] = useState<number>(10);

  useEffect(() => {}, []);

  const reduceLife = () => {
    console.log("REDUCE LIFE!");
    setLife((prev) => prev - 1);
  };

  const increasePoint = (point: number) => {
    console.log("ENEMY ELIMINATED!");
    setPoint((prev) => point + prev);
  };

  const purchase = () => {};

  return (
    <PlayerContext.Provider
      value={{
        point,
        life,
        reduceLife,
        increasePoint,
      }}
    >
      {children}
    </PlayerContext.Provider>
  );
};
