window.game = {
  enemies: [new Enemy(5, 3, SPRITE.ENEMY)],
  player: new Player(10, SPRITE.KNIGHT),
};

window.images = {
  spritesheet: new Image(),
  gear: new Image(),
}
window.images.spritesheet.src = 'assets/spritesheet.png';
window.images.gear.src = 'assets/gear.png';

setupCanvas();


function drawSprite(sprite, x, textOverlay) {
  window.ctx.drawImage(images.spritesheet, sprite * 16, 0, 16, 16, x * RULES.TILE_SIZE, 0, RULES.TILE_SIZE, RULES.TILE_SIZE);
  if (textOverlay) {
    window.ctx.font = '64px serif';
    window.ctx.fillStyle = 'orange';
    window.ctx.fillText(textOverlay, x * RULES.TILE_SIZE + 10, RULES.TILE_SIZE - 10, RULES.TILE_SIZE - 20);
  }
}

const fightEnemies = () => {
  window.game.player.attack();
  window.game.enemies.forEach(e => {
    e.attack();
  });
}

const checkGameEnd = () => {
  if (window.game.player.hp <= 0) {
    draw();
    clearInterval(battleInterval);
  }
}

const moveEnemies = () => {
  window.game.enemies.forEach(e => {
    e.move();
  })
}

const drawEnemies = () => {
  window.game.enemies.forEach(e => {
    e.draw();
  })
}

const spawnEnemy = () => {
  if (window.game.enemies.length < RULES.ENEMY_LIMIT) {
    window.game.enemies.push(new Enemy(RULES.NUMBER_OF_TILES - 1, 3, SPRITE.ENEMY));
  }
}

const drawBackground = () => {
  for (let i = 0; i < RULES.NUMBER_OF_TILES; i++) {
    drawSprite(SPRITE.BACKGROUND, i);
  }
}

let timer = 0;
const battleTick = () => {
  timer++;
  fightEnemies();
  checkGameEnd();
  moveEnemies();
  if (timer % 5 === 0) {
    spawnEnemy();
  }
}

const draw = () => {
  window.ctx.clearRect(0, 0, RULES.TILE_SIZE * RULES.NUMBER_OF_TILES, RULES.TILE_SIZE);

  drawBackground();
  window.game.player.draw();
  drawEnemies();
};

const battleInterval = setInterval(battleTick, 1000);
setInterval(draw, 15);