import _ from "lodash";

import Player from "./player";

export default class Game {
  constructor(opt) {
    Object.assign(this, {
      players: 2,
      nextPlayer: 0
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
      player.tray.fillFrom(this.bag, this.rules.traySize);
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
}
