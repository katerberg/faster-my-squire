/* eslint-disable-next-line no-unused-vars */
class Player {
  constructor(hp, sprite) {
    this.x = RULES.PLAYER_STARTING_POSITION;
    this.hp = hp;
    this.sprite = sprite;
    this.width = RULES.PLAYER_WIDTH;
    this.attackRange = this.width + 1;
    this.lootRange = this.width;
    this.lastAttack = 0;
    this.attackDamage = 1;
    this.attackSpeed = 1000;
    this.lastMove = 0;
    this.moveSpeed = 10;
    this.gold = 0;
  }

  attack(time) {
    if (time - this.lastAttack < this.attackSpeed) {
      return;
    }
    const closestEnemy = window.game.enemies.find((e) => e.x <= this.x + this.attackRange);
    if (!closestEnemy) {
      return;
    }
    this.lastAttack = time;
    const equippedWeapon = window.game.inventory.getItemFromSlot(SLOTS.HAND_PRIMARY);
    if (equippedWeapon) {
      return closestEnemy.takeDamage(equippedWeapon.attack());
    }
    closestEnemy.takeDamage(this.attackDamage);
  }

  takeDamage(amount) {
    this.hp -= amount;
    window.game.inventory.draw();
  }

  loot(x) {
    const goldAtLocation = window.game.droppedGold.filter((g) => g.x === x);
    if (goldAtLocation.length) {
      window.game.droppedGold = window.game.droppedGold.filter((g) => g.x !== x);
      this.gold += goldAtLocation.reduce((prev, current) => prev + current.gold, 0);
      window.game.inventory.draw();
    }
  }

  move(time) {
    if (time - this.lastMove < this.moveSpeed) {
      return;
    }
    const newPosition = this.x + 1;
    if (window.game.enemies.some((e) => e.x <= newPosition + this.width)) {
      return;
    }

    this.loot(newPosition + this.lootRange);
    this.lastMove = time;
    this.x = newPosition;
  }

  draw(time) {
    const sprite =
      time - this.lastAttack < this.attackSpeed ? SPRITE.KNIGHT_ATTACKING : SPRITE.KNIGHT;
    window.drawSprite(
      sprite,
      RULES.PLAYER_STARTING_POSITION,
      RULES.PLAYER_WIDTH,
      RULES.COMBAT_BAR_HEIGHT,
    );
  }
}
