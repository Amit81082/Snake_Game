const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const startBtn = document.getElementById('startBtn');



// 🎵 Load audio files
const foodSound = new Audio('music/food.mp3');
const gameOverSound = new Audio('music/gameover.mp3');
const moveSound = new Audio('music/move.mp3');
const bgMusic = new Audio('music/music.mp3');

// 🎧 Background music loop par chalao
bgMusic.loop = true;   // Continuous music
bgMusic.volume = 0.3;   // Set volume (0 to 1)

// ✅ Canvas Size
canvas.width = 600;
canvas.height = 600;

const gridSize = 20;
let snake = [{ x: 200, y: 200 }];
let direction = { x: gridSize, y: 0 };
let food = { x: 300, y: 300 };
let score = 0;
let highScore = localStorage.getItem('highScore') || 0;
let gameSpeed = 200;
let gameInterval = null;  // ✅ Missing variable added

// ✅ Display high score initially
document.getElementById('highScore').textContent = highScore;
document.getElementById('score').textContent = score;

// 🎯 Draw Snake and Food
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 🐍 Draw Snake
    snake.forEach((segment, index) => {
        ctx.fillStyle = index === 0 ? "#FFEB3B" : "#4CAF50";
        ctx.fillRect(segment.x, segment.y, gridSize, gridSize);
        ctx.strokeStyle = "#222";
        ctx.strokeRect(segment.x, segment.y, gridSize, gridSize);
    });

    // 🍎 Draw Food
    ctx.fillStyle = "#FF5722";
    ctx.fillRect(food.x, food.y, gridSize, gridSize);
}

// 🐍 Move Snake
function moveSnake() {
    const head = {
        x: snake[0].x + direction.x,
        y: snake[0].y + direction.y
    };

    snake.unshift(head);

    // 🍎 Check for collision with food
    if (head.x === food.x && head.y === food.y) {
        foodSound.play();
        score += 5;
        document.getElementById('score').textContent = score;

        // ✅ Wall se door rakhne wala food generator
        const offset = 40;   // Kitni doori chahiye (40px)
        const maxX = canvas.width - offset;
        const maxY = canvas.height - offset;

        food = {
            x: Math.floor(Math.random() * ((maxX - offset) / gridSize)) * gridSize + offset,
            y: Math.floor(Math.random() * ((maxY - offset) / gridSize)) * gridSize + offset
        };


        // ✅ Speed up the game
        if (gameSpeed > 120) {
            gameSpeed -= 5;
            clearInterval(gameInterval);
            gameInterval = setInterval(gameLoop, gameSpeed);
        }

    } else {
        snake.pop();
    }

    // ❌ Check for wall collision
    if (
        head.x < 0 || head.x >= canvas.width ||
        head.y < 0 || head.y >= canvas.height
    ) {
        resetGame();
    }

    // ❌ Check for self-collision
    for (let i = 1; i < snake.length; i++) {
        if (head.x === snake[i].x && head.y === snake[i].y) {
            resetGame();
        }
    }
}

// 🔥 Game Reset
function resetGame() {
    clearInterval(gameInterval);  // Stop the game loop first

    gameOverSound.play();

    if (score > highScore) {
        highScore = score;
        localStorage.setItem('highScore', highScore);
        document.getElementById('highScore').textContent = highScore;
    }


    score = 0;
    document.getElementById('score').textContent = score;
    snake = [{ x: 200, y: 200 }];
    direction = { x: gridSize, y: 0 };
    gameSpeed = 200;



};




// ⌨️ Keyboard Controls
window.addEventListener('keydown', (e) => {
    
    switch (e.key) {
        case 'ArrowUp':
            moveSound.play();
            if (direction.y === 0) direction = { x: 0, y: -gridSize };
            break;
        case 'ArrowDown':
            moveSound.play();
            if (direction.y === 0) direction = { x: 0, y: gridSize };
            break;
        case 'ArrowLeft':
            moveSound.play();
            if (direction.x === 0) direction = { x: -gridSize, y: 0 };
            break;
        case 'ArrowRight':
            moveSound.play();
            if (direction.x === 0) direction = { x: gridSize, y: 0 };
            break;
    }
});

// 🎯 Mobile Controls Event Listeners
document.getElementById('upBtn').addEventListener('click', () => {
    moveSound.play();
    if (direction.y === 0) direction = { x: 0, y: -gridSize };
});

document.getElementById('downBtn').addEventListener('click', () => {
    moveSound.play();
    if (direction.y === 0) direction = { x: 0, y: gridSize };
});

document.getElementById('leftBtn').addEventListener('click', () => {
    moveSound.play();
    if (direction.x === 0) direction = { x: -gridSize, y: 0 };
});

document.getElementById('rightBtn').addEventListener('click', () => {
    moveSound.play();
    if (direction.x === 0) direction = { x: gridSize, y: 0 };
});


// 🎯 Game Loop
function gameLoop() {
    moveSnake();
    draw();
}

// 🚀 Start Button Logic
startBtn.addEventListener('click', () => {
    bgMusic.play();

    // ✅ Reset Score and Display it
    score = 0;
    document.getElementById('score').textContent = score;

    // ✅ Clear previous game interval if running
    if (gameInterval) {
        clearInterval(gameInterval);
    }

    // ✅ Start the game loop with updated speed
    gameInterval = setInterval(gameLoop, gameSpeed);
});
