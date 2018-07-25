"use strict";

var chai = require("chai");
var expect = chai.expect;

const Trie = require("../../webapp/lib/js/trie.js")
const ArrayPicker = require("../../webapp/lib/js/array-picker.js");
const Board = require("../../webapp/lib/js/board.js");
const makeTile = require("../../webapp/lib/js/tile.js")
  .makeTile;

describe("Trie", () => {
  const trie = new Trie(["CAT", "CATHARSIS", "CATS", "FLOAT",
    "FLOATER", "FLOATS"
  ]);

  describe("trie", () => {
    const want = {
      "C": {
        "A": {
          "T": {
            "*": {},
            "H": {
              "A": {
                "R": {
                  "S": {
                    "I": {
                      "S": {
                        "*": {}
                      }
                    }
                  }
                }
              }
            },
            "S": {
              "*": {}
            }
          }
        }
      },
      "F": {
        "L": {
          "O": {
            "A": {
              "T": {
                "*": {},
                "E": {
                  "R": {
                    "*": {}
                  }
                },
                "S": {
                  "*": {}
                }
              }
            }
          }
        }
      }
    };

    it("should have a valid trie", () => {
      expect(trie.root)
        .to.deep.equal(want);
    });
  });

  describe("matches", () => {

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

    function testMatches(bag, opt, words) {
      let sortedWords = words.slice(0)
        .sort();
      let found = trie.matches(bag, opt)
        .sort((a, b) => a.word.localeCompare(b.word));
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
          it("should have used the correct tiles for " + m.word, () => {
            const pos = ArrayPicker.reverseIndex(m.path.map(x => x.bagPos));
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
      const found = testMatches("FLOATERS", {}, ["FLOAT", "FLOATER",
        "FLOATS"
      ]);
    });

    describe("Wildcards", () => {
      testMatches("**EFLRST", {}, ["CAT", "CATS", "FLOAT",
        "FLOATER", "FLOATS"
      ]);
    });

    describe("Constraints", () => {
      testMatches("FLTERS", {
        view: makeView("**OA", 15)
      }, ["FLOAT", "FLOATER", "FLOATS"]);
    });

    describe("Constraints and wildcards", () => {
      testMatches("FLTER*", {
        view: makeView("**OA", 15)
      }, ["FLOAT", "FLOATER", "FLOATS"]);
    });
  });

  describe("valid", () => {
    it("should know CATHARSIS is valid", () => {
      expect(trie.valid("CATHARSIS"))
        .to.equal(true);
    });

    it("should know CATHARSI is invalid", () => {
      expect(trie.valid("CATHARSI"))
        .to.equal(false);
    });

    it("should know CATHARSISE is invalid", () => {
      expect(trie.valid("CATHARSISE"))
        .to.equal(false);
    });

    it("should know CATHETER is invalid", () => {
      expect(trie.valid("CATHETER"))
        .to.equal(false);
    });
  });

});
