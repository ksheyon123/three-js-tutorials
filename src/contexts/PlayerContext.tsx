import React, {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { InitContext } from "./initContext";
import { SortOfTurret } from "@/types/turret.type";

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
  const { turretWorker } = useContext(InitContext);
  const [point, setPoint] = useState<number>(0);
  const [life, setLife] = useState<number>(10);
  const [turretInfo, setTurretInfo] = useState<any>();

  const getEnemyInfo = (e: any) => {
    const { data } = e;
    const { command } = data;
    if (command === "turret_info") {
      const { list } = data;
      console.log(list);
    }
  };

  useEffect(() => {
    turretWorker.addEventListener("message", getEnemyInfo);
    return () => turretWorker.removeEventListener("message", getEnemyInfo);
  }, []);

  const reduceLife = () => {
    console.log("REDUCE LIFE!");
    setLife((prev) => prev - 1);
  };

  const increasePoint = (point: number) => {
    console.log("ENEMY ELIMINATED!");
    setPoint((prev) => point + prev);
  };

  const purchase = (type: SortOfTurret) => {};

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
