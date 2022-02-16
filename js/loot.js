/* eslint-disable-next-line no-unused-vars */
class Loot {
  constructor(x, sprite, gold, items, moveSpeed) {
    this.x = x;
    this.sprite = sprite;
    this.width = 5 * (sprite.xEnd - sprite.xStart - 1);
    this.lastMove = 0;
    this.gold = gold;
    this.items = items;
    this.moveSpeed = moveSpeed;
  }

  draw() {
    const playerDistanceTraveled = window.game.player.x - RULES.PLAYER_STARTING_POSITION;
    window.drawSprite(
      this.sprite,
      this.x - playerDistanceTraveled,
      this.width,
      RULES.COMBAT_BAR_HEIGHT,
    );
  }
}

/* eslint-disable-next-line no-unused-vars */
class Gold extends Loot {
  constructor(x, amount) {
    super(x, SPRITE.GOLD, amount, [], 0);
    this.width = 10;
  }
}
