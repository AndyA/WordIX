export default class Trie {
  constructor(words) {
    this.words = words.slice(0);
    this.words.sort();
  }

  _trieLevel(lo, hi, rank, ctx) {
    const words = this.words;

    let prevLetter, prevPos = lo,
      trie = {};

    for (let pos = lo; pos < hi; pos++) {
      const word = this.words[pos];
      if (rank <= word.length) {
        const letter = rank == word.length ? "*" : word[rank];
        if (prevLetter === undefined)
          prevLetter = letter;
        if (prevLetter !== letter) {
          trie[prevLetter] = this._trieLevel(prevPos, pos, rank + 1);
          [prevPos, prevLetter] = [pos, letter];
        }
      }
    }

    if (prevLetter !== undefined)
      trie[prevLetter] = this._trieLevel(prevPos, hi, rank + 1);

    return trie;
  }

  get trie() {
    this._trie = this._trie ||
      this._trieLevel(0, this.words.length, 0);
    return this._trie;
  }

  _match(nd, word, pos, bag, cellFunc, wordFunc) {
    if (!nd) return;

    const cell = cellFunc(pos);
    if (cell) {
      this._match(nd[cell], word + cell, pos + 1,
        bag, cellFunc, wordFunc);
      return;
    }

    if (nd["*"])
      wordFunc(word);

    let seen = {};
    for (let lpos in bag) {
      const letter = bag[lpos];

      // Only process each letter once
      if (seen[letter]) continue;
      seen[letter] = true;

      // Expand wildcard
      const letters = letter === "*" ? Object.keys(nd)
        .filter(lt => lt !== "*").sort() : [letter];

      let nextBag = null; // lazily created

      for (let lt of letters) {
        const nextNode = nd[lt];
        if (!nextNode)
          continue;
        if (!nextBag) {
          nextBag = bag.slice(0);
          nextBag.splice(lpos, 1);
        }
        this._match(nextNode, word + lt, pos + 1,
          nextBag, cellFunc, wordFunc);
      }
    }
  }

  match(bag, cellFunc, wordFunc) {
    let sortedBag = bag.slice(0);
    sortedBag.sort();
    this._match(this.trie, "", 0,
      sortedBag, cellFunc, wordFunc);
  }

  valid(word) {
    let nd = this.trie;
    for (const lt of word) {
      const nextNode = nd[lt];
      if (!nextNode) return false;
      nd = nextNode;
    }
    return !!nd["*"];
  }
}
