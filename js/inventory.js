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

  equipItem(item, slot) {
    const foundItem = this.items.find(item);
    if (!foundItem) {
      logWarning('Did not find item to equip', item);
      return;
    }

    foundItem.positionX = null;
    foundItem.positionY = null;
    foundItem.slot = slot;
  }
}
