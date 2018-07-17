"use strict";

var chai = require("chai");
var expect = chai.expect;

import Trie from "../../webapp/lib/js/Trie.js";

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
      expect(trie.trie)
        .to.deep.equal(want);
    });
  });

  describe("findWords", () => {
    it("should find the right words with no constraints", () => {
      let found = [];
      trie.findWords("FLOATERS".split(""), pos => null, path => {
        found.push(path);
      });
      expect(found)
        .to.deep.equal(["FLOAT", "FLOATER", "FLOATS"]);
    });

    it("should find the right words with wildcards", () => {
      let found = [];
      trie.findWords("FL**TERS".split(""), pos => null, path => {
        found.push(path);
      });
      expect(found)
        .to.deep.equal(["CAT", "CATS", "FLOAT", "FLOATER", "FLOATS"]);
    });

    it("should find the right words with constraints", () => {
      let found = [];
      trie.findWords("FLTERS".split(""), pos => {
        switch (pos) {
          case 2: return "O";
          case 3: return "A";
          default: return null;
        }
      }, path => {
        found.push(path);
      });
      expect(found)
        .to.deep.equal(["FLOAT", "FLOATER", "FLOATS"]);
    });
  });

});
