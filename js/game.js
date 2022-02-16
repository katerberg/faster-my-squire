window.setupCanvas = () => {
  window.canvas = document.querySelector('canvas');
  window.ctx = window.canvas.getContext('2d');
  window.canvas.width = RULES.COMBAT_BAR_WIDTH;
  window.canvas.height =
    RULES.COMBAT_BAR_HEIGHT +
    Math.max(
      RULES.EQUIPMENT_PANEL_SIZE + RULES.EQUIPMENT_PANEL_PADDING_SIZE * 2,
      RULES.INVENTORY_CELL_HEIGHT * RULES.INVENTORY_HEIGHT + RULES.INVENTORY_PADDING_SIZE * 2,
    ) +
    RULES.ITEM_DESCRIPTION_HEIGHT +
    RULES.ITEM_DESCRIPTION_PADDING * 2;
  window.images.gear.onload = () => window.game.inventory.draw();
  window.images.dagger.onload = () => window.game.inventory.draw();
  window.images.ring.onload = () => window.game.inventory.draw();
  window.ctx.imageSmoothingEnabled = false;

  window.images.broadsword.onload = () => window.game.inventory.draw();
  window.images.shortsword.onload = () => window.game.inventory.draw();

  window.game.description.draw();

  window.canvas.onmousedown = handleMouseDown;
  window.canvas.onmouseup = handleMouseUp;
};

const handleMouseDown = (e) => {
  if (isEventInsideInventory(e)) {
    const item = getItemFromCell(...getCell(e));
    if (!item) {
      return;
    }
    window.game.dragging = {
      item,
      offsetX:
        e.layerX - RULES.INVENTORY_PADDING_SIZE - item.xPosition * RULES.INVENTORY_CELL_WIDTH,
      offsetY:
        e.layerY -
        RULES.INVENTORY_PADDING_SIZE -
        item.yPosition * RULES.INVENTORY_CELL_HEIGHT -
        RULES.COMBAT_BAR_HEIGHT,
    };
    window.canvas.onmousemove = handleMouseDrag;
  } else if (isEventInsidePlayArea(e)) {
    const slot = getSlotFromCoordinates(e.layerX, e.layerY);
    if (!slot) {
      return;
    }
    const item = window.game.inventory.getItemFromSlot(slot);
    if (item) {
      const itemHeight = item.ySize * RULES.INVENTORY_CELL_HEIGHT;
      const itemWidth = item.xSize * RULES.INVENTORY_CELL_WIDTH;
      const calculatedX =
        e.layerX - item.slot.xStart - (item.slot.xEnd - item.slot.xStart) / 2 + itemWidth / 2;
      const calculatedY =
        e.layerY - item.slot.yStart - (item.slot.yEnd - item.slot.yStart) / 2 + itemHeight / 2;

      const offsetY = calculatedY > itemHeight || calculatedY < 0 ? itemHeight / 2 : calculatedY;
      const offsetX = calculatedX > itemWidth || calculatedX < 0 ? itemWidth / 2 : calculatedX;

      window.game.dragging = {
        item,
        offsetX,
        offsetY,
      };
      window.canvas.onmousemove = handleMouseDrag;
    }
  }
};

const getHoveredItem = (e) => {
  if (isEventInsideInventory(e)) {
    const item = getItemFromCell(...getCell(e));
    if (!item) {
      return;
    }
    return item;
  } else if (isEventInsidePlayArea(e)) {
    const slot = getSlotFromCoordinates(e.layerX, e.layerY);
    if (!slot) {
      return;
    }
    const item = window.game.inventory.getItemFromSlot(slot);
    if (!item) {
      return;
    }
    return item;
  }
};

const handleMouseMove = (e) => {
  const item = getHoveredItem(e);
  if (item) {
    window.game.description.setItem(item);
  } else {
    window.game.description.unsetItem();
  }
  window.game.description.draw();
};

const handleMouseDrag = (e) => {
  const itemStartEvent = getEventFromCoordinates(
    e.layerX - window.game.dragging.offsetX,
    e.layerY - window.game.dragging.offsetY,
  );
  if (
    isItemInsideInventory(itemStartEvent.layerX, itemStartEvent.layerY, window.game.dragging.item)
  ) {
    window.game.inventory.draw();
    window.ctx.globalAlpha = 0.5;
    const [xCell, yCell] = getCellIncorporatingOffset(e, window.game.dragging);
    window.ctx.fillStyle = isValidPosition(xCell, yCell, window.game.dragging.item)
      ? 'green'
      : 'red';
    window.ctx.fillRect(
      xCell * RULES.INVENTORY_CELL_WIDTH + RULES.INVENTORY_PADDING_SIZE,
      yCell * RULES.INVENTORY_CELL_HEIGHT + RULES.INVENTORY_PADDING_SIZE + RULES.COMBAT_BAR_HEIGHT,
      window.game.dragging.item.xSize * RULES.INVENTORY_CELL_WIDTH,
      window.game.dragging.item.ySize * RULES.INVENTORY_CELL_HEIGHT,
    );

    window.game.dragging.item.draw(itemStartEvent.layerX, itemStartEvent.layerY);
    window.ctx.globalAlpha = 1;
  } else if (
    isItemInsidePlayZone(itemStartEvent.layerX, itemStartEvent.layerY, window.game.dragging.item)
  ) {
    window.game.inventory.draw();
    window.ctx.globalAlpha = 0.5;

    window.game.dragging.item.draw(itemStartEvent.layerX, itemStartEvent.layerY);

    window.ctx.globalAlpha = 1;
  }
};

const handleMouseUp = (e) => {
  if (window.game.dragging) {
    const x = e.layerX - window.game.dragging.offsetX;
    const y = e.layerY - window.game.dragging.offsetY;
    if (isItemInsideInventory(x, y, window.game.dragging.item)) {
      if (
        isValidPosition(
          ...getCellIncorporatingOffset(e, window.game.dragging),
          window.game.dragging.item,
        )
      ) {
        const [xCell, yCell] = getCellIncorporatingOffset(e, window.game.dragging);
        window.game.dragging.item.unequip(xCell, yCell);
      }
    } else if (isItemInsidePlayZone(x, y, window.game.dragging.item)) {
      const slot = getSlotFromCoordinates(
        x + window.game.dragging.offsetX,
        y + window.game.dragging.offsetY,
      );
      window.game.inventory.tryToEquipItem(window.game.dragging.item, slot);
    }

    window.game.dragging = null;
    window.game.inventory.draw();
  }
  window.canvas.onmousemove = handleMouseMove;
};

const isInsideSlot = (x, y, slot) => {
  const fudgeX = 0.2 * (slot.xEnd - slot.xStart);
  const fudgeY = 0.2 * (slot.yEnd - slot.yStart);
  return (
    slot.xStart - fudgeX <= x &&
    slot.xEnd + fudgeX >= x &&
    slot.yStart - fudgeY <= y &&
    slot.yEnd + fudgeY >= y
  );
};

const getSlotFromCoordinates = (x, y) => {
  const foundKey = Object.keys(SLOTS).find((key) => {
    if (isInsideSlot(x, y, SLOTS[key])) {
      return true;
    }
  });
  if (foundKey) {
    return SLOTS[foundKey];
  }
};

const getEventFromCoordinates = (x, y) => ({
  layerX: x,
  layerY: y,
});

const isValidPosition = (xCell, yCell, item) => {
  for (let i = xCell; i < xCell + item.xSize; i++) {
    for (let j = yCell; j < yCell + item.ySize; j++) {
      const itemAtSpot = getItemFromCell(i, j);
      if (itemAtSpot && itemAtSpot !== item) {
        return false;
      }
    }
  }
  return true;
};

const isItemInsidePlayZone = (x, y, item) => {
  const xMax = x + item.xSize * RULES.INVENTORY_CELL_WIDTH;
  const yMax = y + item.ySize * RULES.INVENTORY_CELL_HEIGHT;

  return (
    isEventInsidePlayArea(getEventFromCoordinates(x, y)) &&
    isEventInsidePlayArea(getEventFromCoordinates(xMax, y)) &&
    isEventInsidePlayArea(getEventFromCoordinates(x, yMax)) &&
    isEventInsidePlayArea(getEventFromCoordinates(xMax, yMax))
  );
};

const isItemInsideInventory = (x, y, item) => {
  const xMax = x + item.xSize * RULES.INVENTORY_CELL_WIDTH;
  const yMax = y + item.ySize * RULES.INVENTORY_CELL_HEIGHT;
  return (
    isEventInsideInventory(getEventFromCoordinates(x, y)) &&
    isEventInsideInventory(getEventFromCoordinates(xMax, y)) &&
    isEventInsideInventory(getEventFromCoordinates(x, yMax)) &&
    isEventInsideInventory(getEventFromCoordinates(xMax, yMax))
  );
};

const isEventInsidePlayArea = (e) => {
  const { xStart, xEnd, yStart, yEnd } = window.getDraggableBoundary();
  return e.layerX > xStart && e.layerX < xEnd && e.layerY > yStart && e.layerY < yEnd;
};

const isEventInsideInventory = (e) => {
  const { xStart, yStart } = window.getDraggableBoundary();
  return (
    e.layerX > xStart &&
    e.layerX < RULES.INVENTORY_PADDING_SIZE + RULES.INVENTORY_CELL_WIDTH * RULES.INVENTORY_WIDTH &&
    e.layerY > yStart &&
    e.layerY <
      RULES.COMBAT_BAR_HEIGHT +
        RULES.INVENTORY_PADDING_SIZE * 2 +
        RULES.INVENTORY_CELL_HEIGHT * RULES.INVENTORY_HEIGHT
  );
};

const getCell = (e) => {
  const xCell = Math.floor((e.layerX - RULES.INVENTORY_PADDING_SIZE) / RULES.INVENTORY_CELL_WIDTH);
  const yCell = Math.floor(
    (e.layerY - RULES.INVENTORY_PADDING_SIZE - RULES.COMBAT_BAR_HEIGHT) /
      RULES.INVENTORY_CELL_HEIGHT,
  );
  return [xCell, yCell];
};

const getCellIncorporatingOffset = (e, dragging) => {
  const [xMouse, yMouse] = getCell(e);
  const xCell = xMouse - Math.floor(dragging.offsetX / RULES.INVENTORY_CELL_WIDTH);
  const yCell = yMouse - Math.floor(dragging.offsetY / RULES.INVENTORY_CELL_HEIGHT);
  return [xCell, yCell];
};

const getItemFromCell = (xCell, yCell) =>
  window.game.inventory
    .getUnequippedItems()
    .find(
      (item) =>
        xCell >= item.xPosition &&
        xCell < item.xPosition + item.xSize &&
        yCell >= item.yPosition &&
        yCell < item.yPosition + item.ySize,
    );

setTimeout(() => (window.canvas.onmousemove = handleMouseMove), 100);
