"use strict";

var chai = require("chai");
var expect = chai.expect;

import ArrayPicker from "../../webapp/lib/js/array-picker.js";

function shuffle(a) {
  var j, x, i;
  for (i = a.length - 1; i > 0; i--) {
    j = Math.floor(Math.random() * (i + 1));
    x = a[i];
    a[i] = a[j];
    a[j] = x;
  }
  return a;
}

function fillRange(n) {
  var a = [];
  while (a.length < n) a.push(a.length);
  return a;
}

function collect(src, pick) {
  var out = [];
  var p = pick.slice(0);
  while (p.length)
    out.push(...src.splice(p.shift(), 1));
  return out;
}

function checkPick(original, idx, out, src) {
  it("should pick " + JSON.stringify(idx) +
    " from " + JSON.stringify(original), () => {
      expect(out)
        .to.deep.equal(idx);
    });

  const want = original.filter(x => idx.indexOf(x) < 0);
  it("should have left " + JSON.stringify(want), () => {
    expect(src)
      .to.deep.equal(want);
  });
}

function testPicker(count, func) {
  for (let tn = 0; tn < 10; tn++) {
    const srcLength = 1 + Math.floor(Math.random() * 20);
    const pickLength = Math.floor(Math.random() * srcLength);

    var src = fillRange(srcLength);
    var original = src.slice(0);
    var idx = shuffle(fillRange(pickLength));

    var out = func(src, idx);

    checkPick(original, idx, out, src);
  }
}

describe("ArrayPicker", () => {
  describe("adjustIndex", () => {
    testPicker(10, (src, idx) => {
      var pick = ArrayPicker.adjustIndex(idx);
      return collect(src, pick);
    });
  });
  describe("multiSplice", () => {
    testPicker(10, (src, idx) => {
      var pick = ArrayPicker.adjustIndex(idx);
      return ArrayPicker.multiSplice(src, pick);
    });
  });
  describe("pick", () => {
    testPicker(10, (src, idx) => {
      return ArrayPicker.pick(src, idx);
    });
  });
});
