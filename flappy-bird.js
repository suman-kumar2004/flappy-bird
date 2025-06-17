let flappyBirdCanvas = document.getElementById("flappyBirdCanvas");
let flappyCtx = flappyBirdCanvas.getContext("2d");


let bird = { x: 50, y: 150, width: 20, height: 20, gravity: 0.6, lift: -10, velocity: 0 };


let pipes = [];
let frameCount = 0;
let isGameOver = false;
let speedControl = 0;
let score = 0;

// Function to start the game
function startFlappyBird() {
    bird.y = 150;
    bird.velocity = 0;
    pipes = [];
    frameCount = 0;
    score = 0; // Reset the score
    isGameOver = false;
    speedControl = 0;
    requestAnimationFrame(updateFlappyBird);
}

// Function to update the game state
function updateFlappyBird() {
    if (isGameOver) return;

    // Slow down the game by skipping frames
    speedControl++;
    if (speedControl % 2 !== 0) {
        requestAnimationFrame(updateFlappyBird);
        return;
    }

    flappyCtx.clearRect(0, 0, flappyBirdCanvas.width, flappyBirdCanvas.height);

    // Update bird position
    bird.velocity += bird.gravity;
    bird.velocity = Math.min(bird.velocity, 10); // Cap the downward speed
    bird.y += bird.velocity;

    // Check for collision with top and bottom of the canvas
    if (bird.y + bird.height >= flappyBirdCanvas.height || bird.y <= 0) {
        isGameOver = true;
        alert(`Game Over! Your score: ${score}`);
        return;
    }

    // Draw the bird
    flappyCtx.fillStyle = "yellow";
    flappyCtx.fillRect(bird.x, bird.y, bird.width, bird.height);

    // Spawn new pipes at intervals
    if (frameCount % 150 === 0) {
        let pipeHeight = Math.random() * (flappyBirdCanvas.height / 2);
        pipes.push({ x: flappyBirdCanvas.width, y: pipeHeight });
    }

    // Update and draw pipes
    for (let i = 0; i < pipes.length; i++) {
        pipes[i].x -= 2; // Adjust speed for wider canvas

        // Remove pipes that go off-screen
        if (pipes[i].x < -30) pipes.splice(i, 1);

        // Draw top and bottom pipes
        flappyCtx.fillStyle = "green";
        flappyCtx.fillRect(pipes[i].x, 0, 30, pipes[i].y);
        flappyCtx.fillRect(pipes[i].x, pipes[i].y + 150, 30, flappyBirdCanvas.height);

        // Check for collision with pipes
        if (
            bird.x < pipes[i].x + 30 &&
            bird.x + bird.width > pipes[i].x &&
            (bird.y < pipes[i].y || bird.y + bird.height > pipes[i].y + 150)
        ) {
            isGameOver = true;
            alert(`Game Over! Your score: ${score}`);
            return;
        }

        // Increment the score when the bird passes a pipe
        if (!pipes[i].scored && pipes[i].x + 30 < bird.x) {
            score++;
            pipes[i].scored = true; // Mark the pipe as scored
        }
    }

    // Draw the score
    flappyCtx.fillStyle = "white";
    flappyCtx.font = "24px Arial";
    flappyCtx.fillText(`Score: ${score}`, flappyBirdCanvas.width - 100, 30);

    frameCount++;
    requestAnimationFrame(updateFlappyBird);
}

// Event listener for bird controls
window.addEventListener("keydown", (e) => {
    if (e.code === "Space" || e.code === "ArrowUp") {
        bird.velocity = bird.lift;
    }
});
