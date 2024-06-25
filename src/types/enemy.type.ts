export type RoundInfo = {
  [key: number]: {
    [key in SortOfEnemy]?: number;
  };
};

export type EnemyInfo = {
  [key in SortOfEnemy]: {
    [key in SortOfSpecification]: number;
  };
};

export type SortOfEnemy = "enemy0" | "enemy1" | "enemy2";
export type SortOfSpecification = "life" | "speed" | "delay" | "point";
