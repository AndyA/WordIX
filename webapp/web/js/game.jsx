const React = require("react");
const ReactDOM = require("react-dom");
const ready = require('document-ready-promise')

const Rules = require("rules");
const Trie = require("trie");
const Game = require("game");
const Turn = require("turn");

class Cell extends React.Component {

}

class Board extends React.Component {
  render() {
    return <h1>Hello, world!</h1>;
  }
}

const dict = fetch("/data/enable.txt")
  .then(resp => resp.text()).then(text => text.split(/\s+/));

Promise.all([dict, ready()]).then((args) => {
  const [words] = args;
  const root = document.getElementById("game");
  ReactDOM.render(<Board></Board>, root);
});
