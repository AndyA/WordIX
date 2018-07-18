import Bag from "./bag";

export default class Player {
  constructor(opt) {
    Object.assign(this, {}, opt);
    this.tray = this.tray || new Bag();
  }
}
