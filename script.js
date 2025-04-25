const gameBoard = (function () {
  const board = [
    ["", "", "X"],
    ["", "O", ""],
    ["", "", ""],
  ];
  const getBoard = () => board;

  const placeMark = (row, col, player) => {
    if (board[row][col]) {
      return false;
    }
    board[row][col] = player;
    return true;
  };
  return {
    getBoard,
    placeMark,
  };
})();

const gameController = (function () {
  const board = gameBoard();
  const players = [
    { name: "p1", mark: "X", score: 0 },
    { name: "p2", mark: "O", score: 0 },
  ];
  let activePlayer = players[0];
  const printBoard = () => {
    console.log(board.getBoard());
  };
  const getActivePlayer = () => {
    activePlayer;
  };
  const swapActivePlayer = () => {
    activePlayer = activePlayer === players[0] ? players[1] : players[0];
  };
  const playMove = (row, col) => {
    if (!board.placeMark(row, col, activePlayer.mark)) {
      return;
    }
    if (evaluateBoard()) {
      activePlayer.score++;
      console.log(`${activePlayer.name} wins!`);
    }
    swapActivePlayer();
  };
  const evaluateBoard = () => {
    boardState = board.getBoard();
    // check rows
    for (let i = 0; i < 3; i++) {
      if (
        boardState[i][0] === boardState[i][1] &&
        boardState[i][1] === boardState[i][2] &&
        boardState[i][0] !== ""
      ) {
        return true;
      }
    }
    // check columns
    for (let i = 0; i < 3; i++) {
      if (
        boardState[0][i] === boardState[1][i] &&
        boardState[1][i] === boardState[2][i] &&
        boardState[0][i] !== ""
      ) {
        return true;
      }
    }
    // check diagonals
    if (
      boardState[0][0] === boardState[1][1] &&
      boardState[1][1] === boardState[2][2] &&
      boardState[0][0] !== ""
    ) {
      return true;
    }
    if (
      boardState[0][2] === boardState[1][1] &&
      boardState[1][1] === boardState[2][0] &&
      boardState[0][2] !== ""
    ) {
      return true;
    }
    return false;
  };
  return {
    printBoard,
    getActivePlayer,
    playMove,
    getBoard: board.getBoard,
  };
})();
