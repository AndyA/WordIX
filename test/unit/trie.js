"use strict";

var chai = require("chai");
var expect = chai.expect;

const Trie = require("../../webapp/lib/js/trie.js")

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

  describe("match", () => {
    it("should find the right words with no constraints", () => {
      let found = [];
      trie.match("FLOATERS", word => {
        found.push(word);
      });
      expect(found)
        .to.deep.equal(["FLOAT", "FLOATER", "FLOATS"]);
    });

    it("should find the right words with wildcards", () => {
      let found = [];
      trie.match("FL**TERS", word => {
        found.push(word);
      });
      expect(found)
        .to.deep.equal(["CAT", "CATS", "FLOAT", "FLOATER", "FLOATS"]);
    });

    it("should find the right words with constraints", () => {
      let found = [];
      trie.match("FLTERS", pos => {
        switch (pos) {
          case 2:
            return "O";
          case 3:
            return "A";
          default:
            return null;
        }
      }, word => {
        found.push(word);
      });
      expect(found)
        .to.deep.equal(["FLOAT", "FLOATER", "FLOATS"]);
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
