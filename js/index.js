window.images = {
  spritesheet: new Image(),
  gear: new Image(),
  broadsword: new Image(),
  shortsword: new Image(),
  longbow: new Image(),
  dagger: new Image(),
  ring: new Image(),
};

const equippedWeapon = new Dagger(null, null, SLOTS.HAND_PRIMARY);
window.game = {
  enemies: [new Goblin(190)],
  droppedGold: [new Gold(640, 1)],
  droppedLoot: [],
  player: new Player(10, SPRITE.KNIGHT),
  inventory: new Inventory([equippedWeapon, new Longbow(0, 0)]),
  description: new Description(equippedWeapon),
  dragging: null,
};

window.images.spritesheet.src = 'assets/spritesheet.png';
window.images.gear.src = 'assets/gear.png';
window.images.ring.src = 'assets/ring.png';
window.images.longbow.src = 'assets/longbow.png';
window.images.shortsword.src = 'assets/shortsword.png';
window.images.broadsword.src = 'assets/broadsword.png';
window.images.dagger.src = 'assets/angle-dagger.png';

// eslint-disable-next-line no-unused-vars
function logWarning(message) {
  // eslint-disable-next-line no-console
  console.warn(message);
}

window.getDraggableBoundary = () => ({
  xStart: 0,
  xEnd: window.canvas.width,
  yStart: RULES.COMBAT_BAR_HEIGHT,
  yEnd:
    RULES.COMBAT_BAR_HEIGHT + RULES.EQUIPMENT_PANEL_PADDING_SIZE * 2 + RULES.EQUIPMENT_PANEL_SIZE,
});

window.drawSprite = (sprite, x, width, height, textOverlay) => {
  window.ctx.drawImage(
    window.images.spritesheet,
    sprite.xStart,
    sprite.yStart,
    sprite.xEnd - sprite.xStart,
    sprite.yEnd - sprite.yStart,
    x,
    RULES.COMBAT_BAR_HEIGHT - height,
    width,
    height,
  );
  if (textOverlay !== undefined) {
    window.ctx.font = '10px serif';
    window.ctx.fillStyle = 'orange';
    window.ctx.fillText(textOverlay, x, RULES.COMBAT_BAR_HEIGHT - 10, width);
  }
};

const fight = (time) => {
  window.game.player.attack(time);
  window.game.enemies.forEach((e) => {
    e.attack(time);
  });
};

const checkGameEnd = () => window.game.player.hp <= 0;

const moveEnemies = (time) => {
  window.game.enemies.forEach((e) => {
    e.move(time);
  });
};

const drawEnemies = () => {
  window.game.enemies.forEach((e) => {
    e.draw();
  });
};

const drawLoot = () => {
  window.game.droppedGold.forEach((g) => {
    g.draw();
  });
  window.game.droppedLoot.forEach((l) => {
    l.draw();
  });
};

let lastSpawn = 0;

const spawnEnemies = (time) => {
  if (time - lastSpawn < RULES.ENEMY_SPAWN_TIMER) {
    return;
  }
  if (window.game.enemies.length < RULES.ENEMY_LIMIT) {
    lastSpawn = time;
    const spawnLocation =
      window.game.player.x + RULES.COMBAT_BAR_WIDTH - RULES.PLAYER_STARTING_POSITION;

    const zone = Object.keys(ZONES).find((z) => spawnLocation < ZONES[z].xEnd);

    window.game.enemies.push(new (ZONES[zone].getEnemy())(spawnLocation));
  }
};

const drawBackground = () => {
  const startingLine = window.game.player.x - RULES.PLAYER_STARTING_POSITION;
  window.ctx.imageSmoothingEnabled = true;
  window.ctx.globalAlpha = 0.3;
  for (let i = 0; i < RULES.COMBAT_BAR_WIDTH; i++) {
    window.drawSprite(
      SPRITE.BACKGROUND,
      i,
      1,
      Math.abs((Math.sin((startingLine + i) / 80) * (RULES.COMBAT_BAR_HEIGHT - 20)) / 2) + 20,
    );
  }
  window.ctx.globalAlpha = 1.0;
  window.ctx.imageSmoothingEnabled = false;
};

const draw = (time) => {
  window.ctx.clearRect(0, 0, RULES.COMBAT_BAR_WIDTH, RULES.COMBAT_BAR_HEIGHT);
  drawBackground();
  window.game.player.draw(time);
  drawEnemies();
  drawLoot();
};

const move = (time) => {
  window.game.player.move(time);
  moveEnemies(time);
};

const gameLoop = (timeStamp) => {
  draw(timeStamp);
  move(timeStamp);
  fight(timeStamp);
  spawnEnemies(timeStamp);

  if (checkGameEnd()) {
    window.game.player.draw(timeStamp);
    return;
  }

  window.requestAnimationFrame(gameLoop);
};

window.setupCanvas();

gameLoop(0);
