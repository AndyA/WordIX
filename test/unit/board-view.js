"use strict";

var chai = require("chai");
var expect = chai.expect;

const BoardView = require("../../webapp/lib/js/board-view.js")
const Direction = require("../../webapp/lib/js/direction.js")

class TestBoard {
  constructor(width, height) {
    this.width = width;
    this.height = height;
    this.access = [];
  }

  cell(x, y) {
    const pos = {
      x,
      y
    };
    this.access.push(pos);
    if (x < 0 || x >= this.width || y < 0 || y >= this.height)
      return null;
    return pos;
  }
}

const sizes = [1, 2, 15];

function forBoards(sizes, cb) {
  for (const w of sizes) {
    for (const h of sizes) {
      let board = new TestBoard(w, h);
      for (let dx = -1; dx <= 1; dx++) {
        for (let dy = -1; dy <= 1; dy++) {
          if (dx === 0 && dy === 0)
            continue;
          cb(board, new Direction(dx, dy));
        }
      }
    }
  }
}

describe("BoardView", () => {
  describe("basic addressing", () => {
    forBoards(sizes, (board, dir) => {
      const boardDesc = board.width + "x" + board.height;
      const dirDesc = "[" + dir.dx + ", " + dir.dy + "]";
      describe("Board: " + boardDesc + ", Dir: " + dirDesc, () => {
        it("should return correct cell", () => {
          for (let x = 0; x < board.width; x++) {
            for (let y = 0; y < board.height; y++) {
              const v = new BoardView(board, x, y, dir);
              for (let pos = v.min; pos <= v.max; pos++) {
                const cell = v.cell(pos);
                expect(cell)
                  .to.deep.equal({
                    x: x + pos * dir.dx,
                    y: y + pos * dir.dy
                  });
              }
            }
          }
        });
      });
    });
  });
});
