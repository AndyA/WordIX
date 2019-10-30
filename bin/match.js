const Search = require("../webapp/lib/js/search");
const Board = require("../webapp/lib/js/board");
const Trie = require("../webapp/lib/js/trie");

const fs = require("fs");

const WORDS = "ref/enable2k.txt";

let words = fs
  .readFileSync(WORDS)
  .toString()
  .split("\n")
  .filter(w => w.length);

const trie = new Trie(words);

for (const word of process.argv.slice(2)) {
  const search = new Search(trie, makeView("", 20), word.toUpperCase());
  const matches = search.matches();
  const words = matches
    .map(m => m.word)
    .sort((a, b) => {
      return a.length - b.length || a.localeCompare(b);
    });
  for (const w of words) console.log(w);
}

function makeView(word, size) {
  const b = new Board({
    width: size,
    height: size
  });
  const v = b.view(1, Math.floor(size / 2), "across");
  for (const x in word) {
    const lt = word[x];
    let cell = v.cell(x, 0);
    if (lt !== "*") v.cell(x, 0).tile = makeTile(lt);
  }
  return v;
}
