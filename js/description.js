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

  drawDamageHistogramAxes() {
    const { xStart, yStart } = this.getBoundary();
    window.ctx.lineWidth = 1;
    window.ctx.strokeStyle = 'black';
    const top = yStart + 60;
    const left = xStart + 20;

    window.ctx.beginPath();
    window.ctx.moveTo(left, top);
    window.ctx.lineTo(left, top + 100);
    window.ctx.moveTo(left, top + 100);
    window.ctx.lineTo(left + 200, top + 100);
    window.ctx.stroke();
  }

  drawDamageBar(label, xStart, width, height) {
    window.ctx.fillStyle = '#cccccc';
    window.ctx.textAlign = 'center';
    const yStart = this.getBoundary().yStart + 160 - height;
    window.ctx.fillRect(xStart, yStart, width, height);
    window.ctx.font = '16px serif';
    window.ctx.fillStyle = 'white';
    window.ctx.fillText(label, xStart + width / 2, yStart + height + 16, width);
    window.ctx.textAlign = 'left';
  }

  drawDamageHistogram(history) {
    this.drawDamageHistogramAxes();
    const numberOfDamages = Object.keys(history).length;
    const totalSpace = 200;
    const padding = (numberOfDamages + 1) * 5;
    const drawSpace = totalSpace - padding;
    const spacePerDamage = Math.floor(drawSpace / numberOfDamages);
    const highestValue = Math.max(...Object.keys(history).map((k) => history[k]));
    Object.keys(history)
      .sort((a, b) => a - b)
      .forEach((key, i) => {
        this.drawDamageBar(
          key,
          5 * (i + 1) + spacePerDamage * i + this.getBoundary().xStart + 20,
          spacePerDamage,
          Math.floor((90 * history[key]) / highestValue),
        );
      });
  }

  draw() {
    this.drawBox();
    if (this.item) {
      const { xStart, yStart, xEnd } = this.getBoundary();
      window.ctx.font = '32px serif';
      window.ctx.fillStyle = 'white';
      window.ctx.fillText(this.item.name, xStart + 10, yStart + 32, xEnd - xStart - 20);
      const history = this.item.getDamageHistory();
      if (Object.keys(history).length) {
        this.drawDamageHistogram(history);
      } else {
        window.ctx.font = '16px serif';
        window.ctx.globalAlpha = 0.5;
        window.ctx.fillText('No attacks yet', xStart + 50, yStart + 82, xEnd - xStart - 20);
        window.ctx.globalAlpha = 1;
      }
    }
  }
}
