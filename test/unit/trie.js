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
