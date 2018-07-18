"use strict";

const chai = require("chai");
const expect = chai.expect;

import Rules from "../../webapp/lib/js/rules.js";
import Game from "../../webapp/lib/js/game.js";
import Trie from "../../webapp/lib/js/trie.js";

describe("Game", () => {
  const trie = new Trie(["CAT", "CATHARSIS", "CATS", "FLOAT",
    "FLOATER", "FLOATS"
  ]);

  const rules = new Rules();

  let game = new Game({
    rules,
    trie
  })

  it("should have two players", () => {
    expect(game.players.length)
      .to.equal(2);
  });

  it("should have filled their trays", () => {
    expect(game.bag.size)
      .to.equal(100 - 14);
  });
});
