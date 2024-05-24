// script.js

document.addEventListener("DOMContentLoaded", () => {
    const gameBoard = document.getElementById("gameBoard");
    const cells = document.querySelectorAll(".cell");
    const resetButton = document.getElementById("resetButton");
    const twoPlayerModeButton = document.getElementById("twoPlayerMode");
    const playWithAIButton = document.getElementById("playWithAI");
    const difficultySelection = document.getElementById("difficultySelection");
    const difficultySelect = document.getElementById("difficulty");
    const gameStats = document.getElementById("gameStats");
    const playerXWinsElement = document.getElementById("playerXWins");
    const playerOWinsElement = document.getElementById("playerOWins");
    const drawsElement = document.getElementById("draws");
    const currentPlayerElement = document.getElementById("currentPlayer");

    let currentPlayer = "X";
    let gameState = ["", "", "", "", "", "", "", "", ""];
    let isGameActive = true;
    let playWithAI = false;
    let aiDifficulty = "easy";
    let playerXWins = 0;
    let playerOWins = 0;
    let draws = 0;

    const winningConditions = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ];

    const handleCellClick = (e) => {
        const clickedCell = e.target;
        const clickedCellIndex = parseInt(clickedCell.getAttribute("data-index"));

        if (gameState[clickedCellIndex] !== "" || !isGameActive) {
            return;
        }

        gameState[clickedCellIndex] = currentPlayer;
        clickedCell.textContent = currentPlayer;

        if (checkWin()) {
            updateStats(currentPlayer);
            alert(`Player ${currentPlayer} wins!`);
            isGameActive = false;
            return;
        }

        if (isDraw()) {
            draws++;
            updateStats();
            alert("It's a draw!");
            isGameActive = false;
            return;
        }

        currentPlayer = currentPlayer === "X" ? "O" : "X";
        currentPlayerElement.textContent = currentPlayer;

        if (playWithAI && currentPlayer === "O") {
            if (aiDifficulty === "easy") {
                makeRandomMove();
            } else {
                makeBestMove();
            }
        }
    };

    const makeRandomMove = () => {
        let availableCells = [];
        gameState.forEach((cell, index) => {
            if (cell === "") {
                availableCells.push(index);
            }
        });

        if (availableCells.length > 0) {
            const aiMove = availableCells[Math.floor(Math.random() * availableCells.length)];
            gameState[aiMove] = "O";
            cells[aiMove].textContent = "O";

            if (checkWin()) {
                updateStats(currentPlayer);
                alert(`Player O (AI) wins!`);
                isGameActive = false;
                return;
            }

            if (isDraw()) {
                draws++;
                updateStats();
                alert("It's a draw!");
                isGameActive = false;
                return;
            }

            currentPlayer = "X";
            currentPlayerElement.textContent = currentPlayer;
        }
    };

    const makeBestMove = () => {
        let bestScore = -Infinity;
        let bestMove;

        gameState.forEach((cell, index) => {
            if (cell === "") {
                gameState[index] = "O";
                let score = minimax(gameState, 0, false);
                gameState[index] = "";
                if (score > bestScore) {
                    bestScore = score;
                    bestMove = index;
                }
            }
        });

        gameState[bestMove] = "O";
        cells[bestMove].textContent = "O";

        if (checkWin()) {
            updateStats(currentPlayer);
            alert(`Player O (AI) wins!`);
            isGameActive = false;
            return;
        }

        if (isDraw()) {
            draws++;
            updateStats();
            alert("It's a draw!");
            isGameActive = false;
            return;
        }

        currentPlayer = "X";
        currentPlayerElement.textContent = currentPlayer;
    };

    const minimax = (board, depth, isMaximizing) => {
        let scores = {
            X: -1,
            O: 1,
            draw: 0
        };

        let result = checkWinner();
        if (result !== null) {
            return scores[result];
        }

        if (isMaximizing) {
            let bestScore = -Infinity;
            board.forEach((cell, index) => {
                if (cell === "") {
                    board[index] = "O";
                    let score = minimax(board, depth + 1, false);
                    board[index] = "";
                    bestScore = Math.max(score, bestScore);
                }
            });
            return bestScore;
        } else {
            let bestScore = Infinity;
            board.forEach((cell, index) => {
                if (cell === "") {
                    board[index] = "X";
                    let score = minimax(board, depth + 1, true);
                    board[index] = "";
                    bestScore = Math.min(score, bestScore);
                }
            });
            return bestScore;
        }
    };

    const checkWin = () => {
        for (let i = 0; i < winningConditions.length; i++) {
            const [a, b, c] = winningConditions[i];
            if (gameState[a] && gameState[a] === gameState[b] && gameState[a] === gameState[c]) {
                return true;
            }
        }
        return false;
    };

    const checkWinner = () => {
        for (let i = 0; i < winningConditions.length; i++) {
            const [a, b, c] = winningConditions[i];
            if (gameState[a] && gameState[a] === gameState[b] && gameState[a] === gameState[c]) {
                return gameState[a];
            }
        }
        if (gameState.every(cell => cell !== "")) {
            return "draw";
        }
        return null;
    };

    const isDraw = () => {
        return gameState.every(cell => cell !== "");
    };

    const resetGame = () => {
        currentPlayer = "X";
        gameState = ["", "", "", "", "", "", "", "", ""];
        isGameActive = true;
        cells.forEach(cell => cell.textContent = "");
        currentPlayerElement.textContent = currentPlayer;
    };

    const updateStats = (winner) => {
        if (winner === "X") {
            playerXWins++;
        } else if (winner === "O") {
            playerOWins++;
        }
        playerXWinsElement.textContent = playerXWins;
        playerOWinsElement.textContent = playerOWins;
        drawsElement.textContent = draws;
    };

    twoPlayerModeButton.addEventListener("click", () => {
        playWithAI = false;
        difficultySelection.classList.add("hidden");
        resetGame();
    });

    playWithAIButton.addEventListener("click", () => {
        playWithAI = true;
        difficultySelection.classList.remove("hidden");
        resetGame();
    });

    difficultySelect.addEventListener("change", (e) => {
        aiDifficulty = e.target.value;
    });

    cells.forEach(cell => cell.addEventListener("click", handleCellClick));
    resetButton.addEventListener("click", resetGame);
});
