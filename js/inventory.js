class Item {
    constructor(xSize, ySize, xPosition, yPosition, sprite) {
      this.xSize = xSize;
      this.ySize = ySize;
      this.xPosition = xPosition;
      this.yPosition = yPosition;
      this.sprite = sprite;
    }

    draw(overrideX, overrideY) {
      window.ctx.drawImage(this.sprite,
        overrideX ? overrideX : this.xPosition * RULES.INVENTORY_CELL_WIDTH + RULES.INVENTORY_PADDING_SIZE,
        overrideY ? overrideY : this.yPosition * RULES.INVENTORY_CELL_HEIGHT + RULES.INVENTORY_PADDING_SIZE + RULES.TILE_SIZE,
        this.xSize * RULES.INVENTORY_CELL_WIDTH,
        this.ySize * RULES.INVENTORY_CELL_HEIGHT,
      );
    }
}