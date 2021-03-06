/* eslint-disable-next-line no-unused-vars */
const SPRITE = {
  KNIGHT: { xStart: 0, xEnd: 15, yStart: 0, yEnd: 16 },
  KNIGHT_ATTACKING: { xStart: 32, xEnd: 46, yStart: 0, yEnd: 16 },
  GOBLIN: { xStart: 15, xEnd: 22, yStart: 0, yEnd: 16 },
  BACKGROUND: { xStart: 22, xEnd: 23, yStart: 0, yEnd: 16 },
  GOLD: { xStart: 23, xEnd: 32, yStart: 0, yEnd: 16 },
  TREASURE: { xStart: 46, xEnd: 53, yStart: 0, yEnd: 16 },
  BIRD: { xStart: 53, xEnd: 62, yStart: 0, yEnd: 16 },
};

/* eslint-disable-next-line no-unused-vars */
const RULES = {
  ENEMY_LIMIT: 8,
  ENEMY_SPAWN_TIMER: 1500,
  NUMBER_OF_TILES: 128,
  COMBAT_BAR_HEIGHT: 64,
  COMBAT_BAR_WIDTH: 1280,
  EQUIPMENT_PANEL_PADDING_SIZE: 20,
  EQUIPMENT_PANEL_SIZE: 435,
  INVENTORY_CELL_WIDTH: 64,
  INVENTORY_CELL_HEIGHT: 64,
  INVENTORY_WIDTH: 10,
  INVENTORY_HEIGHT: 6,
  INVENTORY_PADDING_SIZE: 20,
  PLAYER_STARTING_POSITION: 50,
  PLAYER_WIDTH: 50,
  ITEM_DESCRIPTION_WIDTH: 640,
  ITEM_DESCRIPTION_HEIGHT: 200,
  ITEM_DESCRIPTION_PADDING: 20,
  HISTOGRAM_MAX_BARS: 16,
};

/* eslint-disable-next-line no-unused-vars */
const ZONES = {
  COUNTRYSIDE: {
    xEnd: 10000,
    getEnemy: () => {
      if (Math.random() > 0.8) {
        return Bird;
      }
      return Goblin;
    },
  },
  KINGS_FOREST: { xEnd: 20000, getEnemy: () => Goblin },
  LOWLANDS: { xEnd: 30000, getEnemy: () => Goblin },
  MOUNTAIN: { xEnd: 40000, getEnemy: () => Goblin },
  FARMLAND: { xEnd: 50000, getEnemy: () => Goblin },
  PRINCES_CASTLE: { xEnd: 60000, getEnemy: () => Goblin },
  FINAL_BATTLE: { xEnd: 70000, getEnemy: () => Goblin },
};

/* eslint-disable-next-line no-unused-vars */
const SLOTS = {
  HAND_PRIMARY: {
    xStart: 726,
    xEnd: 827,
    yStart: 160,
    yEnd: 372,
  },
  HAND_SECONDARY: {
    xStart: 1135,
    xEnd: 1224,
    yStart: 160,
    yEnd: 372,
  },
  HEAD: {
    xStart: 933,
    xEnd: 1026,
    yStart: 124,
    yEnd: 224,
  },
  BODY: {
    xStart: 933,
    xEnd: 1026,
    yStart: 260,
    yEnd: 413,
  },
  BELT: {
    xStart: 933,
    xEnd: 1026,
    yStart: 450,
    yEnd: 496,
  },
  RING_PRIMARY: {
    xStart: 861,
    xEnd: 904,
    yStart: 448,
    yEnd: 496,
  },
  RING_SECONDARY: {
    xStart: 1056,
    xEnd: 1099,
    yStart: 448,
    yEnd: 496,
  },
  AMULET: {
    xStart: 1056,
    xEnd: 1099,
    yStart: 173,
    yEnd: 227,
  },
  BOOTS: {
    xStart: 1135,
    xEnd: 1224,
    yStart: 401,
    yEnd: 510,
  },
  GLOVES: {
    xStart: 726,
    xEnd: 827,
    yStart: 401,
    yEnd: 510,
  },
};
