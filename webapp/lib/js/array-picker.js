export default class ArrayPicker {

  static adjustIndex(idx) {
    var src = idx.slice(0);
    var out = [];
    while (src.length) {
      const i = src.shift();
      out.push(i);
      src = src.map(x => x > i ? x - 1 : x);
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
