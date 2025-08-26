// Get DOM elements
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreElement = document.getElementById('score');
const highScoreElement = document.getElementById('highScore');
const gameOverElement = document.getElementById('gameOver');
const finalScoreElement = document.getElementById('finalScore');

// Game variables
const gridSize = 20;
const tileCount = canvas.width / gridSize;

let snake = [
    {x: 10, y: 10}
];
let food = {};
let dx = 0;
let dy = 0;
let score = 0;
let highScore = localStorage.getItem('snakeHighScore') || 0;
let gameRunning = false;
let gameLoop;

// Initialize high score display
highScoreElement.textContent = highScore;

// Generate random food position
function randomFood() {
    food = {
        x: Math.floor(Math.random() * tileCount),
        y: Math.floor(Math.random() * tileCount)
    };
}

// Draw game elements
function drawGame() {
    // Clear canvas
    ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw grid
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.lineWidth = 1;
    for (let i = 0; i <= tileCount; i++) {
        ctx.beginPath();
        ctx.moveTo(i * gridSize, 0);
        ctx.lineTo(i * gridSize, canvas.height);
        ctx.stroke();
        
        ctx.beginPath();
        ctx.moveTo(0, i * gridSize);
        ctx.lineTo(canvas.width, i * gridSize);
        ctx.stroke();
    }

    // Draw snake
    ctx.fillStyle = '#4CAF50';
    snake.forEach((segment, index) => {
        if (index === 0) {
            // Snake head
            ctx.fillStyle = '#66BB6A';
            ctx.fillRect(segment.x * gridSize + 2, segment.y * gridSize + 2, gridSize - 4, gridSize - 4);
            
            // Snake eyes
            ctx.fillStyle = 'white';
            ctx.fillRect(segment.x * gridSize + 5, segment.y * gridSize + 5, 3, 3);
            ctx.fillRect(segment.x * gridSize + 12, segment.y * gridSize + 5, 3, 3);
        } else {
            // Snake body
            ctx.fillStyle = index % 2 === 0 ? '#4CAF50' : '#45A049';
            ctx.fillRect(segment.x * gridSize + 1, segment.y * gridSize + 1, gridSize - 2, gridSize - 2);
        }
    });

    // Draw food
    ctx.fillStyle = '#FF6B6B';
    ctx.beginPath();
    ctx.arc(
        food.x * gridSize + gridSize / 2,
        food.y * gridSize + gridSize / 2,
        gridSize / 2 - 2,
        0,
        2 * Math.PI
    );
    ctx.fill();

    // Food highlight
    ctx.fillStyle = '#FFB3BA';
    ctx.beginPath();
    ctx.arc(
        food.x * gridSize + gridSize / 2,
        food.y * gridSize + gridSize / 2,
        gridSize / 3,
        0,
        2 * Math.PI
    );
    ctx.fill();
}

// Move snake
function moveSnake() {
    const head = {x: snake[0].x + dx, y: snake[0].y + dy};
    snake.unshift(head);

    // Check if food is eaten
    if (head.x === food.x && head.y === food.y) {
        score += 10;
        scoreElement.textContent = score;
        randomFood();
        
        // Check for high score
        if (score > highScore) {
            highScore = score;
            highScoreElement.textContent = highScore;
            localStorage.setItem('snakeHighScore', highScore);
        }
    } else {
        snake.pop();
    }
}

// Check collisions
function checkCollision() {
    const head = snake[0];

    // Wall collision
    if (head.x < 0 || head.x >= tileCount || head.y < 0 || head.y >= tileCount) {
        return true;
    }

    // Self collision
    for (let i = 1; i < snake.length; i++) {
        if (head.x === snake[i].x && head.y === snake[i].y) {
            return true;
        }
    }

    return false;
}

// Game over
function gameOver() {
    gameRunning = false;
    clearInterval(gameLoop);
    finalScoreElement.textContent = score;
    gameOverElement.style.display = 'block';
}

// Main game loop
function game() {
    if (!gameRunning) return;

    moveSnake();

    if (checkCollision()) {
        gameOver();
        return;
    }

    drawGame();
}

// Start game
function startGame() {
    if (gameRunning) return;
    
    gameRunning = true;
    gameOverElement.style.display = 'none';
    
    if (snake.length === 1 && dx === 0 && dy === 0) {
        randomFood();
    }
    
    gameLoop = setInterval(game, 150);
}

// Pause game
function pauseGame() {
    if (gameRunning) {
        gameRunning = false;
        clearInterval(gameLoop);
    } else {
        startGame();
    }
}

// Reset game
function resetGame() {
    gameRunning = false;
    clearInterval(gameLoop);
    gameOverElement.style.display = 'none';
    
    snake = [{x: 10, y: 10}];
    dx = 0;
    dy = 0;
    score = 0;
    scoreElement.textContent = score;
    
    randomFood();
    drawGame();
}

// Restart game
function restartGame() {
    resetGame();
    startGame();
}

// Keyboard controls
document.addEventListener('keydown', (e) => {
    if (!gameRunning) return;

    const key = e.key.toLowerCase();

    // Prevent reverse direction
    if ((key === 'arrowup' || key === 'w') && dy === 0) {
        dx = 0;
        dy = -1;
    }
    if ((key === 'arrowdown' || key === 's') && dy === 0) {
        dx = 0;
        dy = 1;
    }
    if ((key === 'arrowleft' || key === 'a') && dx === 0) {
        dx = -1;
        dy = 0;
    }
    if ((key === 'arrowright' || key === 'd') && dx === 0) {
        dx = 1;
        dy = 0;
    }

    // Prevent scrolling
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
        e.preventDefault();
    }
});

// Initialize game
randomFood();
drawGame();

// Touch controls for mobile
let touchStartX = 0;
let touchStartY = 0;

canvas.addEventListener('touchstart', (e) => {
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
});

canvas.addEventListener('touchend', (e) => {
    if (!gameRunning) return;

    const touchEndX = e.changedTouches[0].clientX;
    const touchEndY = e.changedTouches[0].clientY;

    const diffX = touchStartX - touchEndX;
    const diffY = touchStartY - touchEndY;

    if (Math.abs(diffX) > Math.abs(diffY)) {
        if (diffX > 0 && dx === 0) {
            dx = -1;
            dy = 0;
        } else if (diffX < 0 && dx === 0) {
            dx = 1;
            dy = 0;
        }
    } else {
        if (diffY > 0 && dy === 0) {
            dx = 0;
            dy = -1;
        } else if (diffY < 0 && dy === 0) {
            dx = 0;
            dy = 1;
        }
    }
});