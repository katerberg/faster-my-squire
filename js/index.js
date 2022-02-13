game = {
  enemies: [new Enemy(5, 3, SPRITE.ENEMY)],
  player: new Player(10, SPRITE.KNIGHT),
};
spritesheet = new Image()
spritesheet.src = 'assets/spritesheet.png'

setupCanvas();

function drawSprite(sprite, x, textOverlay) {
  ctx.drawImage(spritesheet, sprite * 16, 0, 16, 16, x * RULES.TILE_SIZE, 0, RULES.TILE_SIZE, RULES.TILE_SIZE);
  if (textOverlay) {
    ctx.font = '64px serif';
    ctx.fillStyle = 'orange';
    ctx.fillText(textOverlay, x * RULES.TILE_SIZE + 10, RULES.TILE_SIZE - 10, RULES.TILE_SIZE - 20);
  }
}

const fightEnemies = () => {
  game.player.attack();
  game.enemies.forEach(e => {
    e.attack();
  });
}

const checkGameEnd = () => {
  if (game.player.hp <= 0) {
    clearInterval(battleInterval);
    window.alert('You lose');
  }
}

function moveEnemies() {
  game.enemies.forEach(e => {
    e.move();
  })
}

function drawEnemies() {
  game.enemies.forEach(e => {
    e.draw();
  })
}

function spawnEnemy() {
  if (game.enemies.length < RULES.ENEMY_LIMIT) {
    game.enemies.push(new Enemy(RULES.NUMBER_OF_TILES - 1, 3, SPRITE.ENEMY));
  }
}

function drawBackground() {
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
  ctx.clearRect(0, 0, 1000, 1000);

  drawBackground();
  game.player.draw();
  drawEnemies();
};

const battleInterval = setInterval(battleTick, 1000);
setInterval(draw, 15);
