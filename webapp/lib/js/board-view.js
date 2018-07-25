const Transform = require("./transform");

class BoardView {
  constructor(board, trans) {
    const [ox, oy] = trans.origin;

    if (ox < 0 || ox >= board.width ||
      oy < 0 || oy >= board.height)
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

  get min() {
    return this.bounds[0];
  }

  get max() {
    return this.bounds[2];
  }

  get origin() {
    return this.trans.origin;
  }

  cell(x, y) {
    const [cx, cy] = this.trans.xy(x, y);
    return this.board.cell(cx, cy);
  }

  tile(x, y) {
    return this.cell(x, y)
      .tile;
  }

  recentre(x, y) {
    if (x === 0 && y === 0)
      return this;
    return new BoardView(this.board, this.trans.recentre(x, y));
  }

  get flipped() {
    return new BoardView(this.board, this.trans.flipped);
  }
}

module.exports = BoardView;
