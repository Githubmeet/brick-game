// Get the canvas element
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const startBtn = document.getElementById('startBtn');

// Game variables
let ballRadius = 10;
let paddleHeight = 10;
let paddleWidth = 75;
let brickRowCount = 5;
let brickColumnCount = 10;
let brickWidth;
let brickHeight;
let brickPadding = 10;
let brickOffsetTop = 30;
let brickOffsetLeft;
let x;
let y;
let dx;
let dy;
let paddleX;
let rightPressed = false;
let leftPressed = false;
let score = 0;
let lives = 3;
let level = 1;

const bricks = [];

// Resizing and scaling
function resizeCanvas() {
  canvas.width = window.innerWidth * 0.9;
  canvas.height = window.innerHeight * 0.8;

  brickWidth = (canvas.width - (brickColumnCount + 1) * brickPadding) / brickColumnCount;
  brickHeight = 20;
  brickOffsetLeft = (canvas.width - (brickColumnCount * (brickWidth + brickPadding) - brickPadding)) / 2;

  x = canvas.width / 2;
  y = canvas.height - 30;
  dx = 2;
  dy = -2;
  paddleX = (canvas.width - paddleWidth) / 2;

  ballRadius = Math.min(10, canvas.width / 80);
  paddleHeight = Math.min(10, canvas.height / 60);
  paddleWidth = Math.min(75, canvas.width / 10);

  resetBricks();
}

window.addEventListener('resize', resizeCanvas);

// Reset bricks
function resetBricks() {
  bricks.length = 0;
  for (let c = 0; c < brickColumnCount; c++) {
    bricks[c] = [];
    for (let r = 0; r < brickRowCount; r++) {
      bricks[c][r] = { x: 0, y: 0, status: 1 };
    }
  }
}

// Draw the ball, paddle, and bricks
function drawBall() {
  ctx.beginPath();
  ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
  ctx.fillStyle = '#0095DD';
  ctx.fill();
  ctx.closePath();
}

function drawPaddle() {
  ctx.beginPath();
  ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
  ctx.fillStyle = '#0095DD';
  ctx.fill();
  ctx.closePath();
}

function drawBricks() {
  for (let c = 0; c < brickColumnCount; c++) {
    for (let r = 0; r < brickRowCount; r++) {
      if (bricks[c][r].status === 1) {
        const brickX = c * (brickWidth + brickPadding) + brickOffsetLeft;
        const brickY = r * (brickHeight + brickPadding) + brickOffsetTop;
        bricks[c][r].x = brickX;
        bricks[c][r].y = brickY;
        ctx.beginPath();
        ctx.rect(brickX, brickY, brickWidth, brickHeight);
        ctx.fillStyle = '#0095DD';
        ctx.fill();
        ctx.closePath();
      }
    }
  }
}

// Handle keyboard events
document.addEventListener('keydown', keyDownHandler, false);
document.addEventListener('keyup', keyUpHandler, false);

function keyDownHandler(e) {
  if (e.key === 'Right' || e.key === 'ArrowRight') {
    rightPressed = true;
  } else if (e.key === 'Left' || e.key === 'ArrowLeft') {
    leftPressed = true;
  }
}

function keyUpHandler(e) {
  if (e.key === 'Right' || e.key === 'ArrowRight') {
    rightPressed = false;
  } else if (e.key === 'Left' || e.key === 'ArrowLeft') {
    leftPressed = false;
  }
}

// Collision detection
function collisionDetection() {
  for (let c = 0; c < brickColumnCount; c++) {
    for (let r = 0; r < brickRowCount; r++) {
      const b = bricks[c][r];
      if (b.status === 1) {
        if (
          x > b.x &&
          x < b.x + brickWidth &&
          y > b.y &&
          y < b.y + brickHeight
        ) {
          dy = -dy;
          b.status = 0;
          score++;
          if (score === brickRowCount * brickColumnCount) {
            alert(`YOU WIN LEVEL ${level}! Congratulations!`);
            level++;
            resetBricks();
            score = 0;
          }
        }
      }
    }
  }
}

// Game loop
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawBall();
  drawPaddle();
  drawBricks();
  collisionDetection();

  // Move the ball
  x += dx;
  y += dy;

  // Bounce off the walls
  if (x + dx > canvas.width - ballRadius || x + dx < ballRadius) {
    dx = -dx;
  }
  if (y + dy < ballRadius) {
    dy = -dy;
  } else if (y + dy > canvas.height - ballRadius) {
    if (x > paddleX && x < paddleX + paddleWidth) {
      dy = -dy;
    } else {
      lives--;
      if (!lives) {
        alert('GAME OVER');
        document.location.reload();
      } else {
        x = canvas.width / 2;
        y = canvas.height - 30;
        dx = 2;
        dy = -2;
        paddleX = (canvas.width - paddleWidth) / 2;
      }
    }
  }
 
  // Move the paddle
  if (rightPressed && paddleX < canvas.width - paddleWidth) {
    paddleX += 7;
  } else if (leftPressed && paddleX > 0) {
    paddleX -= 7;
  }
 
  // Update game info display
  document.getElementById('scoreDisplay').innerHTML = `Score: ${score}`;
  document.getElementById('livesDisplay').innerHTML = `Lives: ${lives}`;
  document.getElementById('levelDisplay').innerHTML = `Level: ${level}`;
 
  requestAnimationFrame(draw);
 }
 
 // Start game
 startBtn.addEventListener('click', () => {
  resizeCanvas();
  draw();
  startBtn.style.display = 'none';
 });
 
 // Resize canvas on window load
 window.addEventListener('load', resizeCanvas);