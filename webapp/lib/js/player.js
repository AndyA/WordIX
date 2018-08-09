const MW = require("mixwith");

const Bag = require("./bag")
const Generation = require("./mixin/generation");

class Player extends MW.mix(Object)
  .with(Generation) {
    constructor(opt) {
      super();
      Object.assign(this, {}, opt);
      this.tray = this.tray || new Bag;
      this.score = 0;
    }
  }

module.exports = Player;
