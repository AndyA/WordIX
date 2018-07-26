"use strict";

var chai = require("chai");
var expect = chai.expect;

const Trie = require("../../webapp/lib/js/trie.js")
const ArrayPicker = require("../../webapp/lib/js/array-picker.js");
const Bag = require("../../webapp/lib/js/bag.js");
const Board = require("../../webapp/lib/js/board.js");
const Search = require("../../webapp/lib/js/search.js");
const makeTile = require("../../webapp/lib/js/tile.js")
  .makeTile;

function groupWords(found) {
  let byWord = {};
  for (const w of found) {
    const word = w.word;
    byWord[word] = byWord[word] || [];
    byWord[word].push(w);
  }
  return byWord;
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
    if (lt !== "*")
      v.cell(x, 0)
      .tile = makeTile(lt);
  }
  return v;
}

describe("Search", () => {
  describe("matches", () => {
    describe("Simple", () => {
      const trie = new Trie(["CAT", "CATHARSIS", "CATS", "FLOAT",
        "FLOATER", "FLOATS"
      ]);

      function testMatches(bag, view, words) {
        let sortedWords = words.slice(0)
          .sort();
        const search = new Search(trie, view, bag);
        let found = search.matches();
        let byWord = groupWords(found);

        const foundWords = Object.keys(byWord)
          .sort();

        it("should match the right words", () => {
          expect(foundWords)
            .to.deep.equal(sortedWords);
        });

        for (const word of sortedWords) {
          const matches = byWord[word] || [];
          for (const m of matches) {
            it("should have used the correct tiles for " + m.word,
              () => {
                const pos = ArrayPicker.reverseIndex(m.path.map(x =>
                  x.bagPos));
                let letter = word.split("");
                let want = [],
                  got = [];

                for (const bp of pos) {
                  const lt = letter.shift();
                  if (bp === undefined) continue;
                  const bl = bag[bp];
                  if (bl === "*") continue;
                  want.push(lt);
                  got.push(bag[bp]);
                }

                expect(got)
                  .to.not.be.empty;

                expect(got)
                  .to.deep.equal(want);
              })

          }
        }
      }

      describe("No constraints", () => {
        const found = testMatches("FLOATERS", makeView("", 15), [
          "FLOAT", "FLOATER",
          "FLOATS"
        ]);
      });

      describe("Wildcards", () => {
        testMatches("**EFLRST", makeView("", 15), ["CAT",
          "CATS",
          "FLOAT",
          "FLOATER", "FLOATS"
        ]);
      });

      describe("Constraints", () => {
        testMatches("FLTERS", makeView("**OA", 15), ["FLOAT",
          "FLOATER", "FLOATS"
        ]);
      });

      describe("Constraints and wildcards", () => {
        testMatches("FLTER*",
          makeView("**OA", 15), ["FLOAT", "FLOATER", "FLOATS"]
        );
      });
    });

    describe("Cross words", () => {
      describe("minimal case", () => {
        it("should make simple cross matches", () => {
          const trie = new Trie(["AB", "BA"]);
          const board = new Board({
            width: 3,
            height: 3
          });
          const v = board.view(0, 1, "across");
          v.cell(0, 0)
            .tile = makeTile("A");
          v.cell(1, 0)
            .tile = makeTile("B");
          const bag = new Bag;
          bag.add(["A", "B"].map(makeTile));
          const search = new Search(trie, board.view(0, 2,
            "across"), bag.tiles);
          const matches = search.matches();
          expect(matches.map(m => m.word))
            .to.deep.equal(["BA"])
        });
      });
    });


  });

});
