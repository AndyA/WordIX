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
        {tile.score > 0 && <span className="score">{tile.score}</span>}
      </div>
    );
  }
}

class CellView extends React.Component {
  render() {
    const cell = this.props.cell;
    let classes = ["cell", "age-" + cell.age];
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
  constructor(props) {
    super(props);
    // this.state = props;
  }

  render() {
    return <div className="game">
      <BoardView board={this.state.game.board}></BoardView>
    </div>;
  }
}

class AutoPlayGameView extends GameView {
  constructor(props) {
    super(props);
    this.skip = 0;
    this.state = {
      game: this.props.gameFactory()
    }
  }

  componentDidMount() {
    this.ticker();
  }

  nextPlay() {
    const game = this.state.game;
    const player = game.nextPlayer();

    const turn = new Turn(game, player);
    let plays = turn.possiblePlays;
    plays.sort(comparePlays);

    if (plays.length) {
      const play = plays.pop();

      play.commit();
      game.fillTray(player);

      game.sanityCheck();
      this.skip = 0;
    } else {
      this.skip++;
    }
  }

  ticker() {
    const game = this.state.game;
    if (game.canPlay && this.skip < game.players.length) {
      this.nextPlay();
      this.setState({
        game
      });
    } else {
      this.skip = 0;
      this.setState({
        game: this.props.gameFactory()
      });
    }
    setTimeout(this.ticker.bind(this), 1000);
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

    function gameFactory() {
      return new Game({
        trie,
        rules
      });
    }

    ReactDOM.render(
      <AutoPlayGameView gameFactory={gameFactory}></AutoPlayGameView>,
      root);
  });
