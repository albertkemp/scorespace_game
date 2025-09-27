/*
 ____   _____  __________   _____
|    | |             |     /
|____| |____         |     \__
|           \        |        \
|       ____/   \___/    _____/




*/

//Defining global variables - x, y, speed. OriginalX is for teleporting it back to the start
let playerHahaX = 0;


let playerX=300;
let coins = 5;
const originalX = playerX;
const playerY = 400;
let playerSpeed = 5;
let isInvisible = false;
let bullets = 10;
var gameState = "start";
var canvasWidth = 600;
var canvasHeight = 600;
const obstacleRange = 2000;
const obstacleXRange = 2000;
const obstacleNumber = 3600;
const blockRange = 100;
let lives = 3;
let distanceCompleted = 0;


let moveLeft = false;
let moveRight = false;
const startButtonX = 250;
const startButtonY = 250;
const startButtonWidth = 100;
const startButtonHeight = 50;
let obstacleMoving = true;
let blockSpeed =3;
let playerImage;
/*
function preload() {
playerImage = ""
}*/
 let player = {
    x: playerX,
    y: playerY,
    w: 20,
    h: 20
  }
  let mouseButton = {
    x:startButtonX,
    y:startButtonY,
    width:startButtonWidth,
    height:startButtonHeight
  }

function setup() {
  createCanvas(canvasWidth, canvasHeight);
}
let obstacleCourse = [
  {name: "chance", x: 100, y: 100, w: 200, h: 50, hasCollided: false, c: "40%"},
  {name: "chance", x: 600, y:300, w: 20, h: 20, hasCollided: false,c: "10%"},
  {name: "chance", x: 200, y: 500, w: 220, h: 50, hasCollided: false,c: "20%"},
  {name: "chance", x: 400, y: 700, w: 400, h: 80, hasCollided: false,c: "10%"},
  {name: "chance", x: 100, y: 900, w: 400, h: 50, hasCollided: false,c: "20%"},
  {name: "chance", x:500, y: 1100, w: 300, h: 80, hasCollided: false,c: "5%"},
  {name: "chance", x:0, y: 1300, w: 200, h: 25, hasCollided: false,c: "80%"},
  {name: "chance", x:5, y: 1500, w: 150, h: 50, hasCollided: false,c: "5%"},
  {name: "chance", x:100, y: 1700, w: 150, h: 40, hasCollided: false,c: "5%"},
  {name: "chance", x: 800, y: 1800, w: 60, h: 20, hasCollided: false,c: "60%"},
  {name: "block", x: 200, y: 400, w: 20, h: 50}
];
for (obstacle in obstacleCourse) {//can be changed
  obstacleCourse[obstacle].y-=obstacleRange;
}
function randInt(min, max){
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
let randomInt = randInt(0, 100);

function drawBlock(x, y, w, h) {
  rect(x, y, w, h);
}
function drawChance(x, y, w, h, p) {
  
  rect(x, y, w, h);
  fill(0);
  text(p, x, y, w, h);
  fill(255);
}
function draw() {
  background(50);
  textSize(20);
  fill(255);
  text("Distance covered"+distanceCompleted, 20, 20, 200, 100);
  if (gameState == "start") {
    drawStartPage();
  } else if (gameState == "playing") {
    drawPlayPage();
  
  } else if (gameState == "end") {
    drawEndPage();
  } else if (gameState == "died") {
    drawDiedPage();
  }
   rect(player.x, player.y, player.w, player.h);
  if (moveLeft) {
    if (playerHahaX<=canvasWidth/2-obstacleXRange) {
      if (player.x>0) {
        player.x-=playerSpeed;
      }
    } else {
    left();
    }
  } else if (moveRight) {
    if (playerHahaX>=obstacleXRange-canvasWidth/2){
      if (player.x+player.w<canvasWidth) {
      player.x+=playerSpeed;
      }
    } else {
    right();
      
    }
  }
  
}
function keyPressed() {
  if (keyCode === LEFT_ARROW || keyCode === 65) {
    moveLeft = true;
    moveRight = false;
  } else if (keyCode === RIGHT_ARROW || keyCode === 68) {
    moveRight = true;
    moveLeft = false;
  }
  //We can add more key stuff here, like fire missile, invisible, etc.
}
function keyReleased() {
  if (keyCode === LEFT_ARROW || keyCode === 65) {
    moveLeft = false;
  } else if (keyCode === RIGHT_ARROW || keyCode === 68) {
    moveRight = false;
  }
}
function drawStartPage() {
  background(50);
  textSize(60);
  fill(255)
  text("Blah", 200, 100);
  textSize(20);
  rect(startButtonX, startButtonY, startButtonWidth, startButtonHeight);
  fill(0)
  text("PLAY", startButtonX, startButtonY, startButtonWidth, startButtonHeight);
  fill(255);
}
function drawDiedPage() {
  background(50);
  textSize(30);
  text("You died", 100, 100, 200, 100);
}
function mouseClicked() {
  if (gameState == "start") {
    if (mouseX >= startButtonX && mouseY >= startButtonY && mouseY <= startButtonY + startButtonHeight && mouseX <= startButtonX + startButtonWidth) {
      gameState = "playing";
    }
  } 
}

function playerTouching(obj) {
    // Basic collision detection
    if (!(player.x + player.w < obj.x || player.x > obj.x + obj.w || player.y + player.h < obj.y || player.y > obj.y + obj.h)) {
        // We have a collision, now handle the chance logic
        if (obj.name === "chance") {
            // This is the crucial part: Check if this is the first frame of collision
            if (!obj.hasCollided) {
                obj.hasCollided = true; // Lock in the collision
                const percentageInt = parseInt(obj.c);
                let randomChance = randInt(0, 100);

                // Determine and store the outcome of this single event
                if (randomChance > percentageInt) {
                    obj.isBlocked = true;
                } else {
                    obj.isBlocked = false;
                }
            }
            // Return the stored outcome, not a new random one
            return obj.isBlocked;
        }
        if (obj.name=== "block") {
          gameState = "died";
        }
    } else {
        // If there's no collision, reset the flag for the next time
        if (obj.hasCollided) {
            obj.hasCollided = false;
        }
    }
    // No collision at all, so the player is not stopped
    return false;
}

function drawPlayPage() {
    textSize(20);
    obstacleMoving = true;

    for (let i = 0; i < obstacleCourse.length; i++) {
        let obstacle = obstacleCourse[i];
        
        // This is the only place we check for player stopping
        if (playerTouching(obstacle)) {
            obstacleMoving = false;
            // The break is still a good idea here to stop processing obstacles once one has blocked the player
            break; 
        }
    }
    
    // Move obstacles only if the player is not blocked by any of them
    if (obstacleMoving) {
        for (let i = 0; i < obstacleCourse.length; i++) {
            let obstacle = obstacleCourse[i];
            obstacle.y += blockSpeed;
        }
        distanceCompleted += blockSpeed;
    }

    // This section is for drawing, and should be separate from the movement logic
    for (let i = 0; i < obstacleCourse.length; i++) {
        let obstacle = obstacleCourse[i];
        if (obstacle.name === "block") {
            drawBlock(obstacle.x, obstacle.y, obstacle.w, obstacle.h);
        } else if (obstacle.name === "chance") {
            drawChance(obstacle.x, obstacle.y, obstacle.w, obstacle.h, obstacle.c);
        }
    }
}
function drawEndPage() {
  textSize(30);
  text('Your score: blah', 100, 200, 300, 50);
}
function left() {
  for(obstacle in obstacleCourse) {
    obstacleCourse[obstacle].x+=playerSpeed;
    playerHahaX-=playerSpeed;
  }
}
function right() {
  for (obstacle in obstacleCourse) {
    obstacleCourse[obstacle].x-=playerSpeed;
    playerHahaX+=playerSpeed
  }
}