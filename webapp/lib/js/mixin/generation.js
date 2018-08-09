"use strict";

const MW = require("mixwith");

const Generation = MW.Mixin((superclass) => class extends superclass {
  nextGeneration() {
    // make default value
    this.generation;
    return ++this._generation;
  }

  get generation() {
    return this._generation = this._generation || 0;
  }
});

module.exports = Generation;
