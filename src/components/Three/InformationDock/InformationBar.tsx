import React, { useContext, useEffect, useState } from "react";
import { InitContext } from "@/contexts/initContext";

import * as styles from "./InformationBar.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlay } from "@fortawesome/free-solid-svg-icons";
import { faPause } from "@fortawesome/free-solid-svg-icons";
const InformationBar: React.FC = () => {
  const { enemyWorker } = useContext(InitContext);
  // Life, Score, Round, START, PAUSE

  const [roundInfo, setRoundInfo] = useState<number>(1);
  const [enemyInfo, setEnemyInfo] = useState<any>([]);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  const getEvent = (e: any) => {
    const { data } = e;
    const { type } = data;
    if (type === "get_round_info") {
      const { round, info } = data;
      setIsPlaying(false);
      setRoundInfo(round);
      setEnemyInfo(info);
    }
  };

  useEffect(() => {
    enemyWorker.addEventListener("message", getEvent);
    return () => {
      enemyWorker.removeEventListener("message", getEvent);
    };
  }, []);

  return (
    <div className={styles["information-bar"]}>
      <div className={styles["bar-wrapper"]}>
        <div className={styles["life"]}>0</div>
        <div className={styles["round-info"]}>
          <div>
            <div>{roundInfo}</div>
            {!isPlaying && (
              <div
                className={styles["start"]}
                onClick={() => {
                  enemyWorker.postMessage({
                    command: "start",
                  });
                  setIsPlaying(true);
                }}
              >
                <FontAwesomeIcon icon={faPlay} />
              </div>
            )}

            {/* <div className={styles["pause"]}>
              <FontAwesomeIcon icon={faPause} />
            </div> */}
          </div>
          <div className={styles["enemies"]}>
            {enemyInfo.map((el: any) => {
              return (
                <div key={el.name} className={styles["enemy-info"]}>
                  <div>{el.name}</div>
                </div>
              );
            })}
          </div>
        </div>
        <div className={styles["score"]}></div>
      </div>
    </div>
  );
};
export default InformationBar;
