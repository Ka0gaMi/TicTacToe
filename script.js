let win = false;

// GAME BOARD //

const gameBoard = (() => {
  const grid = document.getElementById("grid");

  const createGrid = () => {
    for (let i = 0; i < 9; i++) {
      const cell = document.createElement("div");
      cell.classList.add("cell");
      cell.setAttribute("id", i);
      grid.appendChild(cell);
    }
  };

  let currentSign = "X";

  const startMove = () => {
    grid.classList.add(currentSign);
  };

  const restartGame = () => {
    const cells = document.querySelectorAll(".cell");
    cells.forEach((cell) => {
      cell.classList.remove("X");
      cell.classList.remove("O");
      cell.classList.remove("played");
    });
    gameLogic.resetMoves();
    let currentSign = "X";
    win = false;
  };
  return { createGrid, startMove, currentSign, restartGame };
})();

// GAME LOGIC //

const gameLogic = (() => {
  const grid = document.getElementById("grid");
  let moves = 0;

  const resetMoves = () => {
    moves = 0;
  };

  const addMove = () => {
    moves++;
  };

  const putSign = () => {
    const cells = document.querySelectorAll(".cell");
    cells.forEach((cell) => {
      cell.addEventListener("click", (e) => handleClick(e));
    });
  };

  const handleClick = (e) => {
    if (!e.target.classList.contains("played")) {
      e.target.classList.add(gameBoard.currentSign);
      e.target.classList.add("played");
      checkWin(humanPlayer);
      addMove();
      checkDraw();
      switchSign();
      minimaxAI.makeBestMove();
      console.log(win);
    }
  };

  const switchSign = () => {
    gameBoard.currentSign = gameBoard.currentSign === "X" ? "O" : "X";
    grid.classList.contains("X")
      ? grid.classList.replace("X", "O")
      : grid.classList.replace("O", "X");
  };

  const checkWin = (currentSign) => {
    const winConditions = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];

    const endOverlay = document.querySelector(".end-overlay");
    const endText = document.querySelector(".end-text");
    const cells = document.querySelectorAll(".cell");

    for (let i = 0; i < winConditions.length; i++) {
      const [a, b, c] = winConditions[i];
      if (
        cells[a].classList.contains(currentSign) &&
        cells[b].classList.contains(currentSign) &&
        cells[c].classList.contains(currentSign)
      ) {
        endOverlay.classList.replace("disabled", "active");
        endText.textContent = `Player ${currentSign} has won!`;
        win = true;
      }
    }
  };

  const checkDraw = () => {
    const endOverlay = document.querySelector(".end-overlay");
    const endText = document.querySelector(".end-text");

    if (moves === 9) {
      endOverlay.classList.replace("disabled", "active");
      endText.textContent = `It's a draw!`;
    }
  };
  return {
    putSign,
    moves,
    switchSign,
    checkWin,
    checkDraw,
    resetMoves,
    addMove,
  };
})();

// BUTTONS //

const startButton = document.getElementById("start-btn");
startButton.addEventListener("click", () => {
  const startOverlay = document.querySelector(".start-overlay");
  startOverlay.classList.replace("active", "disabled");
  gameBoard.createGrid();
  gameBoard.startMove();
  gameLogic.putSign();
});

const restartButton = document.getElementById("restart-btn");
restartButton.addEventListener("click", () => {
  gameBoard.restartGame();

  const endOverlay = document.querySelector(".end-overlay");
  endOverlay.classList.replace("active", "disabled");
});

// AI //

const AI = (() => {
  const checkAvailableMoves = () => {
    const cells = document.querySelectorAll(".cell");
    let availableMoves = [];

    cells.forEach((cell) => {
      if (!cell.classList.contains("played")) {
        let cellId = cell.getAttribute("id");
        availableMoves.push(cellId);
      }
    });
    return availableMoves;
  };

  const makeRandomChoice = (availableMoves) => {
    let randomAvailableChoice =
      availableMoves[Math.floor(Math.random() * availableMoves.length)];
    return randomAvailableChoice;
  };

  const makeRandomMove = () => {
    if (checkAvailableMoves().length > 0 && !win) {
      let randomChoice = makeRandomChoice(checkAvailableMoves()).toString();
      const cells = document.querySelectorAll(".cell");

      cells.forEach((cell) => {
        if (cell.getAttribute("id") === randomChoice) {
          cell.classList.add(gameBoard.currentSign);
          cell.classList.add("played");
          gameLogic.checkWin(aiPlayer);
          gameLogic.addMove();
          gameLogic.checkDraw();
          gameLogic.switchSign();
        }
      });
    } else {
      gameLogic.switchSign();
    }
  };
  return { makeRandomMove, checkAvailableMoves };
})();

// Player factory function //

const Player = function (sign) {
  const currentSign = sign;
  return currentSign;
};

const humanPlayer = Player("X");

const aiPlayer = Player("O");

// MiniMax AI //

const minimaxAI = (() => {
  const grid = document.getElementById("grid");

  const isMovesLeft = () => {
    const cells = document.querySelectorAll(".cell");

    for (let i = 0; i < cells.length; i++) {
      if (!cells[i].classList.contains("played")) {
        return true;
      }
    }
    return false;
  };

  const evaluate = () => {
    const winConditions = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];

    for (let i = 0; i < winConditions.length; i++) {
      const [a, b, c] = winConditions[i];
      if (
        grid.children[a].classList.contains("O") &&
        grid.children[b].classList.contains("O") &&
        grid.children[c].classList.contains("O")
      ) {
        return 10;
      }
      if (
        grid.children[a].classList.contains("X") &&
        grid.children[b].classList.contains("X") &&
        grid.children[c].classList.contains("X")
      ) {
        return -10;
      }
    }
    return 0;
  };

  const minimax = (depth, isMax) => {
    const score = evaluate();

    if (score === 10) {
      return score - depth;
    }
    if (score === -10) {
      return score + depth;
    }
    if (!isMovesLeft()) {
      return 0;
    }

    if (isMax) {
      let best = -Infinity;
      const cells = document.querySelectorAll(".cell");

      for (let i = 0; i < cells.length; i++) {
        if (!cells[i].classList.contains("played")) {
          cells[i].classList.add("O", "played");
          best = Math.max(best, minimax(depth + 1, !isMax));
          cells[i].classList.remove("O", "played");
        }
      }
      return best;
    } else {
      let best = Infinity;
      const cells = document.querySelectorAll(".cell");
      for (let i = 0; i < cells.length; i++) {
        if (!cells[i].classList.contains("played")) {
          cells[i].classList.add("X", "played");
          best = Math.min(best, minimax(depth + 1, !isMax));
          cells[i].classList.remove("X", "played");
        }
      }
      return best;
    }
  };

  const findBestMove = () => {
    let bestVal = -Infinity;
    let bestMove;
    const cells = document.querySelectorAll(".cell");

    for (let i = 0; i < cells.length; i++) {
      if (!cells[i].classList.contains("played")) {
        cells[i].classList.add("O", "played");
        let moveVal = minimax(0, false);
        cells[i].classList.remove("O", "played");

        if (moveVal > bestVal) {
          bestVal = moveVal;
          bestMove = i;
        }
      }
    }

    return bestMove;
  };

  const makeBestMove = () => {
    if (isMovesLeft() && !win) {
      const bestMove = findBestMove();
      const cells = document.querySelectorAll(".cell");
      cells[bestMove].classList.add("O", "played");
      gameLogic.checkWin(aiPlayer);
      gameLogic.addMove();
      gameLogic.checkDraw();
      gameLogic.switchSign();
    } else {
      gameLogic.switchSign();
    }
  };

  return { makeBestMove };
})();
