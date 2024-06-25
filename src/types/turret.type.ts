export type TurretInfo = {
  [key in SortOfTurret]?: {
    [key in SortOfSpecification]: number;
  };
};

export type TurretPurchase = {
  type: SortOfTurret;
  price: number;
};

export type TurretUpgrade = {
  [key in SortOfTurret]?: any;
};

export type UpgradeCommand = {
  turret: SortOfTurret;
  upgradeType: SortOfUpgrade;
};

export type InstallCommand = {
  turret: SortOfTurret;
};

export type SortOfTurret = "basic" | "penetration" | "splash";
export type SortOfUpgrade = "dmglv" | "spdlv" | "delaylv";
export type SortOfSpecification = "damage" | "speed" | "delay" | "price";
