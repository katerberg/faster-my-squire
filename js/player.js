/* eslint-disable-next-line no-unused-vars */
class Player {
  constructor(hp, sprite) {
    this.x = 1;
    this.hp = hp;
    this.sprite = sprite;
    this.attackDamage = 1;
    this.range = 1;
    this.gear = {
      [SLOTS.HAND_PRIMARY]: new Dagger(null, null, SLOTS.HAND_PRIMARY),
    };
  }

  attack() {
    window.game.enemies.forEach((e) => {
      if (e.x <= this.x + this.range) {
        e.takeDamage(this.attackDamage);
      }
    });
  }

  takeDamage(amount) {
    this.hp -= amount;
  }

  draw() {
    drawSprite(SPRITE.KNIGHT, this.x, this.hp);
  }
}
