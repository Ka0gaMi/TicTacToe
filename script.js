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
  };
  return { createGrid, startMove, currentSign, restartGame };
})();

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
      checkWin();
      addMove();
      checkDraw();
      switchSign();
      AI.makeRandomMove();
      console.log(moves);
    }
  };

  const switchSign = () => {
    gameBoard.currentSign = gameBoard.currentSign === "X" ? "O" : "X";
    grid.classList.contains("X")
      ? grid.classList.replace("X", "O")
      : grid.classList.replace("O", "X");
  };

  const checkWin = () => {
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
        cells[a].classList.contains(gameBoard.currentSign) &&
        cells[b].classList.contains(gameBoard.currentSign) &&
        cells[c].classList.contains(gameBoard.currentSign)
      ) {
        endOverlay.classList.replace("disabled", "active");
        endText.textContent = `Player ${gameBoard.currentSign} has won!`;
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
    win,
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
    if (checkAvailableMoves().length > 0 && !gameLogic.win) {
      let randomChoice = makeRandomChoice(checkAvailableMoves()).toString();
      const cells = document.querySelectorAll(".cell");

      cells.forEach((cell) => {
        if (cell.getAttribute("id") === randomChoice) {
          cell.classList.add(gameBoard.currentSign);
          cell.classList.add("played");
          gameLogic.checkWin();
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
