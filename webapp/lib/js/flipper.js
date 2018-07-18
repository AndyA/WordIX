export default class Flipper {
  constructor(flips) {
    this.flips = flips || [];
  }

  _flip(items, ff) {
    var out = [];
    for (const i of items) {
      out.push(i);
      out.push(ff(...i));
    }
    return out;
  }

  flip(args, func) {
    var work = [args];
    for (const flip of this.flips)
      work = this._flip(work, flip);
    var seen = {};
    for (const a of work) {
      const key = JSON.stringify(a);
      if (seen[key]) continue;
      seen[key] = true;
      func(...a)
    }
  }

}
