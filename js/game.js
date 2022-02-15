let dragging = null;

/* eslint-disable-next-line no-unused-vars */
function setupCanvas() {
  window.canvas = document.querySelector('canvas');
  window.ctx = window.canvas.getContext('2d');
  window.canvas.width = RULES.TILE_SIZE * RULES.NUMBER_OF_TILES;
  window.canvas.height =
    RULES.TILE_SIZE +
    Math.max(
      RULES.EQUIPMENT_PANEL_SIZE + RULES.EQUIPMENT_PANEL_PADDING_SIZE,
      RULES.INVENTORY_CELL_HEIGHT * RULES.INVENTORY_HEIGHT + RULES.INVENTORY_PADDING_SIZE * 2,
    );
  window.images.gear.onload = () => window.game.inventory.draw();
  window.images.dagger.onload = () => window.game.inventory.draw();
  window.images.ring.onload = () => window.game.inventory.draw();
  window.ctx.imageSmoothingEnabled = false;

  window.images.broadsword.onload = () => window.game.inventory.draw();
  window.images.shortsword.onload = () => window.game.inventory.draw();

  window.canvas.onmousedown = handleMouseDown;
  window.canvas.onmouseup = handleMouseUp;
}

const handleMouseDown = (e) => {
  console.log(e);
  if (isEventInsideInventory(e)) {
    const item = getItemFromCell(...getCell(e));
    if (item) {
      dragging = {
        item,
        offsetX:
          e.layerX - RULES.INVENTORY_PADDING_SIZE - item.xPosition * RULES.INVENTORY_CELL_WIDTH,
        offsetY:
          e.layerY -
          RULES.INVENTORY_PADDING_SIZE -
          item.yPosition * RULES.INVENTORY_CELL_HEIGHT -
          RULES.TILE_SIZE,
      };
      window.canvas.onmousemove = handleMouseMove;
    }
  }
};

const handleMouseMove = (e) => {
  const itemStartEvent = getEventFromCoordinates(
    e.layerX - dragging.offsetX,
    e.layerY - dragging.offsetY,
  );
  if (isItemInsideInventory(itemStartEvent.layerX, itemStartEvent.layerY, dragging.item)) {
    window.game.inventory.draw([dragging.item]);
    window.ctx.globalAlpha = 0.5;
    const [xCell, yCell] = getCellIncorporatingOffset(e, dragging);
    window.ctx.fillStyle = isValidPosition(xCell, yCell, dragging.item) ? 'green' : 'red';
    window.ctx.fillRect(
      xCell * RULES.INVENTORY_CELL_WIDTH + RULES.INVENTORY_PADDING_SIZE,
      yCell * RULES.INVENTORY_CELL_HEIGHT + RULES.INVENTORY_PADDING_SIZE + RULES.TILE_SIZE,
      dragging.item.xSize * RULES.INVENTORY_CELL_WIDTH,
      dragging.item.ySize * RULES.INVENTORY_CELL_HEIGHT,
    );

    dragging.item.draw(itemStartEvent.layerX, itemStartEvent.layerY);
    window.ctx.globalAlpha = 1;
  } else if (isItemInsidePlayZone(itemStartEvent.layerX, itemStartEvent.layerY, dragging.item)) {
    window.game.inventory.draw([dragging.item]);
    window.ctx.globalAlpha = 0.5;

    dragging.item.draw(itemStartEvent.layerX, itemStartEvent.layerY);

    window.ctx.globalAlpha = 1;
  }
};

const handleMouseUp = (e) => {
  if (dragging) {
    const x = e.layerX - dragging.offsetX;
    const y = e.layerY - dragging.offsetY;
    if (isItemInsideInventory(x, y, dragging.item)) {
      if (isValidPosition(...getCellIncorporatingOffset(e, dragging), dragging.item)) {
        const [xCell, yCell] = getCellIncorporatingOffset(e, dragging);
        dragging.item.xPosition = xCell;
        dragging.item.yPosition = yCell;
      }
    } else if (isItemInsidePlayZone(x, y, dragging.item)) {
      const slotPosition = getSlotFromCoordinates(x, y);
      window.game.inventory.tryToEquipItem(dragging.item, SLOTS[slotPosition]);
    }

    window.game.inventory.draw();
    dragging = null;
  }
  window.canvas.onmousemove = null;
};

const isInside = (x, y, slot) =>
  slot.xStart <= x && slot.xEnd >= x && slot.yStart <= y && slot.yEnd >= y;

const getSlotFromCoordinates = (x, y) =>
  Object.keys(SLOTS).find((key) => {
    if (SLOTS[key].xStart) {
      if (isInside(x, y, SLOTS[key])) {
        return key;
      }
    }
  });

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

const isEventInsidePlayArea = (e) =>
  e.layerX > RULES.INVENTORY_PADDING_SIZE &&
  e.layerX <
    window.canvas.width - RULES.INVENTORY_PADDING_SIZE - RULES.EQUIPMENT_PANEL_PADDING_SIZE &&
  e.layerY > RULES.INVENTORY_PADDING_SIZE + RULES.TILE_SIZE &&
  e.layerY <
    window.canvas.height - RULES.INVENTORY_PADDING_SIZE - RULES.EQUIPMENT_PANEL_PADDING_SIZE;

const isEventInsideInventory = (e) =>
  e.layerX > RULES.INVENTORY_PADDING_SIZE &&
  e.layerX < RULES.INVENTORY_PADDING_SIZE + RULES.INVENTORY_CELL_WIDTH * RULES.INVENTORY_WIDTH &&
  e.layerY > RULES.INVENTORY_PADDING_SIZE + RULES.TILE_SIZE &&
  e.layerY <
    RULES.INVENTORY_PADDING_SIZE +
      RULES.INVENTORY_CELL_HEIGHT * RULES.INVENTORY_HEIGHT +
      RULES.TILE_SIZE;

const getCell = (e) => {
  const xCell = Math.floor((e.layerX - RULES.INVENTORY_PADDING_SIZE) / RULES.INVENTORY_CELL_WIDTH);
  const yCell = Math.floor(
    (e.layerY - RULES.INVENTORY_PADDING_SIZE - RULES.TILE_SIZE) / RULES.INVENTORY_CELL_HEIGHT,
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
