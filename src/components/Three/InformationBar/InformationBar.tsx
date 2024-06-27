import React, { useContext, useEffect, useState } from "react";
import { InitContext } from "@/contexts/initContext";

import * as styles from "./InformationBar.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlay } from "@fortawesome/free-solid-svg-icons";
import { faPause } from "@fortawesome/free-solid-svg-icons";
import { PlayerContext } from "@/contexts/PlayerContext";
import { COMMAND } from "@/constants/command";
const InformationBar: React.FC = () => {
  const { enemyWorker } = useContext(InitContext);
  const { life, point } = useContext(PlayerContext);
  // Life, Score, Round, START, PAUSE

  const [roundInfo, setRoundInfo] = useState<number>(1);
  const [enemyInfo, setEnemyInfo] = useState<any>([]);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  const getEnemyEvent = (e: any) => {
    const { data } = e;
    const { command } = data;
    if (command === COMMAND.GET_ROUND_INFO) {
      const { round, info } = data;
      setIsPlaying(false);
      setRoundInfo(round);
      setEnemyInfo(info);
    }
  };

  useEffect(() => {
    enemyWorker.addEventListener("message", getEnemyEvent);
    return () => {
      enemyWorker.removeEventListener("message", getEnemyEvent);
    };
  }, []);

  return (
    <div className={styles["information-bar"]}>
      <div className={styles["bar-wrapper"]}>
        <div className={styles["life"]}>{life}</div>
        <div className={styles["round-info"]}>
          <div>
            <div>{roundInfo}</div>
            {!isPlaying && (
              <div
                className={styles["start"]}
                onClick={() => {
                  enemyWorker.postMessage({
                    command: COMMAND.GAME_START,
                  });
                  setIsPlaying(true);
                }}
              >
                <FontAwesomeIcon icon={faPlay} />
              </div>
            )}
          </div>
          <div className={styles["enemies"]}>
            {enemyInfo.map((el: any) => {
              return (
                <div key={el.name} className={styles["enemy-info"]}>
                  <div>Enemy Name : {el.name}</div>
                  <div>Left : {el.count}</div>
                </div>
              );
            })}
          </div>
        </div>
        <div className={styles["score"]}>{point}</div>
      </div>
    </div>
  );
};
export default InformationBar;
