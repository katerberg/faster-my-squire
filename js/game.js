let dragging = null;

function setupCanvas() {
  window.canvas = document.querySelector("canvas");
  window.ctx = window.canvas.getContext("2d");
  window.canvas.width = RULES.TILE_SIZE * (RULES.NUMBER_OF_TILES);
  window.canvas.height = RULES.TILE_SIZE + Math.max(
    RULES.EQUIPMENT_PANEL_SIZE + RULES.EQUIPMENT_PANEL_PADDING_SIZE,
    RULES.INVENTORY_CELL_HEIGHT * RULES.INVENTORY_HEIGHT + RULES.INVENTORY_PADDING_SIZE * 2,
  );
  window.images.gear.onload = () => {
    const gearWidth = 85/67 * RULES.EQUIPMENT_PANEL_SIZE;
    window.ctx.drawImage(
      window.images.gear,
      window.canvas.width - gearWidth - RULES.EQUIPMENT_PANEL_PADDING_SIZE,
      RULES.TILE_SIZE + RULES.EQUIPMENT_PANEL_PADDING_SIZE,
      gearWidth,
      RULES.EQUIPMENT_PANEL_SIZE,
    );
  }
  window.ctx.imageSmoothingEnabled = false;

  window.images.sword.onload = () => {
    drawInventory();
  }
  window.canvas.onmousedown = handleMouseDown;
  window.canvas.onmouseup = handleMouseUp;
}

const handleMouseMove = (e) => {

}

const isCellInsideInventory = (x, y) => {
  return x >= 0 && x < RULES.INVENTORY_WIDTH && y >= 0 && y < RULES.INVENTORY_HEIGHT;
}

const isItemInsideInventory = (x, y, item) => {
  const yMax = y + item.ySize - 1;
  const xMax = x + item.xSize - 1;
  return isCellInsideInventory(x, y) &&
    isCellInsideInventory(xMax, y) && 
    isCellInsideInventory(x, yMax) && 
    isCellInsideInventory(xMax, yMax);
}

const isEventInsideInventory = (e) => {
  return e.layerX > RULES.INVENTORY_PADDING_SIZE &&
    e.layerX < RULES.INVENTORY_PADDING_SIZE + RULES.INVENTORY_CELL_WIDTH * RULES.INVENTORY_WIDTH &&
    e.layerY > RULES.INVENTORY_PADDING_SIZE + RULES.TILE_SIZE &&
    e.layerY < RULES.INVENTORY_PADDING_SIZE + RULES.INVENTORY_CELL_HEIGHT * RULES.INVENTORY_HEIGHT + RULES.TILE_SIZE;
}

const getCell = (e) => {
  const xCell = Math.floor((e.layerX - RULES.INVENTORY_PADDING_SIZE) / 32);
  const yCell = Math.floor((e.layerY - RULES.INVENTORY_PADDING_SIZE - RULES.TILE_SIZE) / 32);
  return [xCell, yCell];
}

const getItem = (e) => {
  const [xCell, yCell] = getCell(e);
  return window.game.inventory.find(item => {
    return item && xCell >= item.xPosition &&
      xCell < item.xPosition + item.xSize &&
      yCell >= item.yPosition &&
      yCell < item.yPosition + item.ySize;
  });
}

const handleMouseDown = (e) => {
  console.log(e)
  if (isEventInsideInventory(e)) {
    const item = getItem(e);
    if (item) {
      const [selectedX, selectedY] = getCell(e);
      dragging = {
        item,
        offsetX: selectedX - item.xPosition,
        offsetY: selectedY - item.yPosition,
      };
      window.canvas.onmousemove = handleMouseMove;
    }
  }
}

const handleMouseUp = (e) => {
  if (dragging) {
    console.log(e)
    if (isEventInsideInventory(e)) {
      const [xCell, yCell] = getCell(e);
      const newX = xCell - dragging.offsetX;
      const newY = yCell - dragging.offsetY;
      console.log(newX, newY);
      if (isItemInsideInventory(newX, newY, dragging.item)) {
        console.log('dropped inside')
        dragging.item.xPosition = newX;
        dragging.item.yPosition = newY;
      }
      drawInventory();
    }
    dragging = null;
  }
  window.canvas.onmousemove = null;
}

const getInventoryLineColor = (index, max) => {
  return index === max || index === 0 ? 'black' : 'grey';
}

const drawInventoryHorizontalLines = () => {
  for (let i=0; i <= RULES.INVENTORY_HEIGHT; i++) {
    const yPosition = RULES.INVENTORY_CELL_HEIGHT * i + RULES.INVENTORY_PADDING_SIZE + RULES.TILE_SIZE;
    window.ctx.strokeStyle = getInventoryLineColor(i, RULES.INVENTORY_HEIGHT);
    window.ctx.beginPath();
    window.ctx.moveTo(RULES.INVENTORY_PADDING_SIZE, yPosition);
    window.ctx.lineTo(
      RULES.INVENTORY_PADDING_SIZE + RULES.INVENTORY_CELL_WIDTH * RULES.INVENTORY_WIDTH,
      yPosition,
    );
    window.ctx.stroke();
  }
}

const drawInventoryVerticalLines = () => {
  for (let i=0; i <= RULES.INVENTORY_WIDTH; i++) {
    const xPosition = RULES.INVENTORY_CELL_HEIGHT * i + RULES.INVENTORY_PADDING_SIZE;
    window.ctx.strokeStyle = getInventoryLineColor(i, RULES.INVENTORY_WIDTH);
    window.ctx.beginPath();
    window.ctx.moveTo(xPosition, RULES.INVENTORY_PADDING_SIZE + RULES.TILE_SIZE);
    window.ctx.lineTo(
      xPosition,
      RULES.INVENTORY_PADDING_SIZE + RULES.INVENTORY_CELL_HEIGHT * RULES.INVENTORY_HEIGHT + RULES.TILE_SIZE,
    );
    window.ctx.stroke();
  }
}

const drawInventory = () => {
  window.ctx.clearRect(
    RULES.INVENTORY_PADDING_SIZE,
    RULES.INVENTORY_PADDING_SIZE + RULES.TILE_SIZE,
    RULES.INVENTORY_PADDING_SIZE + RULES.INVENTORY_CELL_WIDTH * RULES.INVENTORY_WIDTH,
    RULES.INVENTORY_PADDING_SIZE + RULES.INVENTORY_CELL_HEIGHT * RULES.INVENTORY_HEIGHT + RULES.TILE_SIZE,
  );
  window.ctx.lineWidth = 1;
  drawInventoryHorizontalLines();
  drawInventoryVerticalLines();
  window.game.inventory.forEach(i=>i.draw());
}
