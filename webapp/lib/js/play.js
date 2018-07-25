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

  commit() {

  }
}

module.exports = Play;
