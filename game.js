const canvas = document.getElementById('gameCanvas');
const context = canvas.getContext('2d');
const boxSize = 20;
let snake = [];
let direction;
let food = { x: 0, y: 0 };
let score = 0;

canvas.addEventListener('mousemove', handleMouseMove);

function startGame() {
  snake = [];
  snake[0] = { x: 10, y: 10 };
  direction = 'right';
  score = 0;
  generateFood();

  setInterval(update, 200);
}

function generateFood() {
  food.x = Math.floor(Math.random() * (canvas.width / boxSize));
  food.y = Math.floor(Math.random() * (canvas.height / boxSize));
}

function draw() {
  context.clearRect(0, 0, canvas.width, canvas.height);

  for (let i = 0; i < snake.length; i++) {
    context.fillStyle = i === 0 ? 'pink' : 'white';
    context.fillRect(snake[i].x * boxSize, snake[i].y * boxSize, boxSize, boxSize);
    context.strokeStyle = 'black';
    context.strokeRect(snake[i].x * boxSize, snake[i].y * boxSize, boxSize, boxSize);
  }

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
    generateFood();
  } else {
    snake.pop();
  }

  snake.unshift(head);

  draw();
}

function handleMouseMove(event) {
  const canvasRect = canvas.getBoundingClientRect();
  const mouseX = event.clientX - canvasRect.left;
  const mouseY = event.clientY - canvasRect.top;

  const snakeHead = snake[0];
  const dx = mouseX - snakeHead.x * boxSize;
  const dy = mouseY - snakeHead.y * boxSize;

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
  location.reload();
});
