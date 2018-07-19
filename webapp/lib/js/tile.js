const _ = require("lodash");

class Tile {
  constructor(lt, sc) {
    this.lt = lt;
    this.sc = sc;
  }

  get letter() {
    return this.lt;
  }

  get matchLetter() {
    return this.letter;
  }

  get score() {
    return this.sc;
  }
}

class WildTile extends Tile {
  set letter(lt) {
    this.lt = lt;
  }

  get matchLetter() {
    return "*";
  }

  get score() {
    return 0;
  }
}

function makeTile(letter, score) {
  if (letter === undefined || letter === null)
    return;
  if (_.isString(letter)) {
    if (letter === "*")
      return new WildTile();
    return new Tile(letter, score);
  }
  return letter; // assume it's a tile
}

module.exports = {
  Tile,
  WildTile,
  makeTile
};
