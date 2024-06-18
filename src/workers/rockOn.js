export default () => {
  try {
    let enemies = [];
    let timerIds = {};
    self.onmessage = (e) => {
      console.log("Trigger", e);
      const { data } = e;
      if (data.key === "update") {
        const { id } = data;
        enemies.push(id);
      }

      if (data.key === "turretInstall") {
        const { type, damage, speed, delay, color } = data.spec;
        console.log("SPEC : ", data.spec);
        // postMessage({ damage, speed });
        const timerId = setInterval(() => {
          self.postMessage({ damage, speed, color });
        }, delay);
        // timerIds = {
        //   ...timerIds,
        //   [type]: timerId,
        // };
      }

      if (data.key === "rockOn") {
        self.postMessage({ key: "rockOn", data: enemies });
      }
    };
  } catch (e) {
    console.error(e);
  }
};
