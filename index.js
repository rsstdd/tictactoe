(() => {
  let ACTIVE_PLAYER = 1;
  let ACTIVE_CHARACTER = ACTIVE_PLAYER === 0 ? "O" : "X";
  const BANNER_TEXT = `${ACTIVE_CHARACTER} is the Winner!`;
  const BUTTON_TEXT = "Reset";
  const GRID = [
    [ { id: 1 }, { id: 2 }, { id: 3 }, ],
    [ { id: 4 }, { id: 5 }, { id: 6 }, ],
    [ { id: 7 }, { id: 8 }, { id: 9 }, ],
  ];
  const MAX_ROUNDS = 9;
  let O_GUESSES = new Array();
  let X_GUESSES = new Array();
  const WINNING_COMBINATIONS = [
    ["1", "2", "3"],
    ["4", "5", "6"],
    ["7", "8", "9"],
    ["1", "4", "7"],
    ["2", "5", "8"],
    ["3", "6", "9"],
    ["1", "5", "9"],
    ["3", "5", "7"],
  ];

  // Cached DOM elements
  const boardEl = document.querySelector("#board");
  const winnerBannerEl = document.querySelector("#win-banner");

  // Handlers
  const handleClickBoard = ({ target }) => {
    const { attributes = {}, textContent = "" } = target;
    const isCell = attributes?.["data-cellid"];
    const isEmpty = textContent !== "";

    if (!isCell || isEmpty) return;

    const cellId = attributes?.["data-cellid"]?.value;

    updatePlayerGuesses(cellId);
    updateBoard(target);

    if (isMaxRounds()) {
      boardEl.removeEventListener("click", handleClickBoard);
      generateResetButton(boardEl);
    }

    if (isWinner()) {
      createWinnerBanner();
      boardEl.removeEventListener("click", handleClickBoard);
      boardEl.setAttribute("class", "hidden");
    }

    updatePlayer();
  };

  // Utilities
  const createWinnerBanner = () => {
    const bannerEl = document.createElement("div");
    const bannerTxt = document.createElement("h1");
    bannerTxt.textContent = BANNER_TEXT;
    bannerTxt.setAttribute("class", "win-banner__text");
    winnerBannerEl.removeAttribute("class", "hidden");
    bannerEl.appendChild(bannerTxt);
    generateResetButton(winnerBannerEl);
    winnerBannerEl.appendChild(bannerEl);
  };

  const generateGrid = (parentElement) => {
    GRID.forEach((row, idx) => {
      const rowElement = document.createElement("div");
      const rowCount = idx + 1;

      rowElement.setAttribute("class", "row");
      rowElement.setAttribute("data-rowId", rowCount);
      parentElement.appendChild(rowElement);

      row.forEach((cell) => {
        const cellElement = document.createElement("div");

        cellElement.setAttribute("data-cellId", cell.id);
        cellElement.setAttribute("class", "cell");
        rowElement.appendChild(cellElement);
      });
    });
  };

  const generateResetButton = (parentEl) => {
    const resetBtn = document.createElement("button");
    resetBtn.setAttribute("class", "reset-button");
    resetBtn.addEventListener("click", resetGame);
    resetBtn.textContent = BUTTON_TEXT;
    parentEl.append(resetBtn);
  };

  const isMaxRounds = () => O_GUESSES.length + X_GUESSES.length === MAX_ROUNDS;

  const isWinner = () => {
    if (X_GUESSES.length < 3) return false;

    const containsAll = (arr1, arr2) =>
      arr2.every((arr2Item) => arr1.includes(arr2Item));
    const isPlayerOWinner = WINNING_COMBINATIONS.some((combo) =>
      containsAll(O_GUESSES, combo)
    );
    const isPlayerXWinner = WINNING_COMBINATIONS.some((combo) =>
      containsAll(X_GUESSES, combo)
    );

    return isPlayerOWinner || isPlayerXWinner;
  };

  const setClassOnCell = el => {
    const className = ACTIVE_PLAYER === 0 ? "cell cell__o" : "cell cell__x";
    return el.setAttribute("class", className);
  }

  const updateBoard = (target) => {
    const p = document.createElement("p");
    p.setAttribute("class", "cell__text");
    p.textContent = ACTIVE_CHARACTER;
    setClassOnCell(target);
    target.appendChild(p);
  };

  const updatePlayer = () => {
    ACTIVE_PLAYER = ACTIVE_PLAYER === 0 ? 1 : 0;
    ACTIVE_CHARACTER = ACTIVE_PLAYER === 0 ? "O" : "X";
  };

  const updatePlayerGuesses = cellId => {
    if (ACTIVE_PLAYER === 0) {
      O_GUESSES.push(cellId)
    } else {
      X_GUESSES.push(cellId);
    }
  }

  const resetGame = () => {
    ACTIVE_PLAYER = 1;
    ACTIVE_CHARACTER = ACTIVE_PLAYER === 0 ? "O" : "X";
    O_GUESSES = new Array();
    X_GUESSES = new Array();

    while (boardEl.firstChild) {
      boardEl.removeChild(boardEl.firstChild);
    }

    boardEl.removeAttribute("class", "hidden");
    boardEl.removeAttribute("class", "disabled");
    winnerBannerEl.setAttribute("class", "hidden");
    generateGrid(boardEl);
    boardEl.addEventListener("click", handleClickBoard);

    while (winnerBannerEl.firstChild) {
      winnerBannerEl.removeChild(winnerBannerEl.firstChild);
    }
  };

  boardEl.addEventListener("click", handleClickBoard);
  generateGrid(boardEl);
})();
