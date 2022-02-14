function setupCanvas() {
  const canvas = document.querySelector("canvas");
  window.ctx = canvas.getContext("2d");
  canvas.width = RULES.TILE_SIZE * (RULES.NUMBER_OF_TILES);
  canvas.height = RULES.TILE_SIZE + RULES.EQUIPMENT_PANEL_SIZE + RULES.EQUIPMENT_PANEL_PADDING_SIZE;
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
}

const drawInventory = () => {

}
