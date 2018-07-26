const Bag = require("./bag")

class Player {
  constructor(opt) {
    Object.assign(this, {}, opt);
    this.tray = this.tray || new Bag;
    this.score = 0;
  }
}

module.exports = Player;
