type RoundInfo = {
  [key: number]: {
    [key in SortOfEnemy]?: number;
  };
};

type EnemyInfo = {
  [key in SortOfEnemy]: {
    [key in SortOfSpecification]: number;
  };
};

type SortOfEnemy = "enemy0" | "enemy1" | "enemy2";
type SortOfSpecification = "life" | "speed" | "delay" | "point";
export default () => {
  const roundInfo: RoundInfo = {
    1: {
      enemy0: 10,
    },
    2: {
      enemy0: 10,
      enemy1: 5,
    },
    3: {
      enemy0: 15,
      enemy1: 3,
      enemy2: 2,
    },
  };

  const enemyInfo: EnemyInfo = {
    enemy0: {
      life: 1,
      speed: 3,
      delay: 1000,
      point: 1,
    },
    enemy1: {
      life: 1,
      speed: 5,
      delay: 1500,
      point: 2,
    },
    enemy2: {
      life: 3,
      speed: 2,
      delay: 800,
      point: 3,
    },
  };

  let ROUND = 1;

  self.onmessage = (e) => {
    const { data } = e;
    const { command, props } = data;

    if (command === "get_round_info") {
      const d = Object.keys(roundInfo[ROUND]).map((key: SortOfEnemy) => {
        return {
          name: key,
          count: roundInfo[ROUND][key],
          life: enemyInfo[key].life,
        };
      });
      self.postMessage({
        type: "get_round_info",
        round: ROUND,
        info: d,
      });
    }

    if (command === "game_start") {
      Object.keys(roundInfo[ROUND]).map((key: SortOfEnemy) => {
        const timerId = setInterval(() => {
          --roundInfo[ROUND][key];

          // 해당 enemy의 수가 0이 되면 Timer를 해제합니다.
          if (roundInfo[ROUND][key] === 0) {
            clearInterval(timerId);
            if (Object.values(roundInfo[ROUND]).every((el) => el === 0)) {
              ROUND++;
            }
          }
          // 적의 사양에 따라서 주기적으로 생성 이벤트를 전달합니다.
          self.postMessage({
            type: "game_start",
            life: enemyInfo[key].life,
            speed: enemyInfo[key].speed,
            point: enemyInfo[key].point,
          });
        }, enemyInfo[key].delay);
      });
    }

    if (command === "game_end") {
      if (!!roundInfo[ROUND]) {
        const d = Object.keys(roundInfo[ROUND]).map((key: SortOfEnemy) => {
          return {
            name: key,
            count: roundInfo[ROUND][key],
            life: enemyInfo[key].life,
          };
        });
        self.postMessage({
          type: "get_round_info",
          round: ROUND,
          info: d,
        });
      }
    }
  };
};
