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

function sortPlays(a, b) {
  if (a.score != b.score)
    return a.score - b.score;
  return a.word.localeCompare(b.word);
}

const turn = new Turn(game, game.players[0]);
console.log(turn.player.tray);
if (1) {
  turn.findPlays(play => {
    console.log("word: " + play.word + ", origin: " + play.view.origin +
      ", score: " + play.score);
  });
}
else {
  let plays = turn.possiblePlays;
  plays.sort(sortPlays);
  for (const play of plays) {
    console.log("word: " + play.word + ", origin: " + play.view.origin +
      ", score: " + play.score);
  }
}

// trie.match("SXLEN*I", word => console.log(word));
