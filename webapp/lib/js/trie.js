export default class Trie {
  constructor(words) {
    this.words = words.slice(0);
    this.words.sort();
  }

  _trie_level(lo, hi, rank, ctx) {
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
          trie[prevLetter] = this._trie_level(prevPos, pos, rank + 1);
          prevPos = pos;
          prevLetter = letter;
        }
      }
    }

    if (prevLetter !== undefined)
      trie[prevLetter] = this._trie_level(prevPos, hi, rank + 1);

    return trie;
  }

  get trie() {
    this._trie = this._trie || this._trie_level(0, this.words.length, 0);
    return this._trie;
  }

  findWords(bag, cellFunc, wordFunc) {
    
  }
}
