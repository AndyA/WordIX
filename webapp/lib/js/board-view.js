const Transform = require("./transform");

class BoardView {
  constructor(board, trans) {
    const [ox, oy] = trans.origin;

    if (ox < 0 || ox >= board.width || oy < 0 || oy >= board.height)
      throw new Error("View outside board");

    this.board = board;
    this.trans = trans;
  }

  get bounds() {
    if (this._bounds)
      return this._bounds;
    const inv = this.trans.inverse;
    const b = this.board;
    const bl = inv.xy(0, 0);
    const tr = inv.xy(b.width - 1, b.height - 1);
    return [...bl, ...tr];
  }

  cell(x, y) {
    const [cx, cy] = this.trans.xy(x, y);
    return this.board.cell(cx, cy);
  }
}

module.exports = BoardView;
