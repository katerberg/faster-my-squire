function setupCanvas() {
  const canvas = document.querySelector("canvas");
  window.ctx = canvas.getContext("2d");
  canvas.width = RULES.TILE_SIZE * (RULES.NUMBER_OF_TILES);
  canvas.height = RULES.TILE_SIZE + Math.max(
    RULES.EQUIPMENT_PANEL_SIZE + RULES.EQUIPMENT_PANEL_PADDING_SIZE,
    RULES.INVENTORY_CELL_HEIGHT * RULES.INVENTORY_HEIGHT + RULES.INVENTORY_PADDING_SIZE * 2,
  );
  window.images.gear.onload = () => {
    const gearWidth = 85/67 * RULES.EQUIPMENT_PANEL_SIZE;
    window.ctx.drawImage(
      window.images.gear,
      canvas.width - gearWidth - RULES.EQUIPMENT_PANEL_PADDING_SIZE,
      RULES.TILE_SIZE + RULES.EQUIPMENT_PANEL_PADDING_SIZE,
      gearWidth,
      RULES.EQUIPMENT_PANEL_SIZE,
    );
  }
  window.ctx.imageSmoothingEnabled = false;
  drawInventory();
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
  window.ctx.lineWidth = 1;
  drawInventoryHorizontalLines();
  drawInventoryVerticalLines();

  window.images.sword.onload = () => {
    window.ctx.drawImage(
      window.images.sword,
      RULES.INVENTORY_PADDING_SIZE,
      RULES.INVENTORY_PADDING_SIZE + RULES.TILE_SIZE,
    );
  }
}
