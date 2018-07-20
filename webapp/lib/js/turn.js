const Play = require("./play");

class Turn {
  constructor(game, player, opt) {
    this.game = game;
    this.player = player;
    this.opt = Object.assign({}, {}, opt);
  }

  _findWords(x, y, dx, dy) {
    const tray = this.player.tray;
    const view = this.game.board.view(x, y, dx, dy);
  }

  _possiblePlays() {
    const {
      board,
      rules,
      trie
    } = this.game;

    const tray = this.player.tray;
    console.log("tray: " + this.player.tray);
    if (board.used === 0) {
      const cx = Math.floor(board.width / 2);
      const y = Math.floor(board.height / 2);
      const [dx, dy] = rules.rules.board.direction[0];
      for (let ox = 0; ox < tray.size && cx - ox >= 0; ox++) {
        const v = board.view(cx - ox, y, dx, dy);
        const found = trie.matches(tray.tiles, {
            max: v.max,
            cell: pos => v.cell(pos)
              .tile
          })
          .map(x => new Play(this, v, x));
        console.log(JSON.stringify(found.map(x => x.path), null, 2));
      }
    } else {
      for (const [dx, dy] of rules.rules.board.direction) {
        console.log({
          dx,
          dy
        })
      }
    }
  }

  get possiblePlays() {
    return this._possible = this._possible || this._possiblePlays();
  }
}

module.exports = Turn;
