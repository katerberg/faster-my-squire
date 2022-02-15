/* eslint-disable-next-line no-unused-vars */
class Enemy {
  constructor(x, hp, sprite) {
    this.x = x;
    this.sprite = sprite;
    this.hp = hp;
    this.attackDamage = 1;
    this.range = 1;
  }

  move() {
    const newPosition = this.x - 1;
    if (
      newPosition === window.game.player.x ||
      window.game.enemies.map((e) => e.x).includes(newPosition)
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
    window.drawSprite(this.sprite, this.x, this.hp > 0 ? `${this.hp}` : 'X');
  }
}
