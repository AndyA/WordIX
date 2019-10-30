const Search = require("../webapp/lib/js/search");
const Rules = require("../webapp/lib/js/rules");
const Trie = require("../webapp/lib/js/trie");
const Game = require("../webapp/lib/js/game");
const Turn = require("../webapp/lib/js/turn");

const _ = require("lodash");

const { performance, PerformanceObserver } = require("perf_hooks");

const patchRandom = require("../webapp/test/js/patch-random");

const fs = require("fs");

// Initial baseline:
//
// { name: 'match',
//   calls: 37538,
//   minDuration: 0.004237,
//   maxDuration: 78.947384,
//   totDuration: 24869.396467999934,
//   avgDuration: 0.6625125597527821,
//   fastest: '0.004237, 7, 14, down; J',
//   slowest: '78.947384, 1, 0, down; AR*ENAR' }
//
// Only match in valid cells:
//
// { name: 'match',
//   calls: 20408,
//   minDuration: 0.005755,
//   maxDuration: 74.72755,
//   totDuration: 8710.794910000006,
//   avgDuration: 0.42683236524892226,
//   fastest: '0.005755, 9, 0, down; U',
//   slowest: '74.72755, 8, 0, down; UEEO*TI' }

const WORDS = "ref/enable1.txt";

let words = fs
  .readFileSync(WORDS)
  .toString()
  .split("\n")
  .filter(w => w.length);

console.log("Loaded " + words.length + " words from " + WORDS);

const trie = new Trie(words);
const rules = new Rules();

// Preload trie cache
trie.root;

patchFunction(Search.prototype, "match", e => {
  const search = e[0];
  return [
    decodeView(search.view),
    search.bag.map(x => x.toString()).join("")
  ].join("; ");
});

const obs = new PerformanceObserver(list => {
  analysePerformance(list);
  obs.disconnect();
});

obs.observe({
  entryTypes: ["function"],
  buffered: true
});

for (let seed = 1; seed < 5; seed++) runGame(seed);

function runGame(seed, maxPlays = 1000) {
  patchRandom(seed);

  const game = new Game({
    trie,
    rules
  });

  while (game.canPlay) {
    if (--maxPlays < 0) break;
    const player = game.startMove();
    console.log();
    console.log(
      `Player: ${player.tray} (${player.name}, score: ${player.score})`
    );
    const turn = new Turn(game, player);
    let plays = turn.possiblePlays;
    plays.sort(comparePlays);

    if (plays.length) {
      const play = plays.pop();
      console.log(
        "word: " +
          play.word +
          ", origin: " +
          play.view.origin +
          ", score: " +
          play.score +
          ", adjoined: " +
          play.adjoined
      );
      console.log(play.match.toString());
      play.commit();
      game.fillTray(player);
      console.log(game.board.toString());
      game.endMove();
    }
  }

  console.log();
  console.log("Final words: " + game.words.sort().join(", "));

  for (const player of game.players) {
    console.log(`${player.score} - ${player.name}`);
  }
}

function decodeDirection(dx, dy) {
  if (dx === 1 && dy === 0) return "across";
  if (dx === 0 && dy === 1) return "down";
  return `unknown[${dx}, ${dy}]`;
}

function decodeView(v) {
  const [ox, oy] = v.origin;
  const [dx, dy] = v.xy(1, 0);
  return [ox, oy, decodeDirection(dx - ox, dy - oy)].join(", ");
}

function _s(v) {
  if (v === undefined) return "undefined";
  if (v === null) return "null";
  return "" + v;
}

function comparePlays(a, b) {
  return a.score - b.score || a.word.localeCompare(b.word);
}

function patchFunction(obj, funcName, dispFunc) {
  const origFunc = obj[funcName];
  // dispFunc = dispFunc || (e) => "";

  let proxy = function() {
    let args = Array.prototype.slice.call(arguments, 2);
    return origFunc.apply(this, args);
  };
  Object.defineProperty(proxy, "name", {
    value: funcName
  });
  const shim = performance.timerify(proxy);

  obj[funcName] = function() {
    let args = Array.prototype.slice.call(arguments);
    // Add dispFunc and this to every call
    args.unshift(dispFunc);
    args.unshift(this);
    return shim.apply(this, args);
  };
}

function formatEntry(e) {
  const disp = e[1];
  return [e.duration, disp(e)].join(", ");
}

function analyseEntries(list) {
  if (!list.length) return;

  let sortedList = list.slice().sort((a, b) => {
    return a.duration - b.duration || a.startTime - b.startTime;
  });

  const duration = sortedList.map(e => e.duration);
  const calls = duration.length;
  const minDuration = _.min(duration);
  const maxDuration = _.max(duration);
  const totDuration = _.sum(duration);
  const avgDuration = totDuration / calls;

  const name = list[0].name;
  console.log({
    name,
    calls,
    minDuration,
    maxDuration,
    totDuration,
    avgDuration,
    fastest: formatEntry(sortedList[0]),
    slowest: formatEntry(sortedList[calls - 1])
  });
}

function analysePerformance(list) {
  const entries = _.groupBy(list.getEntries(), e => e.name);

  let kind = Object.keys(entries).sort();
  for (const k of kind) {
    analyseEntries(entries[k]);
  }
}
