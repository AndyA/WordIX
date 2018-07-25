const Play = require("./play");

class Turn {
  constructor(game, player, opt) {
    this.game = game;
    this.player = player;
    this.opt = Object.assign({}, {}, opt);
  }

  get rules() {
    return this.game.rules;
  }

  findPlays(cb) {
    const {
      board,
      rules,
      trie
    } = this.game;
    const tray = this.player.tray;

    let tried = {};
    rules.eachValid(board, (x, y, dir) => {
      const v = board.view(x, y, dir).moveLeft();
      const key = [v.origin.join(", "), dir].join(" ");
      if (tried[key]) return;
      tried[key] = true;
      trie.match(tray.tiles, {
        view: v
      }, (match) => {
        cb(new Play(this, v, match));
      });
    });
  }

  get possiblePlays() {
    if (this._possible)
      return this._possible;
    let plays = [];
    this.findPlays(play => plays.push(play));
    return this._possible = plays;
  }
}

module.exports = Turn;
