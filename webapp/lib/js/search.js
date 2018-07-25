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

  skip() {
    let sp = this;
    const max = this.view.maxX;
    for (let x = 0; x <= max; x++) {
      const tile = this.view.tile(x, 0);
      if (!tile) break;
      const next = sp.advance({
        tile,
        letter: tile.letter
      })
      if (!next) break;
      sp = next;
    }
    return sp;
  }

  advanceAndSkip(step) {
    let sp = this.advance(step);
    if (!sp) return null;
    return sp.skip();
  }

  get terminal() {
    return !!this.nd["*"];
  }

  get validLetters() {
    return this._vl = this._vl || Object.keys(this.nd)
      .filter(x => x !== "*")
      .sort();
  }

  get length() {
    if (this._length !== undefined)
      return this._length;
    return this._length = this.parent ? this.parent.length + 1 : 0;
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

class Search {
  constructor(trie, view, bag) {
    this.trie = trie;
    this.view = view;
    this.bag = bag;
    this._cp = {};
  }

  _tiles(obj) {
    if (_.isString(obj))
      return this._tiles(obj.split(""));
    if (!_.isArray(obj))
      throw new Error("Need a string or an array");
    return obj.map(x => makeTile(x));
  }

  _hasCrossWord(view, x) {
    return (view.minY < 0 && view.tile(x, -1)) ||
      (view.maxY > 0 && view.tile(x, 1));
  }

  _makeCrossPath(view, x) {
    if (!this._hasCrossWord(view, x))
      return null;

    const cv = view.recentre(x, 0)
      .flip()
      .moveLeft();
    return new SearchPath(cv, this.trie)
      .skip();
  }

  _crossPath(x) {
    let cp = this._cp;
    if (cp.hasOwnProperty(x)) return cp[x];
    return cp[x] = this._makeCrossPath(this.view, x);
  }

  _match(sp, bag, cb) {
    if (!sp) return;

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
            bag, cb);
          return;
        }
      }
    }

    // Got a match?
    if (sp.terminal)
      cb(sp);

    // Check the bag
    let seen = {};
    const cp = this._crossPath(x);

    for (let bagPos = 0; bagPos < bag.length; bagPos++) {
      const tile = bag[bagPos];
      const letter = tile.matchLetter;

      // Only process each letter once
      if (seen[letter]) continue;
      seen[letter] = true;

      // Expand wildcard
      const letters = letter === "*" ? sp.validLetters : [letter];

      let nextBag = null; // lazily created

      for (let lt of letters) {
        let nextTile = {
          letter: lt,
          tile,
          bagPos
        };

        // Match cross word
        if (cp) {
          let ncp = cp.advanceAndSkip({
            letter: lt,
            tile
          });
          if (!ncp || !ncp.terminal) continue;
          nextTile.cross = ncp;
        }

        const nextPath = sp.advance(nextTile);
        if (!nextPath) continue;

        if (!nextBag) {
          nextBag = bag.slice(0);
          nextBag.splice(bagPos, 1);
        }

        this._match(nextPath, nextBag, cb);
      }
    }
  }

  match(cb) {
    const tiles = this._tiles(this.bag);

    this._match(new SearchPath(this.view, this.trie.root),
      tiles, cb);
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
