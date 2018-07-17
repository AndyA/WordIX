"use strict";

var chai = require("chai");
var expect = chai.expect;

import Board from "../../webapp/lib/js/board.js";

describe("Board", () => {
  describe("Simple board", () => {
    let board = new Board();

    it("should have the correct size", () => {
      expect(board.width)
        .to.equal(15);
      expect(board.height)
        .to.equal(15);
    });

    it("should know it is empty", () => {
      expect(board.used)
        .to.equal(0);
      expect(board.free)
        .to.equal(15 * 15);
    });
  });
});
