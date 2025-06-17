let pongCanvas = document.getElementById("pongCanvas");
let pongCtx = pongCanvas.getContext("2d");

// Ball properties
let ball = { x: pongCanvas.width / 2, y: pongCanvas.height / 2, radius: 10, dx: 2, dy: 2 };

// Paddle properties
let paddleHeight = 100;
let paddleWidth = 10;

// Left (computer-controlled) paddle
let leftPaddle = { x: 0, y: (pongCanvas.height - paddleHeight) / 2, speed: 2 };

// Right (user-controlled) paddle
let rightPaddle = { x: pongCanvas.width - paddleWidth, y: (pongCanvas.height - paddleHeight) / 2, speed: 5 };

// User input tracking
let rightPaddleUp = false;
let rightPaddleDown = false;

// Scores and chances
let leftScore = 0;
let rightScore = 0;
let leftChances = 3;
let rightChances = 3;

// Game status
let isGameOver = false;

// Function to start the game
function startPongGame() {
    ball.x = pongCanvas.width / 2;
    ball.y = pongCanvas.height / 2;
    ball.dx = 2;
    ball.dy = 2;
    leftPaddle.y = (pongCanvas.height - paddleHeight) / 2;
    rightPaddle.y = (pongCanvas.height - paddleHeight) / 2;
    leftScore = 0;
    rightScore = 0;
    leftChances = 3;
    rightChances = 3;
    isGameOver = false;
    requestAnimationFrame(updatePongGame);
}

// Function to display game over message
function displayWinner() {
    let winner = leftChances === 0 ? "Player" : "Computer";
    pongCtx.fillStyle = "white";
    pongCtx.font = "30px Arial";
    pongCtx.textAlign = "center";
    pongCtx.fillText(`Game Over! Winner: ${winner}`, pongCanvas.width / 2, pongCanvas.height / 2);
}

// Function to update game state
function updatePongGame() {
    if (isGameOver) return;

    pongCtx.clearRect(0, 0, pongCanvas.width, pongCanvas.height);

    // Move ball
    ball.x += ball.dx;
    ball.y += ball.dy;

    // Bounce ball off top and bottom walls
    if (ball.y + ball.radius > pongCanvas.height || ball.y - ball.radius < 0) {
        ball.dy *= -1;
    }

    // Bounce ball off paddles
    if (
        ball.x - ball.radius < leftPaddle.x + paddleWidth && // Left paddle
        ball.y > leftPaddle.y &&
        ball.y < leftPaddle.y + paddleHeight
    ) {
        ball.dx *= -1;
        ball.x = leftPaddle.x + paddleWidth + ball.radius; // Avoid sticking
    }

    if (
        ball.x + ball.radius > rightPaddle.x && // Right paddle
        ball.y > rightPaddle.y &&
        ball.y < rightPaddle.y + paddleHeight
    ) {
        ball.dx *= -1;
        ball.x = rightPaddle.x - ball.radius; // Avoid sticking
    }

    // Reset ball if it goes out of bounds and adjust chances
    if (ball.x + ball.radius < 0) {
        rightScore++;
        leftChances--;
        if (leftChances === 0) {
            isGameOver = true;
            displayWinner();
            return;
        }
        resetBall();
    }

    if (ball.x - ball.radius > pongCanvas.width) {
        leftScore++;
        rightChances--;
        if (rightChances === 0) {
            isGameOver = true;
            displayWinner();
            return;
        }
        resetBall();
    }

    // Move left paddle (computer AI)
    if (ball.y < leftPaddle.y + paddleHeight / 2) {
        leftPaddle.y -= leftPaddle.speed;
    } else {
        leftPaddle.y += leftPaddle.speed;
    }

    // Keep left paddle within bounds
    leftPaddle.y = Math.max(0, Math.min(pongCanvas.height - paddleHeight, leftPaddle.y));

    // Move right paddle (user)
    if (rightPaddleUp && rightPaddle.y > 0) {
        rightPaddle.y -= rightPaddle.speed;
    }
    if (rightPaddleDown && rightPaddle.y < pongCanvas.height - paddleHeight) {
        rightPaddle.y += rightPaddle.speed;
    }

    // Draw ball
    pongCtx.beginPath();
    pongCtx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
    pongCtx.fillStyle = "white";
    pongCtx.fill();
    pongCtx.closePath();

    // Draw paddles
    pongCtx.fillStyle = "white";
    pongCtx.fillRect(leftPaddle.x, leftPaddle.y, paddleWidth, paddleHeight); // Left paddle
    pongCtx.fillRect(rightPaddle.x, rightPaddle.y, paddleWidth, paddleHeight); // Right paddle

    // Display scores and chances
    pongCtx.fillStyle = "white";
    pongCtx.font = "16px Arial";
    pongCtx.fillText(`Computer: ${leftScore} | Chances: ${leftChances}`, 150, 20);
    pongCtx.fillText(`Player: ${rightScore} | Chances: ${rightChances}`, pongCanvas.width - 200, 20);

    requestAnimationFrame(updatePongGame);
}

// Function to reset the ball
function resetBall() {
    ball.x = pongCanvas.width / 2;
    ball.y = pongCanvas.height / 2;
    ball.dx *= -1; // Change direction
    ball.dy = 2 * (Math.random() > 0.5 ? 1 : -1); // Random vertical direction
}

// Event listeners for user input
window.addEventListener("keydown", (e) => {
    if (e.code === "ArrowUp") rightPaddleUp = true;
    if (e.code === "ArrowDown") rightPaddleDown = true;
});

window.addEventListener("keyup", (e) => {
    if (e.code === "ArrowUp") rightPaddleUp = false;
    if (e.code === "ArrowDown") rightPaddleDown = false;
});
