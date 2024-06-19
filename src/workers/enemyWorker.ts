export default () => {
  const roundInfo: any = {
    [1]: {
      enemy0: 10,
    },
    [2]: {
      enemy0: 10,
      enemy1: 5,
    },
  };

  const enemyInfo: any = {
    enemy0: {
      life: 1,
      speed: 3,
      delay: 500,
    },
    enemy1: {
      life: 1,
      speed: 5,
      delay: 1500,
    },
  };

  let ROUND = 1;
  self.onmessage = (e) => {
    const { data } = e;
    const { command, props } = data;
    if (command === "start") {
      let isOngoing: boolean = false;
      Object.keys(roundInfo[ROUND]).map((el) => {
        const enemy = el; // enemy0, enemy1
        const timerId = setInterval(() => {
          --roundInfo[ROUND][enemy];

          if (roundInfo[ROUND][enemy] === 0) {
            clearInterval(timerId);
            if (Object.values(roundInfo[ROUND]).every((el) => el === 0)) {
              ROUND++;
            }
          }
          self.postMessage({
            life: enemyInfo[enemy].life,
            speed: enemyInfo[enemy].speed,
          });
        }, enemyInfo[enemy].delay);
      });
    }

    if (command === "pause") {
    }
  };
};
