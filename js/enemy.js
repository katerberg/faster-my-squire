/* eslint-disable-next-line no-unused-vars */
class Enemy {
  constructor(x, width, hp, sprite) {
    this.x = x;
    this.sprite = sprite;
    this.hp = hp;
    this.width = width;
    this.range = 11;
    this.lastAttack = 0;
    this.attackDamage = 1;
    this.attackSpeed = 1000;
    this.lastMove = 0;
    this.moveSpeed = 10;
  }

  move(time) {
    if (time - this.lastMove < this.moveSpeed) {
      return;
    }
    const newPosition = this.x - 1;
    if (newPosition <= window.game.player.x + RULES.PLAYER_WIDTH) {
      return;
    }
    this.lastMove = time;
    this.x = newPosition;
  }

  takeDamage(amount) {
    this.hp -= amount;
    if (this.hp <= 0) {
      window.game.enemies = window.game.enemies.filter((e) => e !== this);
    }
  }

  attack(time) {
    if (time - this.lastAttack < this.attackSpeed) {
      return;
    }
    if (window.game.player.x + RULES.PLAYER_WIDTH < this.x - this.range) {
      return;
    }
    this.lastAttack = time;
    window.game.player.takeDamage(this.attackDamage);
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
