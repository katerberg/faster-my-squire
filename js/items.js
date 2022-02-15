/* eslint-disable-next-line no-unused-vars */
class Item {
  constructor(xSize, ySize, xPosition, yPosition, sprite, slot) {
    this.xSize = xSize;
    this.ySize = ySize;
    this.xPosition = xPosition;
    this.yPosition = yPosition;
    this.sprite = sprite;
    this.slot = slot;
  }

  draw(overrideX, overrideY) {
    if (!this.slot) {
      window.ctx.drawImage(
        this.sprite,
        overrideX
          ? overrideX
          : this.xPosition * RULES.INVENTORY_CELL_WIDTH + RULES.INVENTORY_PADDING_SIZE,
        overrideY
          ? overrideY
          : this.yPosition * RULES.INVENTORY_CELL_HEIGHT +
              RULES.INVENTORY_PADDING_SIZE +
              RULES.TILE_SIZE,
        this.xSize * RULES.INVENTORY_CELL_WIDTH,
        this.ySize * RULES.INVENTORY_CELL_HEIGHT,
      );
    }
    if (this.slot) {
      const drawSizeX = this.xSize * RULES.INVENTORY_CELL_WIDTH;
      const drawSizeY = this.ySize * RULES.INVENTORY_CELL_HEIGHT;
      window.ctx.drawImage(
        this.sprite,
        (this.slot.xEnd - this.slot.xStart) / 2 + this.slot.xStart - drawSizeX / 2,
        (this.slot.yEnd - this.slot.yStart) / 2 + this.slot.yStart - drawSizeY / 2,
        drawSizeX,
        drawSizeY,
      );
    }
  }
}

/* eslint-disable-next-line no-unused-vars */
class Dagger extends Item {
  constructor(xPosition, yPosition, slot) {
    super(1, 1, xPosition, yPosition, window.images.dagger, slot);
  }
}

/* eslint-disable-next-line no-unused-vars */
class ShortSword extends Item {
  constructor(xPosition, yPosition, slot) {
    super(1, 2, xPosition, yPosition, window.images.shortsword, slot);
  }
}

/* eslint-disable-next-line no-unused-vars */
class BroadSword extends Item {
  constructor(xPosition, yPosition, slot) {
    super(2, 3, xPosition, yPosition, window.images.broadsword, slot);
  }
}