function setupCanvas() {
  const canvas = document.querySelector("canvas");
  ctx = canvas.getContext("2d");
  canvas.width = RULES.TILE_SIZE * (RULES.NUMBER_OF_TILES);
  canvas.height = RULES.TILE_SIZE;
  ctx.imageSmoothingEnabled = false;
}
