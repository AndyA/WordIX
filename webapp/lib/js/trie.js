const _ = require("lodash");

const makeTile = require("./tile")
  .makeTile;

class SearchPath {
  constructor(view, nd, parent, step) {
    this.view = view;
    this.nd = nd;
    this.parent = parent;
    this.step = step;
  }

  advance(step) {
    const lt = step.letter;
    if (!lt) throw new Error("No letter defined in step");
    const next = this.nd[lt];
    if (!next) return null;
    return new SearchPath(this.view, next, this, step);
  }

  flatten() {
    let path = this.parent ? this.parent.flatten() : [];
    if (this.step)
      path.push(this.step);
    return path;
  }

  get path() {
    return this._path = this._path || this.flatten();
  }

  get word() {
    return this._word = this._word || this.path.map(p => p.letter)
      .join("");
  }
}

class Trie {
  constructor(words) {
    this.words = words.slice(0);
    this.words.sort();
  }

  _trieLevel(lo, hi, rank, ctx) {
    const words = this.words;

    let prevLetter, prevPos = lo,
      nd = {};

    for (let pos = lo; pos < hi; pos++) {
      const word = this.words[pos];
      if (rank <= word.length) {
        const letter = rank == word.length ? "*" : word[rank];
        if (prevLetter === undefined)
          prevLetter = letter;
        if (prevLetter !== letter) {
          nd[prevLetter] = this._trieLevel(prevPos, pos, rank + 1);
          [prevPos, prevLetter] = [pos, letter];
        }
      }
    }

    if (prevLetter !== undefined)
      nd[prevLetter] = this._trieLevel(prevPos, hi, rank + 1);

    return nd;
  }

  get root() {
    return this._root = this._root ||
      this._trieLevel(0, this.words.length, 0);
  }

  _tiles(obj) {
    if (_.isString(obj))
      return this._tiles(obj.split(""));
    if (!_.isArray(obj))
      throw new Error("Need a string or an array");
    return obj.map(x => makeTile(x));
  }

  valid(word) {
    let nd = this.root;
    const tiles = this._tiles(word);
    for (const tile of tiles) {
      const nextNode = nd[tile.letter];
      if (!nextNode) return false;
      nd = nextNode;
    }
    return !!nd["*"];
  }
}

module.exports = Trie;
