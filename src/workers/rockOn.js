export default () => {
  const TURRET_SPEC = {
    basic: {
      damage: 1,
      speed: 3,
      delay: 500,
    },
    penestration: {
      damage: 1,
      speed: 5,
      delay: 500,
    },
  };

  const TURRET_GRADE = {
    basic: {
      dmglv: 1, // 30% 증가
      spdlv: 1, // 20% 증가
      delay: 1, // 10% 감소
    },
  };

  try {
    let enemies = [];
    var timerIds = {};
    self.onmessage = (e) => {
      const { data } = e;
      if (data.key === "upgrade") {
        const { key, type } = data;
        TURRET_GRADE[key][type]++;
      }

      if (data.key === "install") {
        const { type, damage, speed, delay, color } = data.spec;
        self.postMessage({ damage, speed });
        const timerId = setInterval(() => {
          self.postMessage({ damage, speed, color });
        }, delay);
        timerIds = {
          ...timerIds,
          [type]: timerId,
        };
      }

      if (data.key === "rockOn") {
        self.postMessage({ key: "rockOn", data: enemies });
      }
    };
  } catch (e) {
    console.error(e);
  }
};
