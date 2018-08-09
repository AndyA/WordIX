"use strict";

const MW = require("mixwith");

const Generation = MW.Mixin(superclass => class extends superclass {
  get generation() {
    return this._generation = this._generation || 0;
  }

  nextGeneration() {
    return this._generation = this.generation + 1;
  }
});

module.exports = Generation;
