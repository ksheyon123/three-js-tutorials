import { COMMAND } from "@/constants/index";

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
    },
    enemy1: {
      life: 1,
      speed: 5,
      delay: 1500,
    },
    enemy2: {
      life: 3,
      speed: 2,
      delay: 800,
    },
  };

  let ROUND = 1;

  self.onmessage = (e) => {
    const { data } = e;
    const { command, props } = data;

    if (command === COMMAND.getRoundInfo) {
      const d = Object.keys(roundInfo[ROUND]).map((el) => {
        return {
          name: el,
          count: roundInfo[ROUND][el],
          life: enemyInfo[el].life,
        };
      });
      self.postMessage({
        type: COMMAND.getRoundInfo,
        round: ROUND,
        info: d,
      });
    }

    if (command === COMMAND.gameStart) {
      Object.keys(roundInfo[ROUND]).map((enemy) => {
        const timerId = setInterval(() => {
          --roundInfo[ROUND][enemy];

          if (roundInfo[ROUND][enemy] === 0) {
            clearInterval(timerId);
            if (Object.values(roundInfo[ROUND]).every((el) => el === 0)) {
              ROUND++;
            }
          }
          self.postMessage({
            type: COMMAND.gameStart,
            life: enemyInfo[enemy].life,
            speed: enemyInfo[enemy].speed,
          });
        }, enemyInfo[enemy].delay);
      });
    }

    if (command === COMMAND.gameEnd) {
      if (!!roundInfo[ROUND]) {
        const d = Object.keys(roundInfo[ROUND]).map((el) => {
          return {
            name: el,
            count: roundInfo[ROUND][el],
            life: enemyInfo[el].life,
          };
        });
        self.postMessage({
          type: COMMAND.getRoundInfo,
          round: ROUND,
          info: d,
        });
      }
    }
  };
};
