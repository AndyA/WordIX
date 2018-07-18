const _ = require("lodash");

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

  _match(nd, path, pos, bag, cellFunc, wordFunc) {
    if (!nd) return;

    const cell = cellFunc(pos);
    if (cell) {
      this._match(nd[cell], [...path, {
          letter: cell,
          type: "fixed"
        }], pos + 1,
        bag, cellFunc, wordFunc);
      return;
    }

    if (nd["*"])
      wordFunc(path.map(p => p.letter)
        .join(""), path);

    let seen = {};
    for (let lpos in bag) {
      const letter = bag[lpos];

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
          nextBag.splice(lpos, 1);
        }
        this._match(nextNode, [...path, {
            letter: lt,
            type: letter === "*" ? "wild" : "picked"
          }], pos + 1,
          nextBag, cellFunc, wordFunc);
      }
    }
  }

  match(bag, cellFunc, wordFunc) {
    if (_.isString(bag))
      bag = bag.split("");
    if (!wordFunc)
      [wordFunc, cellFunc] = [cellFunc, x => null];
    this._match(this.root, [], 0, bag.slice(0)
      .sort(), cellFunc, wordFunc);
  }

  valid(word) {
    let nd = this.root;
    for (const lt of word) {
      const nextNode = nd[lt];
      if (!nextNode) return false;
      nd = nextNode;
    }
    return !!nd["*"];
  }
}

module.exports = Trie;
