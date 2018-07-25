const ArrayPicker = require("./array-picker");

class Play {
  constructor(turn, view, match) {
    this.turn = turn;
    this.view = view;
    this.word = match.word;

    const fp = ArrayPicker.reverseIndex(match.path.map(x => x.bagPos));
    this.path = match.path.map((x, i) => {
      return { ...x,
        bagPos: fp[i],
        cell: view.cell(i, 0)
      }
    });
  }

  get rules() {
    return this.turn.rules;
  }

  get score() {
    return this._score = this._score || this.rules.computeScore(this);
  }

  _takeFromRack() {
    const pick = this.path.map(x => x.bagPos)
      .filter(x => x !== undefined);
    this.turn.player.tray.pull(pick);
  }

  _playTiles() {
    for (const x in this.path) {
      const node = this.path[x];
      node.tile.letter = node.letter;
      this.view.cell(x, 0).tile = node.tile;
    }
  }

  commit() {
    this._takeFromRack();
    this._playTiles();
  }
}

module.exports = Play;
