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
  window.images.gear.onload = () => drawGear();
  window.images.dagger.onload = () => drawGear();
  window.ctx.imageSmoothingEnabled = false;

  window.images.broadsword.onload = () => drawInventory();
  window.images.shortsword.onload = () => drawInventory();

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
    drawInventory([dragging.item]);
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
    drawInventory([dragging.item]);
    drawGear();
    window.ctx.globalAlpha = 0.5;

    dragging.item.draw(itemStartEvent.layerX, itemStartEvent.layerY);

    window.ctx.globalAlpha = 1;
  }
};

const handleMouseUp = (e) => {
  if (dragging) {
    if (
      isItemInsideInventory(
        e.layerX - dragging.offsetX,
        e.layerY - dragging.offsetY,
        dragging.item,
      ) &&
      isValidPosition(...getCellIncorporatingOffset(e, dragging), dragging.item)
    ) {
      const [xCell, yCell] = getCellIncorporatingOffset(e, dragging);
      dragging.item.xPosition = xCell;
      dragging.item.yPosition = yCell;
    }
    drawInventory();
    dragging = null;
  }
  window.canvas.onmousemove = null;
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
  window.game.inventory.find(
    (item) =>
      item &&
      !item.slot &&
      xCell >= item.xPosition &&
      xCell < item.xPosition + item.xSize &&
      yCell >= item.yPosition &&
      yCell < item.yPosition + item.ySize,
  );

const getInventoryLineColor = (index, max) => (index === max || index === 0 ? 'black' : 'grey');

const drawInventoryHorizontalLines = () => {
  for (let i = 0; i <= RULES.INVENTORY_HEIGHT; i++) {
    const yPosition =
      RULES.INVENTORY_CELL_HEIGHT * i + RULES.INVENTORY_PADDING_SIZE + RULES.TILE_SIZE;
    window.ctx.strokeStyle = getInventoryLineColor(i, RULES.INVENTORY_HEIGHT);
    window.ctx.beginPath();
    window.ctx.moveTo(RULES.INVENTORY_PADDING_SIZE, yPosition);
    window.ctx.lineTo(
      RULES.INVENTORY_PADDING_SIZE + RULES.INVENTORY_CELL_WIDTH * RULES.INVENTORY_WIDTH,
      yPosition,
    );
    window.ctx.stroke();
  }
};

const drawInventoryVerticalLines = () => {
  for (let i = 0; i <= RULES.INVENTORY_WIDTH; i++) {
    const xPosition = RULES.INVENTORY_CELL_WIDTH * i + RULES.INVENTORY_PADDING_SIZE;
    window.ctx.strokeStyle = getInventoryLineColor(i, RULES.INVENTORY_WIDTH);
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
};

const drawInventory = (exclusionList) => {
  window.ctx.clearRect(
    RULES.INVENTORY_PADDING_SIZE,
    RULES.INVENTORY_PADDING_SIZE + RULES.TILE_SIZE,
    RULES.INVENTORY_PADDING_SIZE + RULES.INVENTORY_CELL_WIDTH * RULES.INVENTORY_WIDTH,
    RULES.INVENTORY_PADDING_SIZE +
      RULES.INVENTORY_CELL_HEIGHT * RULES.INVENTORY_HEIGHT +
      RULES.TILE_SIZE,
  );
  window.ctx.lineWidth = 1;
  drawInventoryHorizontalLines();
  drawInventoryVerticalLines();
  window.game.inventory.forEach((i) => (exclusionList || []).includes(i) || i.draw());
  drawGear();
};

const drawGearBackground = () => {
  window.ctx.clearRect(
    RULES.INVENTORY_PADDING_SIZE + RULES.INVENTORY_WIDTH * RULES.INVENTORY_CELL_WIDTH,
    RULES.INVENTORY_PADDING_SIZE + RULES.TILE_SIZE,
    window.canvas.width,
    window.canvas.height,
  );
  const gearWidth = (85 / 67) * RULES.EQUIPMENT_PANEL_SIZE;
  window.ctx.drawImage(
    window.images.gear,
    window.canvas.width - gearWidth - RULES.EQUIPMENT_PANEL_PADDING_SIZE,
    RULES.TILE_SIZE + RULES.EQUIPMENT_PANEL_PADDING_SIZE,
    gearWidth,
    RULES.EQUIPMENT_PANEL_SIZE,
  );
};

const drawGear = () => {
  drawGearBackground();
  window.game.inventory.forEach((i) => {
    if (i.slot) {
      i.draw();
    }
  });
};
