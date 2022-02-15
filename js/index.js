window.images = {
  spritesheet: new Image(),
  gear: new Image(),
  broadsword: new Image(),
  shortsword: new Image(),
  dagger: new Image(),
  ring: new Image(),
};

const equippedWeapon = new BroadSword(null, null, SLOTS.HAND_PRIMARY);
window.game = {
  enemies: [new Enemy(70, 10, 3, SPRITE.ENEMY)],
  player: new Player(10, SPRITE.KNIGHT),
  inventory: new Inventory([
    equippedWeapon,
    new ShortSword(3, 0),
    new Dagger(0, 0),
    new Ring(5, 5),
  ]),
  description: new Description(equippedWeapon),
};

window.images.spritesheet.src = 'assets/spritesheet.png';
window.images.gear.src = 'assets/gear.png';
window.images.ring.src = 'assets/ring.png';
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

window.drawSprite = (sprite, x, width, textOverlay) => {
  window.ctx.drawImage(
    window.images.spritesheet,
    sprite * 16,
    0,
    16,
    16,
    x,
    0,
    width,
    RULES.COMBAT_BAR_HEIGHT,
  );
  if (textOverlay !== undefined) {
    window.ctx.font = '10px serif';
    window.ctx.fillStyle = 'orange';
    window.ctx.fillText(textOverlay, x, RULES.COMBAT_BAR_HEIGHT - 10, width);
  }
};

const fightEnemies = () => {
  window.game.player.attack();
  window.game.enemies.forEach((e) => {
    e.attack();
  });
};

const checkGameEnd = () => {
  if (window.game.player.hp <= 0) {
    clearInterval(drawInterval);
    clearInterval(battleInterval);
    window.game.player.draw();
  }
};

const moveEnemies = () => {
  window.game.enemies.forEach((e) => {
    e.move();
  });
};

const drawEnemies = () => {
  window.game.enemies.forEach((e) => {
    e.draw();
  });
};

const spawnEnemy = () => {
  if (window.game.enemies.length < RULES.ENEMY_LIMIT) {
    window.game.enemies.push(new Enemy(RULES.COMBAT_BAR_WIDTH - 1, 10, 3, SPRITE.ENEMY));
  }
};

const drawBackground = () => {
  for (let i = 0; i < RULES.COMBAT_BAR_WIDTH; i++) {
    window.drawSprite(SPRITE.BACKGROUND, i, 1);
  }
};

let timer = 0;
const battleTick = () => {
  timer++;
  fightEnemies();
  checkGameEnd();
  moveEnemies();
  if (timer % 100 === 0) {
    spawnEnemy();
  }
};

const draw = () => {
  window.ctx.clearRect(0, 0, RULES.COMBAT_BAR_WIDTH, RULES.COMBAT_BAR_HEIGHT);
  drawBackground();
  window.game.player.draw();
  drawEnemies();
};

window.setupCanvas();

const battleInterval = setInterval(battleTick, 10);
const drawInterval = setInterval(draw, 15);
