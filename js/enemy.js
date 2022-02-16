class Enemy {
  constructor(x, hp, sprite, gold, attackDamage, attackSpeed, moveSpeed, range) {
    this.x = x;
    this.sprite = sprite;
    this.hp = hp;
    this.width = 5 * (sprite.xEnd - sprite.xStart - 1);
    this.range = range;
    this.lastAttack = 0;
    this.attackDamage = attackDamage;
    this.attackSpeed = attackSpeed;
    this.lastMove = 0;
    this.gold = gold;
    this.moveSpeed = moveSpeed;
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
      this.die();
    }
  }

  die() {
    window.game.enemies = window.game.enemies.filter((e) => e !== this);
    if (this.gold) {
      window.game.droppedGold.push(new Gold(this.x, this.gold));
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

/* eslint-disable-next-line no-unused-vars */
class Goblin extends Enemy {
  constructor(x) {
    const gold = Math.random() > 0.5 ? 1 : 0;
    super(x, 3, SPRITE.GOBLIN, gold, 1, 1000, 100, 1);
  }
}
