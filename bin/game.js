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

function comparePlays(a, b) {
  return a.score - b.score ||
    a.word.localeCompare(b.word);
}

let limit = 2;
while (game.canPlay) {
  const player = game.nextPlayer();
  console.log("Player: " + player.tray + " (" + player.name + ")");
  const turn = new Turn(game, player);
  let plays = turn.possiblePlays;
  plays.sort(comparePlays);
  if (0) {
    for (const play of plays) {
      console.log("word: " + play.word + ", origin: " + play.view.origin +
        ", score: " + play.score);
    }
  }

  if (plays.length) {
    const play = plays.pop();
    console.log("word: " + play.word + ", origin: " + play.view.origin +
      ", score: " + play.score);
    play.commit();
    game.fillTray(player);
    console.log(game.board.toString());
  }

  if (--limit <= 0)
    break;
}

// trie.match("SXLEN*I", word => console.log(word));
