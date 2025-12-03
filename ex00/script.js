// ============================================
// CONSTANTS
// ============================================
const GRID_SIZE = 4;
const CELL_SIZE = 100;
const CELL_GAP = 15;
const ANIMATION_DURATION = 150;

// ============================================
// GAME STATE
// ============================================
let grid = [];
let score = 0;
let bestScore = 0;
let gameStatus = 'playing'; // 'playing', 'won', 'lost'
let isMoving = false;

// ============================================
// INITIALIZATION
// ============================================
function init() {
    bestScore = loadBestScore();
    setupEventListeners();
    startNewGame();
}

function startNewGame() {
    grid = createEmptyGrid();
    score = 0;
    gameStatus = 'playing';
    isMoving = false;

    // Remove any existing game message
    const existingMessage = document.querySelector('.game-message');
    if (existingMessage)
        existingMessage.remove();

    // Add two random tiles
    addRandomTile();
    addRandomTile();

    render();
}

// ============================================
// GRID OPERATIONS
// ============================================
function createEmptyGrid() {
    return Array.from({ length: GRID_SIZE }, () => Array(GRID_SIZE).fill(0));
}

function cloneGrid(grid) {
    return grid.map(row => [...row]);
}

function gridsEqual(grid1, grid2) {
    for (let row = 0; row < GRID_SIZE; row++) {
        for (let col = 0; col < GRID_SIZE; col++) {
            if (grid1[row][col] !== grid2[row][col])
                return false;
        }
    }
    return true;
}

function getEmptyCells() {
    const cells = [];
    for (let row = 0; row < GRID_SIZE; row++) {
        for (let col = 0; col < GRID_SIZE; col++) {
            if (isEmptyCell(row, col))
                cells.push({ row, col });
        }
    }
    return cells;
}

function isEmptyCell(row, col) {
    return grid[row][col] === 0;
}

function addRandomTile() {
    const emptyCells = getEmptyCells();
    if (emptyCells.length === 0) return false;

    const randomCell = emptyCells[Math.floor(Math.random() * emptyCells.length)];
    const value = Math.random() < 0.9 ? 2 : 4;

    grid[randomCell.row][randomCell.col] = value;
    return true;
}

// ============================================
// MOVEMENT LOGIC
// ============================================
function moveTiles(direction) {
    const oldGrid = cloneGrid(grid);

    // Determine rotations needed
    const rotationsMap = {
        'left': 0,
        'down': 1,
        'right': 2,
        'up': 3
    };

    const rotations = rotationsMap[direction];

    // Rotate grid
    for (let i = 0; i < rotations; i++)
        grid = rotateGridClockwise(grid);

    // Slide left and get score
    const scoreIncrease = slideLeft();

    // Rotate back
    const rotateBack = (4 - rotations) % 4;
    for (let i = 0; i < rotateBack; i++)
        grid = rotateGridClockwise(grid);

    // Check if grid changed
    const moved = !gridsEqual(oldGrid, grid);

    if (moved)
        score += scoreIncrease;

    return moved;
}

function rotateGridClockwise(grid) {
    const newGrid = createEmptyGrid();
    for (let row = 0; row < GRID_SIZE; row++) {
        for (let col = 0; col < GRID_SIZE; col++)
            newGrid[col][GRID_SIZE - 1 - row] = grid[row][col];
    }
    return newGrid;
}

function slideLeft() {
    let totalScore = 0;

    for (let row = 0; row < GRID_SIZE; row++) {
        const { row: newRow, score: rowScore } = processRow(grid[row]);
        grid[row] = newRow;
        totalScore += rowScore;
    }

    return totalScore;
}

function processRow(row) {
    // Remove zeros
    let filtered = row.filter(cell => cell !== 0);

    // Merge tiles
    const { merged, scoreIncrease } = mergeTiles(filtered);

    // Pad with zeros
    while (merged.length < GRID_SIZE)
        merged.push(0);

    return { row: merged, score: scoreIncrease };
}

function mergeTiles(row) {
    const merged = [];
    let scoreIncrease = 0;
    let i = 0;

    while (i < row.length) {
        if (i < row.length - 1 && row[i] === row[i + 1]) {
            // Merge tiles
            const mergedValue = row[i] * 2;
            merged.push(mergedValue);
            scoreIncrease += mergedValue;
            i += 2; // Skip both tiles
        } else {
            // No merge
            merged.push(row[i]);
            i += 1;
        }
    }

    return { merged, scoreIncrease };
}

// ============================================
// GAME STATUS
// ============================================
function checkWin() {
    return grid.some(row => row.some(cell => cell === 2048));
}

function hasEmptyCells() {
    return grid.some(row => row.some(cell => cell === 0));
}

function hasValidMoves() {
    // Check horizontal adjacency
    for (let row = 0; row < GRID_SIZE; row++) {
        for (let col = 0; col < GRID_SIZE - 1; col++) {
            if (grid[row][col] === grid[row][col + 1])
                return true;
        }
    }

    // Check vertical adjacency
    for (let row = 0; row < GRID_SIZE - 1; row++) {
        for (let col = 0; col < GRID_SIZE; col++) {
            if (grid[row][col] === grid[row + 1][col])
                return true;
        }
    }

    return false;
}

function checkGameOver() {
    if (hasEmptyCells())
        return false;
    return !hasValidMoves();
}

function updateGameStatus() {
    if (gameStatus !== 'playing')
        return;

    if (checkWin()) {
        gameStatus = 'won';
        showWinMessage();
        return;
    }

    if (checkGameOver()) {
        gameStatus = 'lost';
        showGameOverMessage();
    }
}

// ============================================
// GAME MESSAGES
// ============================================
function showWinMessage() {
    const message = document.createElement('div');
    message.className = 'game-message game-won';
    message.innerHTML = `
        <h2>🎉 You Win! 🎉</h2>
        <p>You reached the 2048 tile!</p>
        <p>Score: ${score}</p>
        <button onclick="startNewGame()">New Game</button>
    `;
    document.body.appendChild(message);
}

function showGameOverMessage() {
    const message = document.createElement('div');
    message.className = 'game-message game-over';
    message.innerHTML = `
        <h2>Game Over!</h2>
        <p>No more moves available</p>
        <p>Final Score: ${score}</p>
        <button onclick="startNewGame()">Try Again</button>
    `;
    document.body.appendChild(message);
}

// ============================================
// RENDERING
// ============================================
function render() {
    renderGrid();
    updateScoreDisplay();
}

function renderGrid() {
    const container = document.getElementById('grid-container');
    container.innerHTML = '';

    // Create background cells
    for (let row = 0; row < GRID_SIZE; row++) {
        for (let col = 0; col < GRID_SIZE; col++) {
            const cell = document.createElement('div');
            cell.className = 'cell';
            container.appendChild(cell);
        }
    }

    // Create tiles
    for (let row = 0; row < GRID_SIZE; row++) {
        for (let col = 0; col < GRID_SIZE; col++) {
            const value = grid[row][col];
            if (value !== 0) {
                const tile = createTileElement(value, row, col);
                container.appendChild(tile);
            }
        }
    }
}

function createTileElement(value, row, col) {
    const tile = document.createElement('div');
    tile.className = `tile tile-${value}`;
    tile.textContent = value;

    // Position the tile
    const x = col * (CELL_SIZE + CELL_GAP) + CELL_GAP;
    const y = row * (CELL_SIZE + CELL_GAP) + CELL_GAP;

    tile.style.left = x + 'px';
    tile.style.top = y + 'px';

    return tile;
}

function updateScoreDisplay() {
    document.getElementById('score').textContent = score;
    document.getElementById('best-score').textContent = bestScore;

    // Update best score if current score is higher
    if (score > bestScore) {
        bestScore = score;
        saveBestScore();
    }
}

// ============================================
// EVENT HANDLERS
// ============================================
function setupEventListeners() {
    // Keyboard controls
    document.addEventListener('keydown', handleKeyPress);

    // Restart button
    document.getElementById('restart-btn').addEventListener('click', startNewGame);
}

function handleKeyPress(event) {
    if (!event.key.startsWith('Arrow')) return;
    if (isMoving || gameStatus !== 'playing') return;

    event.preventDefault();

    const directionMap = {
        'ArrowUp': 'up',
        'ArrowDown': 'down',
        'ArrowLeft': 'left',
        'ArrowRight': 'right'
    };

    const direction = directionMap[event.key];
    makeMove(direction);
}

function makeMove(direction) {
    isMoving = true;

    const moved = moveTiles(direction);

    if (!moved) {
        isMoving = false;
        return;
    }

    render();

    setTimeout(() => {
        addRandomTile();
        updateGameStatus();
        render();
        isMoving = false;
    }, ANIMATION_DURATION);
}

// ============================================
// PERSISTENCE
// ============================================
function saveBestScore() {
    localStorage.setItem('2048-best-score', bestScore.toString());
}

function loadBestScore() {
    const saved = localStorage.getItem('2048-best-score');
    return saved ? parseInt(saved, 10) : 0;
}

// ============================================
// START GAME
// ============================================
window.addEventListener('load', init);
