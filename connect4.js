"use strict";

/** Class of Game generates a new instance of Connect 4 based on
 * user inputs of the board's dimensions. Takes optional height and
 * width variables.
 */

class Game {

  /** Initializes height, width, current player, and board.  */

  constructor(height = 6, width = 7) {
    this.height = height;
    this.width = width;
    this.currPlayer = 1;
    this.board = [];
    this.start();
    this.gameEnd = undefined;
  }

  /** makeBoard: fill in global `board`:
  *    board = array of rows, each row is array of cells  (board[y][x])
  */

  makeBoard() {
    for (let y = 0; y < this.height; y++) {
      const emptyRow = Array.from({length: this.width}).fill(null);
      this.board.push(emptyRow);
    }
  }

  /** makeHtmlBoard: removes old HTMLboard and makes new HTML table and row of column tops. */

  makeHtmlBoard() {
    const oldBoard = document.getElementById("board");
    //oldBoard.innerHTML = ''; easy way to empty out the table
    oldBoard.remove();
    const htmlBoard = document.createElement('table');
    htmlBoard.setAttribute('id', 'board');
    const gameLocation = document.getElementById('game');
    gameLocation.append(htmlBoard);

    // Creates the top row with the cells to click on for adding game pieces to board
    const top = document.createElement("tr");
    top.setAttribute("id", "column-top");

    for (let x = 0; x < this.width; x++) {
      const headCell = document.createElement("td");
      headCell.setAttribute("id", `top-${x}`);
      const boundHandleClick = this.handleClick.bind(this);
      headCell.addEventListener("click", boundHandleClick);
      //headCell.addEventListener("click", this.handleClick.bind(currentTurn));
      top.append(headCell);
    }
    htmlBoard.append(top);

    // dynamically creates the main part of html board
    // uses HEIGHT to create table rows
    // uses WIDTH to create table cells for each row
    for (let y = 0; y < this.height; y++) {
      const row = document.createElement('tr');

      for (let x = 0; x < this.width; x++) {
        const cell = document.createElement('td');
        cell.setAttribute('id', `c-${y}-${x}`);
        row.append(cell);
      }

      htmlBoard.append(row);
    }
  }

  /** findSpotForCol: given column x, return y coordinate of furthest-down spot
 *    (return null if filled) */

  findSpotForCol(x) {
    for (let y = this.height - 1; y >= 0; y--) {
      if (this.board[y][x] === null) {
        return y;
      }
    }
    return null;
  }

  /** placeInTable: update DOM to place piece into HTML table of board */

  placeInTable(y, x) {
    const piece = document.createElement('div');
    piece.classList.add('piece');
    piece.classList.add(`p${this.currPlayer}`);

    const spot = document.getElementById(`c-${y}-${x}`);
    spot.append(piece);
  }

  /** endGame: announce game end */
  // TODO: Add setTimout for endGame function to appear after piece placement

  endGame(msg) {
    alert(msg);
    this.gameEnd = 'ended';
  }

  /** checkForWin: check board cell-by-cell for "does a win start here?" */

  checkForWin() {

    function _win(cells) {
      // Check four cells to see if they're all color of current player
      //  - cells: list of four (y, x) cells
      //  - returns true if all are legal coordinates & all match currPlayer
      return cells.every(
          ([y, x]) =>
              y >= 0 &&
              y < this.height &&
              x >= 0 &&
              x < this.width &&
              this.board[y][x] === this.currPlayer
      );
    }

    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        // get "check list" of 4 cells (starting here) for each of the different
        // ways to win
        const horiz = [[y, x], [y, x + 1], [y, x + 2], [y, x + 3]];
        const vert = [[y, x], [y + 1, x], [y + 2, x], [y + 3, x]];
        const diagDR = [[y, x], [y + 1, x + 1], [y + 2, x + 2], [y + 3, x + 3]];
        const diagDL = [[y, x], [y + 1, x - 1], [y + 2, x - 2], [y + 3, x - 3]];


        const boundWin = _win.bind(this);

        // find winner (only checking each win-possibility as needed)
        if (boundWin(horiz) ||
            boundWin(vert) ||
            boundWin(diagDR) ||
            boundWin(diagDL)) {
          return true;
        }
      }
    }
    return false;
  }


  /** handleClick: handle click of column top to play piece */

  handleClick(evt) {
    if (this.gameEnd === undefined) {
      // get x from ID of clicked cell
      const x = Number(evt.target.id.slice("top-".length));


      // get next spot in column (if none, ignore click)
      const y = this.findSpotForCol(x);
      if (y === null) {
        return;
      }

      // place piece in board and add to HTML table
      this.board[y][x] = this.currPlayer;
      this.placeInTable(y, x);

      // check for win
      if (this.checkForWin()) {
        return this.endGame(`Player ${this.currPlayer} won!`);
      }

      // check for tie: if top row is filled, board is filled
      if (this.board[0].every(cell => cell !== null)) {
        return this.endGame('Tie!');
      }

      // switch players
      this.currPlayer = this.currPlayer === 1 ? 2 : 1;
    }

  }

  /** Start game. */

  start() {
    this.makeBoard();
    this.makeHtmlBoard();
  }

}

//new Game(6,7);

// Button setup & appending to DOM
const gameSpace = document.getElementById('game');
const startButton = document.createElement('button');
startButton.innerText = 'Start or Reset Game';
gameSpace.append(startButton);

startButton.addEventListener('click', function(){
  new Game(6,7);
})


