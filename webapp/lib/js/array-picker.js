const _ = require("lodash");

class ArrayPicker {

  static adjustIndex(idx) {
    let src = idx.slice(0);
    let out = [];
    while (src.length) {
      const i = src.shift();
      out.push(i);
      src = src.map(x => x > i ? x - 1 : x);
    }
    return out;
  }

  static reverseIndex(idx) {
    let xl = _.range(idx.length);
    return this.multiSplice(xl, idx);
  }

  static multiSplice(src, pick) {
    return pick.map(i => src.splice(i, 1)[0]);
  }

  static pick(src, idx) {
    return this.multiSplice(src, this.adjustIndex(idx));
  }
}

module.exports = ArrayPicker;
