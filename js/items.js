class Item {
  constructor(name, xSize, ySize, xPosition, yPosition, sprite, slot, rangeModifier = 0) {
    this.name = name;
    this.xSize = xSize;
    this.ySize = ySize;
    this.xPosition = xPosition;
    this.yPosition = yPosition;
    this.sprite = sprite;
    this.slot = slot;
    this.damageHistory = {};
    this.rangeModifier = rangeModifier;
  }

  getValidSlots() {
    return [];
  }

  equip(slot) {
    this.xPosition = null;
    this.yPosition = null;
    this.slot = slot;
    if (!window.game.inventory.items.find((i) => i === this)) {
      window.game.inventory.items.push(this);
    }
  }

  unequip(x, y) {
    this.xPosition = x;
    this.yPosition = y;
    this.slot = null;
    if (!window.game.inventory.items.find((i) => i === this)) {
      window.game.inventory.items.push(this);
    }
  }

  attack(player, enemy) {
    const result = this.generateDamage(player, enemy);
    this.damageHistory[result] = (this.damageHistory[result] || 0) + 1;
    window.game.description.draw();
    return result;
  }

  generateDamage() {
    return 1;
  }

  getDamageHistory() {
    return this.damageHistory;
  }

  draw(overrideX, overrideY) {
    if (!this.slot || overrideX || overrideY) {
      window.ctx.drawImage(
        this.sprite,
        overrideX
          ? overrideX
          : this.xPosition * RULES.INVENTORY_CELL_WIDTH + RULES.INVENTORY_PADDING_SIZE,
        overrideY
          ? overrideY
          : this.yPosition * RULES.INVENTORY_CELL_HEIGHT +
              RULES.INVENTORY_PADDING_SIZE +
              RULES.COMBAT_BAR_HEIGHT,
        this.xSize * RULES.INVENTORY_CELL_WIDTH,
        this.ySize * RULES.INVENTORY_CELL_HEIGHT,
      );
    }
    if (this.slot) {
      const drawSizeX = this.xSize * RULES.INVENTORY_CELL_WIDTH;
      const drawSizeY = this.ySize * RULES.INVENTORY_CELL_HEIGHT;
      window.ctx.drawImage(
        this.sprite,
        (this.slot.xEnd - this.slot.xStart) / 2 + this.slot.xStart - drawSizeX / 2,
        (this.slot.yEnd - this.slot.yStart) / 2 + this.slot.yStart - drawSizeY / 2,
        drawSizeX,
        drawSizeY,
      );
    }
  }
}

/* eslint-disable-next-line no-unused-vars */
class Dagger extends Item {
  constructor(xPosition, yPosition, slot) {
    super('Dagger', 1, 1, xPosition, yPosition, window.images.dagger, slot);
  }

  generateDamage() {
    return Math.ceil(Math.random() * 4);
  }

  getValidSlots() {
    return [SLOTS.HAND_PRIMARY];
  }
}

/* eslint-disable-next-line no-unused-vars */
class ShortSword extends Item {
  constructor(xPosition, yPosition, slot) {
    super('Short Sword', 1, 2, xPosition, yPosition, window.images.shortsword, slot);
  }

  generateDamage() {
    return Math.ceil(Math.random() * 6);
  }

  getValidSlots() {
    return [SLOTS.HAND_PRIMARY];
  }
}

/* eslint-disable-next-line no-unused-vars */
class BroadSword extends Item {
  constructor(xPosition, yPosition, slot) {
    super('Broad Sword', 2, 3, xPosition, yPosition, window.images.broadsword, slot);
  }

  generateDamage() {
    return Math.ceil(Math.random() * 6) + Math.ceil(Math.random() * 6);
  }

  getValidSlots() {
    return [SLOTS.HAND_PRIMARY];
  }
}

/* eslint-disable-next-line no-unused-vars */
class Longbow extends Item {
  constructor(xPosition, yPosition, slot) {
    super('Long Bow', 2, 3, xPosition, yPosition, window.images.longbow, slot, 150);
  }

  generateDamage(player, enemy) {
    const distance = enemy.x - player.x;
    if (distance >= this.rangeModifier) {
      return Math.ceil(Math.random() * 4) + 2;
    }
    return Math.ceil(Math.random() * 8);
  }

  getValidSlots() {
    return [SLOTS.HAND_PRIMARY];
  }
}

/* eslint-disable-next-line no-unused-vars */
class Ring extends Item {
  constructor(xPosition, yPosition, slot) {
    super('Ring', 1, 1, xPosition, yPosition, window.images.ring, slot);
  }

  getValidSlots() {
    return [SLOTS.RING_PRIMARY, SLOTS.RING_SECONDARY];
  }
}
