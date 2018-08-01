const React = require("react");
const ReactDOM = require("react-dom");
const ready = require('document-ready-promise')

const Rules = require("rules");
const Trie = require("trie");
const Game = require("game");
const Turn = require("turn");

class TileView extends React.Component {
  render() {
    const tile = this.props.tile;
    if (!tile) return null;
    return (
      <div className="tile">
        <span className="letter">{tile.letter}</span>
        <span className="score">{tile.score}</span>
      </div>
    );
  }
}

class CellView extends React.Component {
  render() {
    const cell = this.props.cell;
    let classes = ["cell"];
    const special = cell.special;
    if (special && special.length) {
      classes.push("special")
      for (const spec of special)
        classes.push(spec.scope, "x" + spec.multiplier);
    }

    return (
      <div className={classes.join(" ")}>
        <TileView tile={cell.tile}></TileView>
      </div>
    );
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

function comparePlays(a, b) {
  return a.score - b.score ||
    a.word.localeCompare(b.word);
}

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

    const player = game.nextPlayer();
    console.log(
      `Player: ${player.tray} (${player.name}, score: ${player.score})`);
    const turn = new Turn(game, player);
    let plays = turn.possiblePlays;
    plays.sort(comparePlays);

    if (plays.length) {
      const play = plays.pop();
      console.log("word: " + play.word + ", origin: " + play.view.origin +
        ", score: " + play.score + ", adjoined: " + play.adjoined);
      console.log(play.match.toString());
      play.commit();
      game.fillTray(player);
      console.log(game.board.toString());
      game.sanityCheck();
    }

    ReactDOM.render(<GameView game={game}></GameView>, root);
  });
