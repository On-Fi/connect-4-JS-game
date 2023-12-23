// Define constants for the number of rows and columns in the game board
const ROWS = 6;
const COLS = 7;

// Initialize an empty game board and other game-related variables
let board = [];
let currentPlayer = 'red';
let gameWon = false;
let darkMode = false;

// Function to initialize the game board and display
function initializeBoard() {
    // Create an empty 2D array to represent the game board
    board = [];

    // Initialize each cell on the board to null
    for (let row = 0; row < ROWS; row++) {
        board[row] = [];
        for (let col = 0; col < COLS; col++) {
            board[row][col] = null;
        }
    }

    // Draw the initial game board and update the player turn display
    drawBoard();
    updatePlayerTurn();
}

// Function to draw the current state of the game board and header
function drawBoard() {
    // Get the HTML elements representing the game board and header
    const boardElement = document.getElementById('board');
    const playerTurnElement = document.getElementById('playerTurn');

    // Clear the existing content of the board and header elements
    boardElement.innerHTML = '';
    playerTurnElement.textContent = '';

    // Draw the header with buttons and current player display
    const header = document.getElementById('header');
    header.innerHTML = `
        <button onclick="restartGame()">Restart Game</button>
        <button onclick="toggleDarkMode()">Toggle Dark Mode</button>
        <div id="playerTurn"></div>
    `;

    // Iterate through each cell on the board and create corresponding HTML elements
    for (let row = 0; row < ROWS; row++) {
        for (let col = 0; col < COLS; col++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            cell.dataset.row = row;
            cell.dataset.col = col;

            // Set the background color of the cell based on the player's disc color
            if (board[row][col]) {
                cell.style.backgroundColor = getCellColor(row, col);
            }

            // Add a click event listener to handle player moves
            cell.addEventListener('click', handleCellClick);

            // Append the cell to the game board element
            boardElement.appendChild(cell);
        }
    }

    // Update the player turn display with appropriate text color
    updatePlayerTurn();
}

// Function to determine the color of a cell based on the player's disc color
function getCellColor(row, col) {
    if (board[row][col] === 'red') {
        return darkMode ? 'green' : 'red';
    } else if (board[row][col] === 'yellow') {
        return darkMode ? 'blue' : 'yellow';
    }
    return '';
}

// Function to handle player clicks on a cell, updating the game state
function handleCellClick(event) {
    if (gameWon) return;

    const clickedCell = event.target;
    const col = clickedCell.dataset.col;

    // Find the lowest available row in the selected column for the current player's move
    for (let row = ROWS - 1; row >= 0; row--) {
        if (!board[row][col]) {
            // Update the game board with the player's disc color
            board[row][col] = currentPlayer;

            // Check for a winning condition after each move
            checkForWin(row, col);

            // Switch to the other player's turn
            currentPlayer = currentPlayer === 'red' ? 'yellow' : 'red';

            // Redraw the updated game board and update the player turn display
            drawBoard();
            updatePlayerTurn();

            // Exit the loop after handling the current move
            break;
        }
    }
}

// Function to check for a winning condition after a move
function checkForWin(row, col) {
    if (
        checkDirection(row, col, 0, 1) ||  // Horizontal
        checkDirection(row, col, 1, 0) ||  // Vertical
        checkDirection(row, col, 1, 1) ||  // Diagonal /
        checkDirection(row, col, 1, -1)    // Diagonal \
    ) {
        // Display a winning message and set the gameWon flag
        gameWon = true;
        updatePlayerTurn(); // Update to show the winner
    }
}

// Function to check for a winning sequence in a specific direction
function checkDirection(row, col, rowChange, colChange) {
    const player = board[row][col];
    let count = 1;

    // Check in the positive direction
    for (let i = 1; i < 4; i++) {
        const newRow = row + i * rowChange;
        const newCol = col + i * colChange;

        if (newRow < 0 || newRow >= ROWS || newCol < 0 || newCol >= COLS || board[newRow][newCol] !== player) {
            break;
        }

        count++;
    }

    // Check in the negative direction
    for (let i = 1; i < 4; i++) {
        const newRow = row - i * rowChange;
        const newCol = col - i * colChange;

        if (newRow < 0 || newRow >= ROWS || newCol < 0 || newCol >= COLS || board[newRow][newCol] !== player) {
            break;
        }

        count++;
    }

    // Return true if there are at least four discs in a row in the specified direction
    return count >= 4;
}

// Function to restart the game
function restartGame() {
    // Reset the gameWon flag and switch back to the initial player
    gameWon = false;
    currentPlayer = 'red';

    // Reinitialize the game board and display
    initializeBoard();
}

// Function to toggle dark mode
function toggleDarkMode() {
    // Invert the darkMode flag and update the visual style
    darkMode = !darkMode;
    updateDarkMode();
}

// Function to update the visual style for dark mode
function updateDarkMode() {
    const body = document.body;
    body.style.backgroundColor = darkMode ? '#222' : '#fff';
    body.style.color = darkMode ? '#fff' : '#000';

    // Update the background color of each cell based on the player's disc color
    const cells = document.querySelectorAll('.cell');
    cells.forEach(cell => {
        const row = cell.dataset.row;
        const col = cell.dataset.col;

        if (board[row][col]) {
            cell.style.backgroundColor = getCellColor(row, col);
        }
    });

    // Update the player turn display with appropriate text color
    updatePlayerTurn();
}

// Function to update the player turn display and show the winner if the game is won
function updatePlayerTurn() {
    const playerTurnElement = document.getElementById('playerTurn');

    if (gameWon) {
        // If the game is won, display the winner
        playerTurnElement.textContent = `${currentPlayer.toUpperCase()} wins!`;
    } else {
        // If the game is still ongoing, update the turn information
        const playerColor = darkMode
            ? currentPlayer === 'red' ? 'green' : 'blue'
            : currentPlayer;

        playerTurnElement.textContent = `Current Turn: ${playerColor.toUpperCase()}`;
    }
}

// Initialize the game board and display when the page loads
initializeBoard();
