/* eslint-disable-next-line no-unused-vars */
class Enemy {
  constructor(x, width, hp, sprite) {
    this.x = x;
    this.sprite = sprite;
    this.hp = hp;
    this.width = width;
    this.speed = 10;
    this.attackDamage = 1;
    this.range = 11;
  }

  move(overrideSpeed) {
    const speed = overrideSpeed ? overrideSpeed : this.speed;
    const newPosition = this.x - speed;
    if (newPosition <= window.game.player.x + RULES.PLAYER_WIDTH && speed > 1) {
      return this.move(speed - 1);
    } else if (
      window.game.enemies
        .map((e) => [e.x, e.x + e.width])
        .some((e) => newPosition >= e[0] && newPosition <= e[1])
    ) {
      return;
    }
    this.x = newPosition;
  }

  takeDamage(amount) {
    this.hp -= amount;
    if (this.hp <= 0) {
      window.game.enemies = window.game.enemies.filter((e) => e !== this);
    }
  }

  attack() {
    if (window.game.player.x >= this.x - this.range) {
      window.game.player.takeDamage(this.attackDamage);
    }
  }

  draw() {
    window.drawSprite(this.sprite, this.x, this.width, this.hp > 0 ? `${this.hp}` : 'X');
  }
}
