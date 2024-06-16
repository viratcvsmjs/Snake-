const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const startButton = document.getElementById('startButton');

const box = 20;
let snake = [];
snake[0] = { x: 10 * box, y: 10 * box };
let food = {
    x: Math.floor(Math.random() * 19 + 1) * box,
    y: Math.floor(Math.random() * 19 + 1) * box
};
let direction;
let score = 0;
let timeLeft = 30;  // 30 seconds time limit
let lives = 1;  // One life for the player

document.addEventListener('keydown', setDirection);
startButton.addEventListener('click', startGame);

function startGame() {
    startButton.style.display = 'none';
    canvas.style.display = 'block';
    score = 0;
    timeLeft = 30;
    lives = 1;
    snake = [{ x: 10 * box, y: 10 * box }];
    direction = undefined;
    game = setInterval(draw, 100);
    timer = setInterval(countDown, 1000);
}

function setDirection(event) {
    if (event.keyCode === 37 && direction !== 'RIGHT') {
        direction = 'LEFT';
    } else if (event.keyCode === 38 && direction !== 'DOWN') {
        direction = 'UP';
    } else if (event.keyCode === 39 && direction !== 'LEFT') {
        direction = 'RIGHT';
    } else if (event.keyCode === 40 && direction !== 'UP') {
        direction = 'DOWN';
    }
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawGrid();
    
    for (let i = 0; i < snake.length; i++) {
        ctx.fillStyle = 'white';
        ctx.fillRect(snake[i].x, snake[i].y, box, box);
    }

    ctx.fillStyle = 'lightblue';  // Change food color to light blue
    ctx.fillRect(food.x, food.y, box, box);

    ctx.fillStyle = 'white';
    ctx.font = '20px Arial';
    ctx.fillText('Time Left: ' + timeLeft, 10, 20);
    ctx.fillText('Score: ' + score, 10, 40);
    ctx.fillText('Lives: ' + lives, 10, 60);

    let snakeX = snake[0].x;
    let snakeY = snake[0].y;

    if (direction === 'LEFT') snakeX -= box;
    if (direction === 'UP') snakeY -= box;
    if (direction === 'RIGHT') snakeX += box;
    if (direction === 'DOWN') snakeY += box;

    if (snakeX === food.x && snakeY === food.y) {
        score++;
        food = {
            x: Math.floor(Math.random() * 19 + 1) * box,
            y: Math.floor(Math.random() * 19 + 1) * box
        };
    } else {
        snake.pop();
    }

    let newHead = { x: snakeX, y: snakeY };

    if (collision(newHead, snake) || snakeX < 0 || snakeY < 0 || snakeX >= canvas.width || snakeY >= canvas.height) {
        if (lives > 0) {
            lives--;
            resetGame();  // Reset the game state but keep the remaining life
        } else {
            clearInterval(game);
            clearInterval(timer);
            alert('Game Over');
            return;
        }
    }

    snake.unshift(newHead);
}

function drawGrid() {
    ctx.strokeStyle = 'white';
    ctx.lineWidth = 1;
    for (let x = 0; x <= canvas.width; x += box) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
    }
    for (let y = 0; y <= canvas.height; y += box) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
    }
}

function collision(head, array) {
    for (let i = 0; i < array.length; i++) {
        if (head.x === array[i].x && head.y === array[i].y) {
            return true;
        }
    }
    return false;
}

function countDown() {
    if (timeLeft <= 0) {
        clearInterval(game);
        clearInterval(timer);
        alert('Time\'s up! Game Over');
    } else {
        timeLeft--;
    }
}

function resetGame() {
    // Reset the game state while keeping the remaining life
    snake = [{ x: 10 * box, y: 10 * box }];
    direction = undefined;
}

let game;
let timer;
