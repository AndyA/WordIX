"use strict";

const chai = require("chai");
const expect = chai.expect;

const Rules = require("../../webapp/lib/js/rules.js")
import {
  Tile,
  WildTile
} from "../../webapp/lib/js/tile.js";

describe("Rules", () => {
  const r = new Rules;

  describe("board", () => {
    const expectBoard = [
      "T..d...T...d..T",
      ".D...t...t...D.",
      "..D...d.d...D..",
      "d..D...d...D..d",
      "....D.....D....",
      ".t...t...t...t.",
      "..d...d.d...d..",
      "T..d...D...d..T",
      "..d...d.d...d..",
      ".t...t...t...t.",
      "....D.....D....",
      "d..D...d...D..d",
      "..D...d.d...D..",
      ".D...t...t...D.",
      "T..d...T...d..T",
    ];

    function getSpecial(sp) {
      if (!sp.length)
        return ".";
      if (sp.length === 1) {
        const spr = sp[0];
        if (spr.multiplier < 2 || spr.multiplier > 3)
          return "M";
        const letter = spr.multiplier === 2 ? "d" : "t";
        if (spr.scope === "word")
          return letter.toUpperCase();
        if (spr.scope === "letter")
          return letter.toLowerCase();
        return "S";
      }
      return "*";
    }

    function scanBoard(b) {
      var rep = [];
      b.each((cell, x, y) => {
        if (x === 0) rep.push("");
        const sp = cell.special;
        const lt = getSpecial(sp);
        rep[rep.length - 1] += lt;
      });
      return rep;
    }

    it("should have a familar board", () => {
      expect(scanBoard(r.makeBoard()))
        .to.deep.equal(expectBoard);
    });

  });

  describe("bag", () => {
    const bag = r.makeBag();
    it("should be the right size", () => {
      expect(bag.size)
        .to.equal(100);
    });

    it("should have two wild tiles", () => {
      const wild = bag.tiles.filter(t => t.matchLetter === "*");
      expect(wild.length)
        .to.equal(2);
      expect(wild[0])
        .to.be.an.instanceof(WildTile);
    });

    it("should have three Gs with a score of two", () => {
      const gs = bag.tiles.filter(t => t.matchLetter === "G");
      expect(gs.length)
        .to.equal(3);
      expect(gs[0].score)
        .to.equal(2);
    });

  });

});
