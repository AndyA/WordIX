export default class Board {
  constructor(opt) {
    Object.assign(this, {
      width: 15,
      height: 15,
    }, opt);

    if (!this.board)
      this.clear();
  }

  _emptyBoard() {
    let board = [];
    for (let y = 0; y < this.height; y++) {
      let row = [];
      for (let x = 0; x < this.width; x++) {
        row.push({
          tile: null,
          rules: [],
        });
      }
      board.push(row);
    }
    return board;
  }

  clear() {
    this.board = this._emptyBoard();
  }

  get used() {
    let count = 0;
    for (const row of this.board || [])
      for (const cell of row)
        if (cell.tile) count++;
    return count;
  }

  get size() {
    return this.width * this.height;
  }

  get free() {
    return this.size - this.used;
  }
}
