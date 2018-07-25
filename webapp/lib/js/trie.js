const _ = require("lodash");

const ArrayPicker = require("./array-picker");
const BoardView = require("./board-view");

const {
  makeTile
} = require("./tile");

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

  _match(nd, opt, path, pos, bag, cellFunc, wordFunc) {
    if (!nd) return;

    if (opt.max !== undefined && pos > opt.max)
      return;

    if (opt.max === undefined || pos < opt.max) {
      // Got a fixed cell?
      const cell = makeTile(cellFunc(pos));
      if (cell) {
        this._match(nd[cell.letter], opt, [...path, {
            tile: cell,
            letter: cell.letter
          }], pos + 1,
          bag, cellFunc, wordFunc);
        return;
      }
    }

    // Got a match?
    if (nd["*"]) {
      wordFunc(path.map(p => p.letter)
        .join(""), path);
    }

    // Check the bag
    let seen = {};
    for (let bagPos = 0; bagPos < bag.length; bagPos++) {
      const tile = bag[bagPos];
      const letter = tile.matchLetter;

      // Only process each letter once
      if (seen[letter]) continue;
      seen[letter] = true;

      // Expand wildcard
      const letters = letter === "*" ? Object.keys(nd)
        .filter(lt => lt !== "*")
        .sort() : [letter];

      let nextBag = null; // lazily created

      for (let lt of letters) {
        const nextNode = nd[lt];
        if (!nextNode)
          continue;
        if (!nextBag) {
          nextBag = bag.slice(0);
          nextBag.splice(bagPos, 1);
        }
        this._match(nextNode, opt, [...path, {
          letter: lt,
          tile,
          bagPos
        }], pos + 1, nextBag, cellFunc, wordFunc);
      }
    }
  }

  _cellFunc(f) {
    if (!f)
      return x => null;
    if (_.isFunction(f))
      return f;
    // View?
    if (f instanceof BoardView)
      return (x, y) => f.cell(x, y)
        .tile;
    const tiles = this._tiles(f);
    // Default cellFunc indexes into tiles
    return x => {
      if (x < 0 || x >= tiles.length)
        return null;
      const tile = tiles[x];
      if (tile && tile.matchLetter === "*")
        return null;
      return tile;
    }
  }

  // TODO how to handle board edge?
  match(bag, wordFunc, opt) {
    const o = opt || {};
    const tiles = this._tiles(bag);

    this._match(this.root, o, [], 0, tiles,
      this._cellFunc(o.cells), wordFunc);
  }

  matches(bag, opt) {
    var m = [];
    this.match(bag, (word, path) => {
      m.push({
        word,
        path
      });
    }, opt);
    return m;
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
