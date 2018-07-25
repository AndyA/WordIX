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

  get length() {
    if (this._length !== undefined)
      return this._length;
    return this._length = this.parent ? this.parent.length + 1 : 0;
  }

  get path() {
    return this._path = this._path || this.flatten();
  }

  get word() {
    return this._word = this._word || this.path.map(p => p.letter)
      .join("");
  }
}

class Search {
  constructor(trie, view, bag) {
    this.trie = trie;
    this.view = view;
    this.bag = bag;
  }

  _tiles(obj) {
    if (_.isString(obj))
      return this._tiles(obj.split(""));
    if (!_.isArray(obj))
      throw new Error("Need a string or an array");
    return obj.map(x => makeTile(x));
  }

  _match(sp, bag, level, cb) {
    if (!sp) return;
    const nd = sp.nd;
    if (!nd) return;
    const x = sp.length;
    const view = sp.view;

    if (view) {
      const max = view.maxX;
      if (x > max)
        return;

      if (x < max) {
        const tile = view.tile(x, 0);
        if (tile) {
          this._match(sp.advance({
              tile: tile,
              letter: tile.letter
            }),
            bag, level, cb);
          return;
        }
      }
    }

    // Got a match?
    if (nd["*"])
      cb(sp);

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

        this._match(sp.advance({
          letter: lt,
          tile,
          bagPos
        }), nextBag, level, cb);
      }
    }
  }

  // TODO how to handle board edge?
  match(cb) {
    const tiles = this._tiles(this.bag);

    this._match(new SearchPath(this.view, this.trie.root),
      tiles, 0, cb);
  }

  matches() {
    var m = [];
    this.match(match => {
      m.push(match);
    });
    return m;
  }
}

module.exports = Search;
