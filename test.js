/*
 ____   _____  __________   _____
|    | |             |     /
|____| |____         |     \__
|           \        |        \
|       ____/   \___/    _____/
*/

// Defining global variables - x, y, speed. OriginalX is for teleporting it back to the start
let playerHahaX = 0;

const playerY = 400;
let playerSpeed = 5;
let isInvisible = false;
let bullets = 10;
let gameState = "start";
const canvasWidth = 600;
const canvasHeight = 600;
const obstacleRange = 2000;
const obstacleXRange = 1000;
const obstacleNumber = 3600;
const blockRange = 100;
let lives = 3;

let moveLeft = false;
let moveRight = false;
const startButtonX = 250;
const startButtonY = 250;
const startButtonWidth = 100;
const startButtonHeight = 50;
let obstacleMoving = true;
let blockSpeed = 7;

let player = {
    x: canvasWidth / 2,
    y: playerY,
    w: 20,
    h: 20
}

let mouseButton = {
    x: startButtonX,
    y: startButtonY,
    width: startButtonWidth,
    height: startButtonHeight
}

function setup() {
    createCanvas(canvasWidth, canvasHeight);
}

let obstacleCourse = [
    { name: "chance", x: 100, y: 100, w: 100, h: 50, c: "40%" },
    { name: "chance", x: 600, y: 300, w: 10, h: 20, c: "10%" },
    { name: "chance", x: 200, y: 500, w: 60, h: 50, c: "20%" },
    { name: "chance", x: 400, y: 700, w: 100, h: 80, c: "10%" },
    { name: "chance", x: -100, y: 900, w: 200, h: 50, c: "20%" },
    { name: "chance", x: 500, y: 1100, w: 300, h: 80, c: "5%" },
    { name: "chance", x: 0, y: 1300, w: 200, h: 25, c: "80%" },
    { name: "chance", x: 5, y: 1500, w: 150, h: 50, c: "5%" },
    { name: "chance", x: -100, y: 1700, w: 150, h: 40, c: "5%" },
    { name: "chance", x: 800, y: 1800, w: 60, h: 20, c: "60%" }
];

// Correctly initialize obstacles relative to their y position
for (let obstacle of obstacleCourse) {
    obstacle.y -= obstacleRange;
}

function randInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function drawBlock(x, y, w, h) {
    rect(x, y, w, h);
}

function drawChance(x, y, w, h, p) {
    rect(x, y, w, h);
    text(p, x, y, w, h);
}

// Function to handle player and background movement
function handleMovement() {
    const deadZoneX = canvasWidth * 0.25; // Define a "dead zone" for the player
    const rightBoundary = obstacleXRange - canvasWidth;

    if (moveLeft) {
        // If the player is on the left edge of the screen, or the "camera" is at the world edge, move the player
        if (player.x <= deadZoneX || playerHahaX <= 0) {
            player.x -= playerSpeed;
        } else {
            // Otherwise, move the background to simulate player movement
            left();
        }
    } else if (moveRight) {
        // If the player is on the right edge of the screen, or the "camera" is at the world edge, move the player
        if (player.x + player.w >= canvasWidth - deadZoneX || playerHahaX >= rightBoundary) {
            player.x += playerSpeed;
        } else {
            // Otherwise, move the background
            right();
        }
    }
    // Constrain player to canvas boundaries
    player.x = constrain(player.x, 0, canvasWidth - player.w);
    // Constrain the 'perceived' player x to the world boundaries
    playerHahaX = constrain(playerHahaX, 0, rightBoundary);
}

function draw() {
    background(220);

    if (gameState === "start") {
        drawStartPage();
    } else if (gameState === "playing") {
        drawPlayPage();
        handleMovement(); // Call the movement logic here
    } else if (gameState === "end") {
        drawEndPage();
    }

    if (gameState === "playing") {
        // Draw player only during the playing state
        rect(player.x, player.y, player.w, player.h);
    }
}

function keyPressed() {
    if (keyCode === LEFT_ARROW || keyCode === 65) {
        moveLeft = true;
        moveRight = false; // Prevents simultaneous movement
    } else if (keyCode === RIGHT_ARROW || keyCode === 68) {
        moveRight = true;
        moveLeft = false; // Prevents simultaneous movement
    }
}

function keyReleased() {
    if (keyCode === LEFT_ARROW || keyCode === 65) {
        moveLeft = false;
    } else if (keyCode === RIGHT_ARROW || keyCode === 68) {
        moveRight = false;
    }
}

function drawStartPage() {
    background(220);
    textSize(60);
    text("Blah", 200, 100);
    textSize(20);
    rect(startButtonX, startButtonY, startButtonWidth, startButtonHeight);
    text("PLAY", startButtonX, startButtonY, startButtonWidth, startButtonHeight);
}

function mouseClicked() {
    if (gameState === "start") {
        if (mouseX >= startButtonX && mouseY >= startButtonY && mouseY <= startButtonY + startButtonHeight && mouseX <= startButtonX + startButtonWidth) {
            gameState = "playing";
        }
    }
}

function playerTouching(obj) {
    // Correct AABB collision check
    if (player.x < obj.x + obj.w &&
        player.x + player.w > obj.x &&
        player.y < obj.y + obj.h &&
        player.y + player.h > obj.y) {

        if (obj.name === "chance") {
            const percentageInt = parseInt(obj.c);
            const randomInt = randInt(0, 100); // Generate a new random number each time
            if (randomInt <= percentageInt) {
                return false;
            } else {
                lives--;
                return true;
            }
        } else if (obj.name === "block") {
            lives--; // Decrement lives on collision with any solid block
            return true;
        }
    }
    return false;
}

function drawPlayPage() {
    textSize(20);
    text("Lives: " + lives, 20, 20, 200, 100);

    obstacleMoving = true;
    for (let i = 0; i < obstacleCourse.length; i++) {
        if (playerTouching(obstacleCourse[i])) {
            obstacleMoving = false;
            break;
        }
    }

    for (let obstacle of obstacleCourse) {
        if (obstacleMoving) {
            obstacle.y += blockSpeed;
        }

        if (obstacle.name === "block") {
            drawBlock(obstacle.x, obstacle.y, obstacle.w, obstacle.h);
        } else if (obstacle.name === "chance") {
            drawChance(obstacle.x, obstacle.y, obstacle.w, obstacle.h, obstacle.c);
        }
    }

    if (lives <= 0) {
        gameState = "end";
    }
}

function drawEndPage() {
    textSize(30);
    text('Your score: blah', 100, 200, 200, 50);
}

function left() {
    // Move obstacles and update 'perceived' player position
    for (let obstacle of obstacleCourse) {
        obstacle.x += playerSpeed;
    }
    playerHahaX -= playerSpeed;
}

function right() {
    // Move obstacles and update 'perceived' player position
    for (let obstacle of obstacleCourse) {
        obstacle.x -= playerSpeed;
    }
    playerHahaX += playerSpeed;
}