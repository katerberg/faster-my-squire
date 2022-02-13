class Player {
    constructor(sprite) {
        this.x = 1;
        this.sprite = sprite;
    }

    draw() {
      drawSprite(SPRITE.KNIGHT, this.x, 0);
    }
}