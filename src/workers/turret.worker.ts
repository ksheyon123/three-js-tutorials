import {
  TurretInfo,
  TurretUpgrade,
  SortOfTurret,
  InstallCommand,
  UpgradeCommand,
  TurretPurchase,
} from "@/types/turret.type";

export default () => {
  let TURRET_SPEC: TurretInfo = {
    basic: {
      damage: 1,
      speed: 3,
      delay: 1000,
      price: 10,
    },
    penetration: {
      damage: 1,
      speed: 5,
      delay: 500,
      price: 15,
    },
    splash: {
      damage: 1,
      speed: 5,
      delay: 500,
      price: 25,
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
    console.log(command);
    if (command === "turret_info") {
      const products: TurretPurchase[] = Object.keys(TURRET_SPEC).map(
        (key: SortOfTurret) => ({
          type: key,
          price: TURRET_SPEC[key].price,
        })
      );
      console.log(products);
      self.postMessage({
        key: "turret_info",
        list: products,
      });
    }

    if (command === "turret_install") {
      const { turret } = props as InstallCommand;
      const timerId = fire(turret);

      const newObj = {
        [turret]: timerId,
      };
      timerIds = Object.assign(timerIds, newObj, timerIds);
    }

    if (command === "turret_upgrade") {
      const { turret, upgradeType } = props as UpgradeCommand;
      ++TURRET_GRADE[turret][upgradeType].grade;

      const weighted = Math.pow(
        (100 + TURRET_GRADE[turret][upgradeType].percent) / 100,
        TURRET_GRADE[turret][upgradeType].grade
      );
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
  };

  const fire = (turret: SortOfTurret) => {
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
