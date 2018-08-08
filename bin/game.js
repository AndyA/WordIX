const Rules = require("../webapp/lib/js/rules");
const Trie = require("../webapp/lib/js/trie");
const Game = require("../webapp/lib/js/game");
const Turn = require("../webapp/lib/js/turn");

const fs = require("fs");

const WORDS = "ref/enable2k.txt";

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

let skip = 0;
while (game.canPlay && skip < game.players.length) {
  const player = game.nextPlayer();
  console.log();
  console.log(
    `Player: ${player.tray} (${player.name}, score: ${player.score})`);
  const turn = new Turn(game, player);
  let plays = turn.possiblePlays;
  plays.sort(comparePlays);

  if (plays.length) {
    const play = plays.pop();
    console.log("word: " + play.word + ", origin: " + play.view.origin +
      ", score: " + play.score);
    console.log(play.match.toString());
    play.commit();
    game.fillTray(player);
    console.log(game.board.toString());
    game.sanityCheck();
    skip = 0;
  } else {
    skip++;
  }
}

console.log();
console.log("Final words: " + game.words.sort()
  .join(", "));

for (const player of game.players) {
  console.log(`${player.score} - ${player.name}`);
}

// trie.match("SXLEN*I", word => console.log(word));
