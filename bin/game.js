const Rules = require("../webapp/lib/js/rules.js");
const Trie = require("../webapp/lib/js/trie.js");

const fs = require("fs");

const WORDS = "ref/dict.txt";

let words = fs.readFileSync(WORDS)
  .toString()
  .split("\n")
  .filter(w => w.length);

console.log("Loaded " + words.length + " words from " + WORDS);

const trie = new Trie(words);
trie.match("SXLEN*I", word => console.log(word));
