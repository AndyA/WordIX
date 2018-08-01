const Rules = require("../webapp/lib/js/rules");
const Trie = require("../webapp/lib/js/trie");
const Game = require("../webapp/lib/js/game");
const Turn = require("../webapp/lib/js/turn");

const patchRandom = require("../webapp/test/js/patch-random");

const fs = require("fs");

const WORDS = "ref/enable1.txt";

let words = fs.readFileSync(WORDS)
  .toString()
  .split("\n")
  .filter(w => w.length);

console.log("Loaded " + words.length + " words from " + WORDS);

const trie = new Trie(words);
const rules = new Rules();

runGame(1);
console.log("=============");
runGame(2);

function runGame(seed) {

  patchRandom(seed);

  const game = new Game({
    trie,
    rules
  });

  while (game.canPlay) {
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
        ", score: " + play.score + ", adjoined: " + play.adjoined);
      console.log(play.match.toString());
      play.commit();
      game.fillTray(player);
      console.log(game.board.toString());
      game.sanityCheck();
    }
  }

  console.log();
  console.log("Final words: " + game.words.sort()
    .join(", "));

  for (const player of game.players) {
    console.log(`${player.score} - ${player.name}`);
  }
}

function comparePlays(a, b) {
  return a.score - b.score ||
    a.word.localeCompare(b.word);
}
