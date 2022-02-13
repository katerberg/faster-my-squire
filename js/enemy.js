class Enemy {
    constructor(x, sprite) {
        this.x = x;
        this.sprite = sprite;
    }

    move() {
        const newPosition = this.x - 1;
        if (newPosition === game.player.x || game.enemies.map(e => e.x).includes(newPosition)) {
            return;
        }
        if (this.x-- < 0) {
            console.log('killing enemy')
            game.enemies = game.enemies.filter(e => e !== this);
        }
    }

    draw() {
      drawSprite(SPRITE.ENEMY, this.x, '3');
    }
}