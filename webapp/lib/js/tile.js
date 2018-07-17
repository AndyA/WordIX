export class Tile {
  constructor(lt, sc) {
    this.lt = lt;
    this.sc = sc;
  }

  get letter() {
    return this.lt;
  }

  get matchLetter() {
    return this.letter;
  }

  get score() {
    return this.sc;
  }
}

export class WildTile {
  set letter(lt) {
    this.lt = lt;
  }

  get letter() {
    return this.lt;
  }

  get matchLetter() {
    return "*";
  }

  get score() {
    return 0;
  }
}