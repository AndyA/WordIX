const Bag = require("./bag")

class Player {
  constructor(opt) {
    Object.assign(this, {}, opt);
    this.tray = this.tray || new Bag();
  }
}

module.exports = Player;
