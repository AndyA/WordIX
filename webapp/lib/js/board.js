const BoardView = require("./board-view")
const Direction = require("./direction");

class Cell {
  constructor(tile, special) {
    this.tile = tile || null;
    this.special = special || [];
  }
}

class Board {
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
      for (let x = 0; x < this.width; x++)
        row.push(new Cell);
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

  cell(x, y) {
    if (x < 0 || x >= this.width || y < 0 || y >= this.height)
      throw new Error("Board coordinates out of range");
    return this.board[y][x];
  }

  view(x, y, dir) {
    return new BoardView(this, x, y, dir);
  }

  each(func) {
    for (let y = 0; y < this.height; y++)
      for (let x = 0; x < this.width; x++)
        func(this.cell(x, y), x, y);
  }
}

module.exports = Board;
