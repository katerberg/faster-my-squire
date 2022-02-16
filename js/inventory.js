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

  getItemFromCell(xCell, yCell) {
    return this.getUnequippedItems().find(
      (item) =>
        xCell >= item.xPosition &&
        xCell < item.xPosition + item.xSize &&
        yCell >= item.yPosition &&
        yCell < item.yPosition + item.ySize,
    );
  }

  isValidPosition(xCell, yCell, item = null) {
    for (let i = xCell; i < xCell + item.xSize; i++) {
      for (let j = yCell; j < yCell + item.ySize; j++) {
        const itemAtSpot = this.getItemFromCell(i, j);
        if (itemAtSpot && itemAtSpot !== item) {
          return false;
        }
      }
    }
    return true;
  }

  getAvailableSpace(item) {
    for (let i = 0; i <= RULES.INVENTORY_WIDTH - item.xSize; i++) {
      for (let j = 0; j <= RULES.INVENTORY_HEIGHT - item.ySize; j++) {
        if (this.isValidPosition(i, j, item)) {
          return [i, j];
        }
      }
    }
    return null;
  }

  tryToPickup(item) {
    const space = this.getAvailableSpace(item);
    if (space) {
      item.unequip(space[0], space[1]);
      return true;
    }
    return false;
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
      RULES.COMBAT_BAR_HEIGHT + RULES.EQUIPMENT_PANEL_PADDING_SIZE,
      gearWidth,
      RULES.EQUIPMENT_PANEL_SIZE,
    );
    window.ctx.font = '16px serif';
    window.ctx.fillStyle = 'white';
    window.ctx.fillText(
      `Knight Health: ${window.game.player.hp}`,
      window.canvas.width - gearWidth - RULES.EQUIPMENT_PANEL_PADDING_SIZE + 10,
      yStart + 40,
    );

    window.ctx.fillStyle = 'gold';
    window.ctx.fillText(
      `Gold: ${window.game.player.gold}`,
      window.canvas.width - gearWidth - RULES.EQUIPMENT_PANEL_PADDING_SIZE + 200,
      yStart + 40,
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
    if (index === max || index === 0) {
      return 'black';
    }
    return 'grey';
  }

  drawInventoryDropZone() {
    window.ctx.fillStyle = '#f4e55b';
    window.ctx.fillRect(
      RULES.INVENTORY_PADDING_SIZE + RULES.INVENTORY_CELL_WIDTH * (RULES.INVENTORY_WIDTH - 2),
      RULES.INVENTORY_PADDING_SIZE +
        RULES.COMBAT_BAR_HEIGHT +
        (RULES.INVENTORY_HEIGHT - 3) * RULES.INVENTORY_CELL_HEIGHT,
      RULES.INVENTORY_CELL_WIDTH * 2,
      RULES.INVENTORY_CELL_HEIGHT * 3,
    );
    window.ctx.font = '16px serif';
    window.ctx.fillStyle = 'black';
    window.ctx.fillText(
      'Drop Zone',
      RULES.INVENTORY_PADDING_SIZE + RULES.INVENTORY_CELL_WIDTH * (RULES.INVENTORY_WIDTH - 2),
      RULES.INVENTORY_PADDING_SIZE +
        RULES.COMBAT_BAR_HEIGHT +
        RULES.INVENTORY_HEIGHT * RULES.INVENTORY_CELL_HEIGHT +
        16,
    );
  }

  drawInventoryHorizontalLines() {
    for (let i = 0; i <= RULES.INVENTORY_HEIGHT; i++) {
      const yPosition =
        RULES.INVENTORY_CELL_HEIGHT * i + RULES.INVENTORY_PADDING_SIZE + RULES.COMBAT_BAR_HEIGHT;
      window.ctx.strokeStyle = this.getInventoryLineColor(i, RULES.INVENTORY_HEIGHT);
      window.ctx.beginPath();
      window.ctx.moveTo(RULES.INVENTORY_PADDING_SIZE, yPosition);
      window.ctx.lineTo(
        RULES.INVENTORY_PADDING_SIZE + RULES.INVENTORY_CELL_WIDTH * RULES.INVENTORY_WIDTH,
        yPosition,
      );
      window.ctx.stroke();
    }
    window.ctx.strokeStyle = 'black';
    window.ctx.beginPath();
    window.ctx.moveTo(
      RULES.INVENTORY_PADDING_SIZE + RULES.INVENTORY_CELL_WIDTH * (RULES.INVENTORY_WIDTH - 2),
      RULES.INVENTORY_CELL_HEIGHT * 3 + RULES.INVENTORY_PADDING_SIZE + RULES.COMBAT_BAR_HEIGHT,
    );
    window.ctx.lineTo(
      RULES.INVENTORY_PADDING_SIZE + RULES.INVENTORY_CELL_WIDTH * RULES.INVENTORY_WIDTH,
      RULES.INVENTORY_CELL_HEIGHT * 3 + RULES.INVENTORY_PADDING_SIZE + RULES.COMBAT_BAR_HEIGHT,
    );
    window.ctx.stroke();
  }

  drawInventoryVerticalLines() {
    for (let i = 0; i <= RULES.INVENTORY_WIDTH; i++) {
      const xPosition = RULES.INVENTORY_CELL_WIDTH * i + RULES.INVENTORY_PADDING_SIZE;
      window.ctx.strokeStyle = this.getInventoryLineColor(i, RULES.INVENTORY_WIDTH, 'vertical');
      window.ctx.beginPath();
      window.ctx.moveTo(xPosition, RULES.INVENTORY_PADDING_SIZE + RULES.COMBAT_BAR_HEIGHT);
      window.ctx.lineTo(
        xPosition,
        RULES.INVENTORY_PADDING_SIZE +
          RULES.INVENTORY_CELL_HEIGHT * RULES.INVENTORY_HEIGHT +
          RULES.COMBAT_BAR_HEIGHT,
      );
      window.ctx.stroke();
    }
    window.ctx.strokeStyle = 'black';
    window.ctx.beginPath();
    window.ctx.moveTo(
      RULES.INVENTORY_PADDING_SIZE + RULES.INVENTORY_CELL_WIDTH * (RULES.INVENTORY_WIDTH - 2),
      RULES.INVENTORY_CELL_HEIGHT * 3 + RULES.INVENTORY_PADDING_SIZE + RULES.COMBAT_BAR_HEIGHT,
    );
    window.ctx.lineTo(
      RULES.INVENTORY_PADDING_SIZE + RULES.INVENTORY_CELL_WIDTH * (RULES.INVENTORY_WIDTH - 2),
      RULES.INVENTORY_CELL_HEIGHT * RULES.INVENTORY_HEIGHT +
        RULES.INVENTORY_PADDING_SIZE +
        RULES.COMBAT_BAR_HEIGHT,
    );
    window.ctx.stroke();
  }

  draw() {
    const exclusionList = window.game.dragging ? [window.game.dragging.item] : [];
    const { xStart, yStart, yEnd } = window.getDraggableBoundary();
    window.ctx.clearRect(
      xStart,
      yStart,
      RULES.INVENTORY_PADDING_SIZE + RULES.INVENTORY_CELL_WIDTH * RULES.INVENTORY_WIDTH,
      yEnd - yStart,
    );
    window.ctx.lineWidth = 1;
    this.drawInventoryDropZone();
    this.drawInventoryHorizontalLines();
    this.drawInventoryVerticalLines();
    this.getUnequippedItems().forEach((i) => exclusionList.includes(i) || i.draw());
    this.drawGear(exclusionList);
  }
}
