const canvas = document.getElementById('gameCanvas');
const context = canvas.getContext('2d');
const boxSize = 20;
const gridWidth = canvas.width / boxSize;
const gridHeight = canvas.height / boxSize;
let snake = [{ x: 10, y: 10 }];
let direction = 'right';
let food = { x: 0, y: 0 };
let score = 0;
let gameInterval;
let touchStartX = 0;
let touchStartY = 0;

document.addEventListener('keydown', handleKeyDown);
canvas.addEventListener('mousedown', handleMouseDown);
canvas.addEventListener('mouseup', handleMouseUp);
canvas.addEventListener('mousemove', handleMouseMove);
canvas.addEventListener('touchstart', handleTouchStart);
canvas.addEventListener('touchend', handleTouchEnd);
canvas.addEventListener('touchmove', handleTouchMove);

function startGame() {
  snake = [{ x: 10, y: 10 }];
  direction = 'right';
  score = 0;
  generateFood();

  if (gameInterval) {
    clearInterval(gameInterval);
  }

  gameInterval = setInterval(update, 200);
}

function generateFood() {
  do {
    food.x = Math.floor(Math.random() * gridWidth);
    food.y = Math.floor(Math.random() * gridHeight);
  } while (snake.some(segment => segment.x === food.x && segment.y === food.y));
}

function draw() {
  context.clearRect(0, 0, canvas.width, canvas.height);

  snake.forEach(segment => {
    context.fillStyle = 'white';
    context.fillRect(segment.x * boxSize, segment.y * boxSize, boxSize, boxSize);
    context.strokeStyle = 'black';
    context.strokeRect(segment.x * boxSize, segment.y * boxSize, boxSize, boxSize);
  });

  context.fillStyle = 'red';
  context.fillRect(food.x * boxSize, food.y * boxSize, boxSize, boxSize);

  context.fillStyle = 'white';
  context.font = '20px Arial';
  context.fillText(`Score: ${score}`, 10, 30);
}

function update() {
  const head = { x: snake[0].x, y: snake[0].y };

  if (direction === 'right') head.x++;
  if (direction === 'left') head.x--;
  if (direction === 'up') head.y--;
  if (direction === 'down') head.y++;

  if (head.x === food.x && head.y === food.y) {
    score++;
    snake.push({});
    generateFood();
  } else {
    snake.pop();
  }

  if (checkCollision(head)) {
    clearInterval(gameInterval);
    alert('Game Over');
    return;
  }

  snake.unshift(head);

  draw();
}

function checkCollision(head) {
  return (
    head.x < 0 ||
    head.x >= gridWidth ||
    head.y < 0 ||
    head.y >= gridHeight ||
    snake.some(segment => segment.x === head.x && segment.y === head.y)
  );
}

function handleKeyDown(event) {
  if (event.key === 'ArrowRight' && direction !== 'left') direction = 'right';
  if (event.key === 'ArrowLeft' && direction !== 'right') direction = 'left';
  if (event.key === 'ArrowUp' && direction !== 'down') direction = 'up';
  if (event.key === 'ArrowDown' && direction !== 'up') direction = 'down';
}

function handleMouseDown(event) {
  touchStartX = event.clientX;
  touchStartY = event.clientY;
}

function handleMouseUp(event) {
  const touchEndX = event.clientX;
  const touchEndY = event.clientY;
  handleTouchMove(touchEndX, touchEndY);
}

function handleMouseMove(event) {
  if (event.buttons === 1) {
    const touchEndX = event.clientX;
    const touchEndY = event.clientY;
    handleTouchMove(touchEndX, touchEndY);
  }
}

function handleTouchStart(event) {
  touchStartX = event.touches[0].clientX;
  touchStartY = event.touches[0].clientY;
}

function handleTouchEnd(event) {
  const touchEndX = event.changedTouches[0].clientX;
  const touchEndY = event.changedTouches[0].clientY;
  handleTouchMove(touchEndX, touchEndY);
}

function handleTouchMove(touchEndX, touchEndY) {
  const dx = touchEndX - touchStartX;
  const dy = touchEndY - touchStartY;

  if (Math.abs(dx) > Math.abs(dy)) {
    direction = dx > 0 ? 'right' : 'left';
  } else {
    direction = dy > 0 ? 'down' : 'up';
  }
}

const startButton = document.getElementById('startButton');
const stopButton = document.getElementById('stopButton');

startButton.addEventListener('click', startGame);
stopButton.addEventListener('click', function () {
  clearInterval(gameInterval);
  location.reload();
});

