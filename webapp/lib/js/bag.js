import _ from "lodash";

export default class Bag {
  constructor(tiles) {
    this.tiles = tiles || [];
  }

  get size() {
    return this.tiles.length;
  }

  add(...tiles) {
    Array.prototype.push.apply(this.tiles, tiles);
  }

  pull(idx) {
    return _.pullAt(this.tiles, idx);
  }

  take(n) {
    const idx = _.shuffle(_.range(this.size));
    return this.pull(idx.slice(0, n));
  }

  fillFrom(bag, n) {
    const need = n - this.size;
    this.add(bag.take(need));
  }
}
