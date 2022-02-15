/* eslint-disable-next-line no-unused-vars */
class Description {
  constructor(item) {
    this.item = item;
  }

  setItem(item) {
    this.item = item;
  }

  unsetItem() {
    this.item = window.game.inventory.getItemFromSlot(SLOTS.HAND_PRIMARY);
  }

  getBoundary() {
    const { xStart, yEnd } = window.getDraggableBoundary();
    return {
      xStart: xStart + RULES.ITEM_DESCRIPTION_PADDING,
      yStart: yEnd + RULES.ITEM_DESCRIPTION_PADDING,
      xEnd: xStart + RULES.ITEM_DESCRIPTION_PADDING + RULES.ITEM_DESCRIPTION_WIDTH,
      yEnd: yEnd + RULES.ITEM_DESCRIPTION_PADDING + RULES.ITEM_DESCRIPTION_HEIGHT,
    };
  }

  drawBox() {
    const { xStart, yEnd } = window.getDraggableBoundary();
    window.ctx.clearRect(
      xStart + RULES.ITEM_DESCRIPTION_PADDING,
      yEnd + RULES.ITEM_DESCRIPTION_PADDING,
      RULES.ITEM_DESCRIPTION_WIDTH + RULES.ITEM_DESCRIPTION_PADDING,
      RULES.ITEM_DESCRIPTION_HEIGHT + RULES.ITEM_DESCRIPTION_PADDING,
    );

    window.ctx.fillStyle = '#99431f';
    window.ctx.fillRect(
      xStart + RULES.ITEM_DESCRIPTION_PADDING,
      yEnd + RULES.ITEM_DESCRIPTION_PADDING,
      RULES.ITEM_DESCRIPTION_WIDTH,
      RULES.ITEM_DESCRIPTION_HEIGHT,
    );

    window.ctx.strokeStyle = 'black';
    window.ctx.lineWidth = 3;
    window.ctx.strokeRect(
      xStart + RULES.ITEM_DESCRIPTION_PADDING,
      yEnd + RULES.ITEM_DESCRIPTION_PADDING,
      RULES.ITEM_DESCRIPTION_WIDTH,
      RULES.ITEM_DESCRIPTION_HEIGHT,
    );
  }

  draw() {
    this.drawBox();
    if (this.item) {
      window.ctx.font = '32px serif';
      window.ctx.fillStyle = 'white';
      const { xStart, yStart, xEnd } = this.getBoundary();
      window.ctx.fillText(this.item.name, xStart + 10, yStart + 32, xEnd - xStart - 20);
    }
  }
}
