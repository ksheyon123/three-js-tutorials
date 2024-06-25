export default () => {
  const roundInfo: any = {
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

  const enemyInfo: any = {
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

    console.log(command);
    if (command === "get_round_info") {
      const d = Object.keys(roundInfo[ROUND]).map((el) => {
        return {
          name: el,
          count: roundInfo[ROUND][el],
          life: enemyInfo[el].life,
        };
      });
      self.postMessage({
        type: "get_round_info",
        round: ROUND,
        info: d,
      });
    }

    if (command === "game_start") {
      Object.keys(roundInfo[ROUND]).map((enemy) => {
        const timerId = setInterval(() => {
          --roundInfo[ROUND][enemy];

          // 해당 enemy의 수가 0이 되면 Timer를 해제합니다.
          if (roundInfo[ROUND][enemy] === 0) {
            clearInterval(timerId);
            if (Object.values(roundInfo[ROUND]).every((el) => el === 0)) {
              ROUND++;
            }
          }
          // 적의 사양에 따라서 주기적으로 생성 이벤트를 전달합니다.
          self.postMessage({
            type: "game_start",
            life: enemyInfo[enemy].life,
            speed: enemyInfo[enemy].speed,
          });
        }, enemyInfo[enemy].delay);
      });
    }

    if (command === "game_end") {
      if (!!roundInfo[ROUND]) {
        const d = Object.keys(roundInfo[ROUND]).map((el) => {
          return {
            name: el,
            count: roundInfo[ROUND][el],
            life: enemyInfo[el].life,
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
