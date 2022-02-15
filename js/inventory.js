/* eslint-disable-next-line no-unused-vars */
class Inventory {
  constructor(items) {
    this.items = [...items];
  }

  getUnequippedItems() {
    return this.items.filter((i) => !i.slot);
  }

  getEquippedItems() {
    return this.items.filter((i) => i.slot);
  }

  getItemFromSlot(slot) {
    return this.items.find((i) => i.slot === slot);
  }

  tryToEquipItem(item, slot) {
    if (this.getEquippedItems().find((i) => i.slot === slot)) {
      return;
    }
    this.equipItem(item, slot);
  }

  equipItem(item, slot) {
    const foundItem = this.items.find((i) => i === item);
    if (!foundItem) {
      logWarning('Did not find item to equip', item);
      return;
    }

    if (!foundItem.getValidSlots().includes(slot)) {
      return;
    }

    foundItem.equip(slot);
  }

  drawGearBackground() {
    const { xEnd, yStart, yEnd } = window.getDraggableBoundary();
    window.ctx.clearRect(
      RULES.INVENTORY_PADDING_SIZE + RULES.INVENTORY_WIDTH * RULES.INVENTORY_CELL_WIDTH,
      yStart,
      xEnd - RULES.INVENTORY_PADDING_SIZE + RULES.INVENTORY_WIDTH * RULES.INVENTORY_CELL_WIDTH,
      yEnd - yStart,
    );

    const gearWidth = (85 / 67) * RULES.EQUIPMENT_PANEL_SIZE;
    window.ctx.drawImage(
      window.images.gear,
      window.canvas.width - gearWidth - RULES.EQUIPMENT_PANEL_PADDING_SIZE,
      RULES.TILE_SIZE + RULES.EQUIPMENT_PANEL_PADDING_SIZE,
      gearWidth,
      RULES.EQUIPMENT_PANEL_SIZE,
    );
  }

  drawGear(exclusionList) {
    this.drawGearBackground();
    window.game.inventory
      .getEquippedItems()
      .filter((i) => !exclusionList.includes(i))
      .forEach((i) => {
        i.draw();
      });
  }

  getInventoryLineColor(index, max) {
    return index === max || index === 0 ? 'black' : 'grey';
  }

  drawInventoryHorizontalLines() {
    for (let i = 0; i <= RULES.INVENTORY_HEIGHT; i++) {
      const yPosition =
        RULES.INVENTORY_CELL_HEIGHT * i + RULES.INVENTORY_PADDING_SIZE + RULES.TILE_SIZE;
      window.ctx.strokeStyle = this.getInventoryLineColor(i, RULES.INVENTORY_HEIGHT);
      window.ctx.beginPath();
      window.ctx.moveTo(RULES.INVENTORY_PADDING_SIZE, yPosition);
      window.ctx.lineTo(
        RULES.INVENTORY_PADDING_SIZE + RULES.INVENTORY_CELL_WIDTH * RULES.INVENTORY_WIDTH,
        yPosition,
      );
      window.ctx.stroke();
    }
  }

  drawInventoryVerticalLines() {
    for (let i = 0; i <= RULES.INVENTORY_WIDTH; i++) {
      const xPosition = RULES.INVENTORY_CELL_WIDTH * i + RULES.INVENTORY_PADDING_SIZE;
      window.ctx.strokeStyle = this.getInventoryLineColor(i, RULES.INVENTORY_WIDTH);
      window.ctx.beginPath();
      window.ctx.moveTo(xPosition, RULES.INVENTORY_PADDING_SIZE + RULES.TILE_SIZE);
      window.ctx.lineTo(
        xPosition,
        RULES.INVENTORY_PADDING_SIZE +
          RULES.INVENTORY_CELL_HEIGHT * RULES.INVENTORY_HEIGHT +
          RULES.TILE_SIZE,
      );
      window.ctx.stroke();
    }
  }

  draw(exclusionList = []) {
    const { xStart, yStart, yEnd } = window.getDraggableBoundary();
    window.ctx.clearRect(
      xStart,
      yStart,
      RULES.INVENTORY_PADDING_SIZE + RULES.INVENTORY_CELL_WIDTH * RULES.INVENTORY_WIDTH,
      yEnd - yStart,
    );
    window.ctx.lineWidth = 1;
    this.drawInventoryHorizontalLines();
    this.drawInventoryVerticalLines();
    this.getUnequippedItems().forEach((i) => exclusionList.includes(i) || i.draw());
    this.drawGear(exclusionList);
  }
}
