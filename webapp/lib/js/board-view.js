const Direction = require("./direction");

class BoardView {
  constructor(board, x, y, dir) {
    Object.assign(this, {
      board,
      x,
      y,
      dir
    });
  }

  get max() {
    return this._max = this._max || Math.min(
      this.dir.dx < 0 ? this.x : this.board.width - this.x - 1,
      this.dir.dy < 0 ? this.y : this.board.height - this.y - 1
    );
  }

  get min() {
    return this._min = this._min || Math.max(
      this.dir.dx > 0 ? -this.x : this.x - this.board.width + 1,
      this.dir.dy > 0 ? -this.y : this.y - this.board.height + 1
    );
  }

  xy(pos) {
    const [dx, dy] = this.dir.vector(pos);
    return [this.x + dx, this.y + dy];
  }

  get origin() {
    return [this.x, this.y];
  }

  cell(pos) {
    const [x, y] = this.xy(pos);
    return this.board.cell(x, y);
  }
}

module.exports = BoardView;
