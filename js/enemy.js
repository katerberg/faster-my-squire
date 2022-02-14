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
        if (newPosition === game.player.x || game.enemies.map(e => e.x).includes(newPosition)) {
            return;
        }
        this.x = newPosition;
    }

    takeDamage(amount) {
        this.hp -= amount;
        if (this.hp <= 0) {
            game.enemies = game.enemies.filter(e => e !== this);
        }
    }

    attack() {
        if(game.player.x >= this.x - this.range) {
            game.player.takeDamage(this.attackDamage);
        }
    }

    draw() {
      drawSprite(this.sprite, this.x, this.hp > 0 ? `${this.hp}` : 'X');
    }
}