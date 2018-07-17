"use strict";

var chai = require("chai");
var expect = chai.expect;

import { Tile, WildTile } from "../../webapp/lib/js/tile.js";

describe("Tile", () => {
  const tileX = new Tile("X", 8);
  it("should have the right letter", () => {
    expect(tileX.letter).to.equal("X");
  });

  it("should have the right matchLetter", () => {
    expect(tileX.matchLetter).to.equal("X");
  });

  it("should have the right score", () => {
    expect(tileX.score).to.equal(8);
  });
});

describe("WildTile", () => {
  const wildTile = new WildTile();
  it("should not have a letter", () => {
    expect(wildTile.letter).to.be.undefined;
  });

  it("should have the right matchLetter", () => {
    expect(wildTile.matchLetter).to.equal("*");
  });

  it("should have the right score", () => {
    expect(wildTile.score).to.equal(0);
  });
});
