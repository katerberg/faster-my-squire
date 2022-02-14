window.images = {
  spritesheet: new Image(),
  gear: new Image(),
  sword: new Image(),
  dagger: new Image(),
};

window.game = {
  enemies: [new Enemy(5, 3, SPRITE.ENEMY)],
  player: new Player(10, SPRITE.KNIGHT),
  inventory: [
    new Item(3, 6, 0, 0, window.images.sword),
    new Item(1, 2, 5, 5, window.images.dagger),
  ],
};

window.images.spritesheet.src = 'assets/spritesheet.png';
window.images.gear.src = 'assets/gear.png';
window.images.sword.src = 'assets/sword.png';
window.images.dagger.src = 'assets/dagger.png';

setupCanvas();

function drawSprite(sprite, x, textOverlay) {
  window.ctx.drawImage(
    window.images.spritesheet,
    sprite * 16,
    0,
    16,
    16,
    x * RULES.TILE_SIZE,
    0,
    RULES.TILE_SIZE,
    RULES.TILE_SIZE,
  );
  if (textOverlay !== undefined) {
    window.ctx.font = '64px serif';
    window.ctx.fillStyle = 'orange';
    window.ctx.fillText(
      textOverlay,
      x * RULES.TILE_SIZE + 10,
      RULES.TILE_SIZE - 10,
      RULES.TILE_SIZE - 20,
    );
  }
}

const fightEnemies = () => {
  window.game.player.attack();
  window.game.enemies.forEach((e) => {
    e.attack();
  });
};

const checkGameEnd = () => {
  if (window.game.player.hp <= 0) {
    /* eslint-disable-next-line no-use-before-define */
    clearInterval(drawInterval);
    /* eslint-disable-next-line no-use-before-define */
    clearInterval(battleInterval);
    drawSprite(SPRITE.KNIGHT, 1, 'X');
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
    window.game.enemies.push(new Enemy(RULES.NUMBER_OF_TILES - 1, 3, SPRITE.ENEMY));
  }
};

const drawBackground = () => {
  for (let i = 0; i < RULES.NUMBER_OF_TILES; i++) {
    drawSprite(SPRITE.BACKGROUND, i);
  }
};

let timer = 0;
const battleTick = () => {
  timer++;
  fightEnemies();
  checkGameEnd();
  moveEnemies();
  if (timer % 5 === 0) {
    spawnEnemy();
  }
};

const draw = () => {
  window.ctx.clearRect(0, 0, RULES.TILE_SIZE * RULES.NUMBER_OF_TILES, RULES.TILE_SIZE);
  drawBackground();
  window.game.player.draw();
  drawEnemies();
};

const battleInterval = setInterval(battleTick, 1000);
const drawInterval = setInterval(draw, 15);
