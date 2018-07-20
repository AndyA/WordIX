const Rules = require("../webapp/lib/js/rules");
const Trie = require("../webapp/lib/js/trie");
const Game = require("../webapp/lib/js/game");
const Turn = require("../webapp/lib/js/turn");

const fs = require("fs");

const WORDS = "ref/dict.txt";

let words = fs.readFileSync(WORDS)
  .toString()
  .split("\n")
  .filter(w => w.length);

console.log("Loaded " + words.length + " words from " + WORDS);

const trie = new Trie(words);
const rules = new Rules();
const game = new Game({
  trie,
  rules
});

const turn = new Turn(game, game.players[0]);
console.log(turn.possiblePlays);

// trie.match("SXLEN*I", word => console.log(word));
