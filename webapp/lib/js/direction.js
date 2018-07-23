class Direction {
  constructor(dx, dy) {
    if (dx < -1 || dx > 1 || dy < -1 || dy > 1)
      throw new Error("Direction out of range");
    if (dx === 0 && dy === 0)
      throw new Error("Direction has zero length");
    this.dx = dx;
    this.dy = dy;
  }

  get flipped() {
    return new Direction(this.dy, this.dx);
  }

  get reversed() {
    return new Direction(-this.dx, -this.dy);
  }

  vector(len) {
    return [this.dx * len, this.dy * len];
  }
}

module.exports = Direction;
