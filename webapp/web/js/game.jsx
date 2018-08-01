const React = require("react");
const ReactDOM = require("react-dom");
const ready = require('document-ready-promise')

const Rules = require("rules");
const Trie = require("trie");
const Game = require("game");
const Turn = require("turn");

class CellView extends React.Component {
  render() {
    console.log(this.props.cell);
    let classes = ["cell"];
    const special = this.props.cell.special;
    if (special && special.length) {
      classes.push("special")
      for (const spec of special)
        classes.push(spec.scope, "x" + spec.multiplier);
    }
    return <div className={classes.join(" ")}></div>;
  }
}

class BoardView extends React.Component {
  render() {
    let grid = [];
    this.props.board.eachRow((row, y) => {
      const rep = row.map((cell, x) =>
        <CellView cell={cell} key={x+","+y}></CellView>);
      grid.push(<div className="row" key={y}>{rep}</div>);
    });
    return <div className="board">{grid}</div>
  }
}

class GameView extends React.Component {
  render() {
    return <div className="game">
      <BoardView board={this.props.game.board}></BoardView>
    </div>;
  }
}

const dict = fetch("/data/enable.txt")
  .then(resp => resp.text())
  .then(text => text.split(/\s+/));

Promise.all([dict, ready()])
  .then((args) => {
    const [words] = args;
    const root = document.getElementById("game");

    const trie = new Trie(words);
    const rules = new Rules();
    const game = new Game({
      trie,
      rules
    });

    ReactDOM.render(<GameView game={game}></GameView>, root);
  });
