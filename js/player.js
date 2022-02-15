/* eslint-disable-next-line no-unused-vars */
class Player {
  constructor(hp, sprite) {
    this.x = 1;
    this.hp = hp;
    this.sprite = sprite;
    this.attackDamage = 1;
    this.range = 1;
  }

  attack() {
    const closestEnemy = window.game.enemies.find((e) => e.x <= this.x + this.range);
    if (!closestEnemy) {
      return;
    }
    const equippedWeapon = window.game.inventory.getItemFromSlot(SLOTS.HAND_PRIMARY);
    if (equippedWeapon) {
      return closestEnemy.takeDamage(equippedWeapon.attack());
    }
    closestEnemy.takeDamage(this.attackDamage);
  }

  takeDamage(amount) {
    this.hp -= amount;
  }

  draw() {
    window.drawSprite(SPRITE.KNIGHT, this.x, this.hp);
  }
}
