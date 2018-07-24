"use strict";

const chai = require("chai");
const expect = chai.expect;

const Transform = require("../../webapp/lib/js/transform.js")

const testPos = [
  [0, 0],
  [0, 1],
  [0, 2],
  [0, -1],
  [-1, 0],
  [1, 0],
  [-1, -1],
  [1, -1],
  [-1, 1],
  [1, 1],
  [200, -3],
  [11, 11],
  [-1, 1000]
];

function offsetPairs(list, dx, dy) {
  return list.map(xy => {
    const [x, y] = xy;
    return [x + dx, y + dy];
  });
}

function scale(list, sx, sy) {
  return list.map(xy => {
    const [x, y] = xy;
    return [x * sx, y * sy]
  });
}

function swapPairs(list) {
  return list.map(xy => {
    const [x, y] = xy;
    return [y, x]
  });
}

function testTransform(t, src, want) {
  const got = t.xys(src);
  // console.log({ src, want, got });
  expect(got)
    .to.deep.equal(want);
  expect(t.inverse.xys(want))
    .to.deep.equal(src);
}

describe("Transform", () => {
  describe("identity", () => {
    describe("implicit identity", () => {
      const t = new Transform();
      it("should not change coordinates", () => {
        testTransform(t, testPos, testPos);
      });
    });

    describe("explicit identity", () => {
      const t = new Transform(0, 0, "across");
      it("should not change coordinates", () => {
        testTransform(t, testPos, testPos);
      });
    });

    describe("origin", () => {
      const t = new Transform(3, 4, "across");
      it("should have the right origin", () => {
        expect(t.origin)
          .to.deep.equal([3, 4]);
      });
      it("should offset coordinates", () => {
        testTransform(t, testPos, offsetPairs(testPos, 3, 4));
      });
    });

    describe("flipped (constructor)", () => {
      const t = new Transform(7, 2, "down");
      it("should flip coordinates", () => {
        testTransform(t, testPos, offsetPairs(swapPairs(testPos),
          7, 2));
      });
    });

    describe("flipped (version)", () => {
      const t = new Transform(3, 4, "across")
        .flipped;
      it("should have the right origin", () => {
        expect(t.origin)
          .to.deep.equal([3, 4]);
      });
      it("should flip coordinates", () => {
        testTransform(t, testPos, offsetPairs(swapPairs(testPos),
          3, 4));
      });
    });

    describe("recentre", () => {
      const t = new Transform(5, 7, "down");
      it("should recentre", () => {
        expect(t.xy(2, 1))
          .to.deep.equal([6, 9]);
        const t2 = t.recentre(3, 0);
        expect(t2.xy(1, 2))
          .to.deep.equal([10, 8]);
        const t3 = t2.flipped;
        expect(t3.xy(1, 3))
          .to.deep.equal([9, 10]);
      });
    });
  });
});
