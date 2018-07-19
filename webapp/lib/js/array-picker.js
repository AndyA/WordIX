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
    let src = idx.slice(0);
    let step = [];
    let out = [];

    while (src.length) {
      const raw = src.shift();
      let cooked = raw;
      for (const pos of step)
        if (cooked >= pos)
          cooked++;
      step.unshift(raw);
      out.push(cooked);
    }

    return out;
  }

  static multiSplice(src, pick) {
    return pick.map(i => src.splice(i, 1)[0]);
  }

  static pick(src, idx) {
    return this.multiSplice(src, this.adjustIndex(idx));
  }
}

module.exports = ArrayPicker;
