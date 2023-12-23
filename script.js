// Define constants for the number of rows and columns in the game board
const ROWS = 6;
const COLS = 7;

// Initialize an empty game board and other game-related variables
let board = [];
let currentPlayer = 'red';

// Function to toggle dark mode
function toggleDarkMode() {
    const body = document.body;
    body.classList.toggle('dark-mode'); // Toggle the 'dark-mode' class on the body
}

// Function to initialize the game board and display
function initializeBoard() {
    // Create an empty 2D array to represent the game board
    board = Array.from({ length: ROWS }, () => Array(COLS).fill(null));

    // Draw the initial game board and update the player turn display
    drawBoard();
    updatePlayerTurn();
}

// Function to draw the current state of the game board and header
function drawBoard() {
    // Get the HTML element representing the game board
    const boardElement = document.getElementById('board');

    // Clear the existing content of the board element
    boardElement.innerHTML = '';

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
}

// Function to determine the color of a cell based on the player's disc color
function getCellColor(row, col) {
    return board[row][col] === 'red' ? 'red' : 'yellow';
}

// Function to handle player clicks on a cell, updating the game state
function handleCellClick(event) {
    const clickedCell = event.target;
    const col = clickedCell.dataset.col;

    // Find the lowest available row in the selected column for the current player's move
    for (let row = ROWS - 1; row >= 0; row--) {
        if (!board[row][col]) {
            // Update the game board with the player's disc color
            board[row][col] = currentPlayer;

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

// Function to check for a winning sequence in a specific direction
function checkDirection(row, col, rowChange, colChange) {
    const player = board[row][col];

    // Check in one direction
    let count = 1;
    for (let i = 1; i < 4; i++) {
        const newRow = row + i * rowChange;
        const newCol = col + i * colChange;

        if (newRow < 0 || newRow >= ROWS || newCol < 0 || newCol >= COLS || board[newRow][newCol] !== player) {
            break;
        }

        count++;
    }

    // Check in the opposite direction
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
    // Reset the currentPlayer to the initial player
    currentPlayer = 'red';

    // Reinitialize the game board and display
    initializeBoard();
}

// Function to update the player turn display
function updatePlayerTurn() {
    const playerTurnElement = document.getElementById('playerTurn');
    const headerElement = document.querySelector('h1');

    // Update the turn information
    // playerTurnElement.innerHTML = `Current Turn: <span class="${currentPlayer}-disc"></span> ${currentPlayer.toUpperCase()}`;

    // Change the color of the h1 element based on the current player's turn
    headerElement.style.color = currentPlayer === 'red' ? 'red' : 'yellow';
}

// Initialize the game board and display when the page loads
initializeBoard();
