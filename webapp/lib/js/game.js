const _ = require("lodash")

const Player = require("./player")

class Game {
  constructor(opt) {
    Object.assign(this, {
      players: 2,
      next: 0
    }, opt);

    if (!this.rules)
      throw new Error("Missing option: rules");
    if (!this.trie)
      throw new Error("Missing option: trie");

    this._init();
  }

  _makePlayers(n) {
    let pl = [];
    for (let pn = 1; pn <= n; pn++) {
      let player = new Player({
        name: "Player " + pn
      });
      this.fillTray(player);
      pl.push(player);
    }
    return pl;
  }

  _init() {
    this.board = this.board || this.rules.makeBoard();
    this.bag = this.bag || this.rules.makeBag();

    if (_.isNumber(this.players))
      this.players = this._makePlayers(this.players);
    if (!_.isArray(this.players))
      throw new Error("players must be a number or an array of players");
  }

  get canPlay() {
    for (const p of this.players)
      if (p.tray.size === 0)
        return false;
    return true;
  }

  nextPlayer() {
    const p = this.players[this.next++];
    if (this.next == this.players.length)
      this.next = 0;
    return p;
  }

  fillTray(player) {
    player.tray.fillFrom(this.bag, this.rules.traySize);
  }
}

module.exports = Game;
