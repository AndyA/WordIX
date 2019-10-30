"use strict";

const Benchmark = require("benchmark");
const Trie = require("../webapp/lib/js/trie");

const fs = require("fs");

const WORDS = "ref/enable2k.txt";

const words = fs
  .readFileSync(WORDS)
  .toString()
  .split("\n")
  .filter(w => w.length >= 2)
  .sort();

const trie = new Trie(words);

testEncode(trie);
testDecode(trie);

function testEncode(trie) {
  const suite = new Benchmark.Suite("encode");

  suite
    .add("encode", () => {
      trie.encode();
    })
    .on("cycle", function(event) {
      console.log(String(event.target));
    })
    .run();
}

function testDecode(trie) {
  const rep = trie.encode();
  const suite = new Benchmark.Suite("decode");

  suite
    .add("decode", () => {
      Trie.decode(rep);
    })
    .on("cycle", function(event) {
      console.log(String(event.target));
    })
    .run();
}
