const Transform = require("./transform");

class BoardView {
  constructor(board, trans) {
    const [ox, oy] = trans.origin;

    if (ox < 0 || ox >= board.width ||
      oy < 0 || oy >= board.height)
      throw new Error("View outside board (" +
        `[${ox}, ${oy}] v [${board.width}, ${board.height}])`);

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

  get minX() {
    return this.bounds[0];
  }

  get minY() {
    return this.bounds[1];
  }

  get maxX() {
    return this.bounds[2];
  }

  get maxY() {
    return this.bounds[3];
  }

  get origin() {
    return this.trans.origin;
  }

  xy(x, y) {
    return this.trans.xy(x, y);
  }

  cell(x, y) {
    const [cx, cy] = this.xy(x, y);
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

  flip() {
    return new BoardView(this.board, this.trans.flipped);
  }

  get flipped() {
    return this.flip();
  }

  moveLeft() {
    const min = this.minX;
    let ofs = -1;
    while (ofs >= min && this.tile(ofs, 0)) ofs--;
    return this.recentre(ofs + 1, 0);
  }
}

module.exports = BoardView;
