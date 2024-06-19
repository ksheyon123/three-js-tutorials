type TurretInfo = {
  [key in SortOfTurret]?: {
    [key in SortOfSpecification]: number;
  };
};
type TurretUpgrade = {
  [key in SortOfTurret]?: any;
};

type UpgradeCommand = {
  turret: SortOfTurret;
  upgradeType: SortOfUpgrade;
};

type InstallCommand = {
  turret: SortOfTurret;
};

type SortOfTurret = "basic" | "penetration" | "splash";
type SortOfUpgrade = "dmglv" | "spdlv" | "delaylv";
type SortOfSpecification = "damage" | "speed" | "delay";

export default () => {
  let TURRET_SPEC: TurretInfo = {
    basic: {
      damage: 1,
      speed: 3,
      delay: 100,
    },
    penetration: {
      damage: 1,
      speed: 5,
      delay: 500,
    },
    splash: {
      damage: 1,
      speed: 5,
      delay: 500,
    },
  };

  let TURRET_GRADE: TurretUpgrade = {
    basic: {
      dmglv: {
        grade: 1,
        percent: 30,
      }, // 30% 증가
      spdlv: {
        grade: 1,
        percent: 20,
      }, // 20% 증가
      delaylv: {
        grade: 1,
        percent: -5,
      }, // 5% 감소
    },
  };

  let myTurret = {};

  let timerIds: { [key: string]: any } = {};

  self.onmessage = (e) => {
    const { data } = e;
    const { command, props } = data;
    if (command === "install") {
      const { turret } = props as InstallCommand;
      const timerId = fire(turret);

      const newObj = {
        [turret]: timerId,
      };
      timerIds = Object.assign({}, newObj, timerIds);
    }

    if (command === "upgrade") {
      const { turret, upgradeType } = props as UpgradeCommand;
      ++TURRET_GRADE[turret][upgradeType].grade;

      const weighted = Math.pow(
        (100 + TURRET_GRADE[turret][upgradeType].percent) / 100,
        TURRET_GRADE[turret][upgradeType].grade
      );
      console.log(weighted);
      if (upgradeType === "dmglv") {
        TURRET_SPEC[turret].damage = TURRET_SPEC[turret].damage * weighted;
      }

      if (upgradeType === "spdlv") {
        TURRET_SPEC[turret].speed = TURRET_SPEC[turret].speed * weighted;
      }

      if (upgradeType === "delaylv") {
        TURRET_SPEC[turret].delay = TURRET_SPEC[turret].delay * weighted;
      }

      clearInterval(timerIds[turret]);
      const timerId = fire(turret);
      const newObj = {
        [turret]: timerId,
      };
      Object.assign(timerIds, newObj, timerIds);
    }

    if (data.command === "rockOn") {
    }
  };

  const fire = (turret: SortOfTurret) => {
    console.log(TURRET_SPEC[turret].delay);
    self.postMessage({
      damage: TURRET_SPEC[turret].damage,
      speed: TURRET_SPEC[turret].speed,
    });
    const timerId = setInterval(() => {
      self.postMessage({
        damage: TURRET_SPEC[turret].damage,
        speed: TURRET_SPEC[turret].speed,
      });
    }, TURRET_SPEC[turret].delay);
    return timerId;
  };
};
