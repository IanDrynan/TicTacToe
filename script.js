const gameBoard = (function () {
  const board = [
    ["", "", ""],
    ["", "", ""],
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
  const newGame = () => {
    for (let i = 0; i < board.length; i++) {
      for (let j = 0; j < board[i].length; j++) {
        board[i][j] = "";
      }
    }
  };
  return {
    getBoard,
    placeMark,
    newGame,
  };
})();

const gameController = (function () {
  const message = document.querySelector("#message");
  const board = gameBoard;
  const players = [
    { id: "p1", name: "Player 1", mark: "X", score: 0 },
    { id: "p2", name: "Player 2", mark: "O", score: 0 },
  ];
  let activePlayer = players[0];
  const getScores = () => {
    return players.map((player) => player.score);
  };
  const getActivePlayer = () => {
    return activePlayer;
  };
  const swapActivePlayer = () => {
    activePlayer = activePlayer === players[0] ? players[1] : players[0];
  };
  const playMove = (row, col) => {
    if (!board.placeMark(row, col, activePlayer.mark)) {
      return;
    }
    swapActivePlayer();
  };
  const evalGame = (player) => {
    if (evalWinner()) {
      player.score++;
      return "win";
    } else if (evalTie()) {
      return "tie";
    }
    return "continue";
  };
  const evalTie = () => {
    boardState = board.getBoard();
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (boardState[i][j] === "") {
          return false;
        }
      }
    }
    return true;
  };
  const evalWinner = () => {
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
    getScores,
    getActivePlayer,
    playMove,
    evalGame,
    newGame: board.newGame,
    getBoard: board.getBoard,
  };
})();
const screenController = (function () {
  const playerTurnDiv = document.querySelector("#playerTurn");
  const boardDiv = document.querySelector("#board");
  const newGameButton = document.querySelector("#newGame");
  const message = document.querySelector("#message");
  const p1Score = document.querySelector("#p1Score");
  const p2Score = document.querySelector("#p2Score");

  const renderBoard = () => {
    const board = gameController.getBoard();
    const activePlayer = gameController.getActivePlayer();
    const player1 = document.querySelector("#player1");
    const player2 = document.querySelector("#player2");
    const playerName = activePlayer.id === "p1" ? player1 : player2;
    playerTurnDiv.textContent = `${playerName.value}'s turn`;

    boardDiv.innerHTML = "";

    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        const cell = document.createElement("button");
        cell.classList.add("cell");
        cell.dataset.row = i;
        cell.dataset.col = j;
        if (board[i][j] === "") {
          cell.textContent = activePlayer.mark;
          cell.classList.add("cell-empty");
        } else {
          cell.textContent = board[i][j];
          cell.disabled = true;
          cell.classList.add("cell-filled");
        }
        boardDiv.appendChild(cell);
      }
    }
  };
  const renderScores = () => {
    const p1Score = document.querySelector("#p1Score");
    const p2Score = document.querySelector("#p2Score");
    const scores = gameController.getScores();
    p1Score.textContent = scores[0];
    p2Score.textContent = scores[1];
  };
  const gameEnd = (activePlayer) => {
    const result = gameController.evalGame(activePlayer);
    if (result === "win") {
      renderBoard();
      const playerName = activePlayer.id === "p1" ? player1 : player2;
      message.textContent = `${playerName.value} wins!`;
      const buttons = document.querySelectorAll(".cell-empty");
      buttons.forEach((button) => {
        button.disabled = true;
      });
      return true;
    } else if (result === "tie") {
      message.textContent = "It's a tie!";
      return false;
    } else {
      message.textContent = "";
      return false;
    }
  };
  boardDiv.addEventListener("click", (e) => {
    if (e.target.classList.contains("cell")) {
      const row = e.target.dataset.row;
      const col = e.target.dataset.col;
      const activePlayer = gameController.getActivePlayer();
      gameController.playMove(row, col);
      if (!gameEnd(activePlayer)) {
        renderBoard();
      }
      renderScores();
    }
  });
  newGameButton.addEventListener("click", () => {
    gameController.newGame();
    renderBoard();
  });
  renderBoard();
})();
