/*
 .----.  .---. .----.  .--.  .-. .-.
/  {}  \/  ___}| {_   / {} \ |  `| |
\      /\     }| {__ /  /\  \| |\  |
 `----'  `---' `----'`-'  `-'`-' `-'

 ____   _____  __________   _____
|    | |             |     /
|____| |____         |     \__
|           \        |        \
|       ____/   \___/    _____/

*/
let db;
let submitInputValue = "";
let submitted = false;
let scoresLoaded = false;
let highScores = [];

let gameModeTimed = true;

const diff = 40;
const small = 15;
//Defining global variables - x, y, speed. OriginalX is for teleporting it back to the start
let playerHahaX = 0;
let finalTim = 0; // Add this to your global variables section.

let playerX=300;
let coins = 5;
const originalX = playerX;
const playerY = 400;
let playerSpeed = 5;
let isInvisible = false;
let invisibility = 14400;
let speedBoost = 1600;
let speedBoostOn = false;

let bullets = 10;
var gameState = "start";
let playerState = "normal";
var canvasWidth = 600;
var canvasHeight = 600;
const obstacleRange = 12000;
const obstacleXRange = 2000;
const obstacleNumber = 3600;
const blockRange = 100;
let lives = 3;
let distanceCompleted = 0;


let moveLeft = false;
let moveRight = false;
const startButtonX = 250;
const startButtonY = 200;
const startButtonWidth = 100;
const startButtonHeight = 50;

const howButtonX = 250;
const howButtonY = 250;
const howButtonWidth = 100;
const howButtonHeight = 50;

const backButtonX = 100;
const backButtonY = 540;
const backButtonWidth = 100;
const backButtonHeight = 50;

const reButtonX = 250;
const reButtonY = 300;
const reButtonWidth = 200;
const reButtonHeight = 50;
let obstacleMoving = true;
let blockSpeed =7;
const speedyBlockSpeed = 46;

let startTime;
let elapsedTime = 0;
let isRunning = false;
let highScore = Infinity;

const submitNameButtonX = 438;
const submitNameButtonY = 230;
const submitNameButtonWidth = 100;
const submitNameButtonHeight = 50;

const playAgainButtonX = 200;
const playAgainButtonY = 100;
const playAgainButtonWidth = 150;
const playAgainButtonHeight = 50;

const highButtonX = 190;
const highButtonY = 300;
const highButtonWidth = 220;
const highButtonHeight = 50;

const settingsButtonX = 190;
const settingsButtonY = 350;
const settingsButtonWidth=220;
const settingsButtonHeight = 50;

const gameModeButtonX = 200;
const gameModeButtonY = 200;
const gameModeButtonWidth = 300;
const gameModeButtonHeight = 50;

const stuff = document.getElementById('stuff');
let gameModeButtonText = "Game mode: Timed";

let moving = false;
let firstmoving = true;

let keylog = ""
/*
function preload() {
playerImage = ""
}*/
 let player = {
    x: playerX,
    y: playerY,
    w: 40,
    h: 40
  }
  let mouseButton = {
    x:startButtonX,
    y:startButtonY,
    width:startButtonWidth,
    height:startButtonHeight
  }

let nameInput;
//Images:
let rock;
let boatNormal;
let boatLeft;
let boatRight;
let jelly;
let fish;
let playerInvisible;
let playerSpeedBoost;
let coral;
let sea;
let font;
let music;
let screenshot;
function preload() {
  rock = loadImage('images/rock.png');
  boatNormal = loadImage('images/boatnormal.png');
  boatLeft = loadImage('images/boatleft.png');
  boatRight = loadImage('images/boatright.png');
  jelly = loadImage('images/jelly.png');
  fish = loadImage('images/fish.png');
  playerInvisible = loadImage('images/playerinvisible.png');
  playerSpeedBoost = loadImage('images/playerspeed.png');
  coral = loadImage('images/coral.png');
  sea = loadImage('images/sea.png');
  font = loadFont('assets/PressStart2P-Regular.ttf');
  music = createAudio('assets/5499981141770240.wav');
  screenshot = loadImage('images/screenshot.png');
}
function setup() {
  createCanvas(canvasWidth, canvasHeight);
  nameInput = createInput('Enter your name');
  nameInput.position(444, 200);
  nameInput.hide(); // Hide it until the game is over
  db  = firebase.firestore();
  
}
let obstacleCourse = [
  {name: "chance", x: 100, y: 100, w: 100, h: 100, hasCollided: false, c: "50%"},
  {name: "block", x: 400, y:1300, w: 100, h: 100},
  {name: "chance", x: 200, y: 500, w: 200, h: 150, hasCollided: false, c: "80%"},//
  {name: "block", x: 250, y: 4700, w: 100, h: 100,},
  {name: "chance", x: -150, y: 1000,  w: 100, h: 100, hasCollided: false, c: "20%"},
  {name: "block", x:500, y: 1500,  w: 100, h: 100},
  {name: "chance", x:-150, y: 1200,  w: 100, h: 100, hasCollided: false, c: "50%"},
  //{name: "block", x:5, y: 1500, w: 100, h: 100},
  {name: "chance", x:100, y: 2000,  w: 100, h: 100,hasCollided: false, c: "50%"},
  {name: "block", x: 800, y: 1600,  w: 100, h: 100},
  {name: "block", x:100, y: 2500, w: 100, h: 100},
  {name: "chance", x:100, y: 2250,  w: 200, h: 150, hasCollided: false,c: "80%"},//
  {name: "block", x: 100, y: 3500, w: 100, h: 100,},
  {name: "chance", x: 400, y: 8000, w: 100, h: 100, hasCollided: false, c: "10%"},
  {name: "block", x: 300, y: 2800, w: 100, h: 100,},
  {name: "block", x: -150, y: 2900, w: 100, h: 100,},
  {name: "chance", x: -100, y: 1800, w: 100, h: 100, hasCollided: false, c: "50%"},
  {name: "block", x: 0, y: 4550,  w: 100, h: 100,},
  {name: "block", x: 900, y: 3500, w: 100, h: 100,},
  {name: "chance", x: 500, y: 3100, w: 200, h: 150, hasCollided: false, c: "80%"},//
  {name: "block", x: 300, y: 5900, w: 100, h: 100,},
  {name: "chance", x: 400, y: 2300, w: 100, h: 100, hasCollided: false, c: "50%"},
  {name: "chance", x: -50, y: 2000,  w: 100, h: 100, hasCollided: false, c: "50%"},
  {name: "chance", x: 0, y: 2200,  w: 100, h: 100, hasCollided: false, c: "20%"},
  {name: "chance", x: 400, y: 1500, w: 100, h: 100, hasCollided: false, c: "5%"},
  {name: "chance", x: 500, y: 5000, w: 200, h: 150, hasCollided: false, c: "60%"},//
  {name: "chance", x: 500, y: 6000, w: 100, h: 100, hasCollided: false, c: "50%"},
  {name: "chance", x: 300, y: 1000, w: 200, h: 150, hasCollided: false, c: "60%"},//
  {name: "chance", x: 500, y: 5500, w: 100, h: 100, hasCollided: false, c: "15%"},
  {name: "chance", x: 550, y: 4000, w: 100, h: 100, hasCollided: false, c: "20%"},
  {name: "chance", x: 0, y:1750, w: 100, h: 100, hasCollided: false, c: "50%"},
  {name: "chance", x: 400, y: 3500, w: 100, h: 100, hasCollided: false, c: "5%"},
  {name: "chance", x: 450, y: 4700, w: 200, h: 150, hasCollided: false, c: "55%"},//
  {name: "chance", x: 450, y: 5200, w: 200, h: 150, hasCollided: false, c: "70%"},//
  {name: "chance", x: 300, y: 5750, w: 200, h: 150, hasCollided: false, c: "80%"},//
  {name: "chance", x: 500, y: 5900, w: 100, h: 100, hasCollided: false, c: "15%"},
  {name: "chance", x: 550, y: 4800, w: 100, h: 100, hasCollided: false, c: "20%"},
  {name: "chance", x: 0, y: 4150, w: 100, h: 100, hasCollided: false, c: "50%"},
  {name: "chance", x: 450, y: 5700, w: 200, h: 150, hasCollided: false, c: "55%"},//
  {name: "chance", x: 450, y: 5800, w: 200, h: 150, hasCollided: false, c: "70%"},//
  {name: "chance", x: 300, y: 4750, w: 200, h: 150, hasCollided: false, c: "80%"},//
  {name: "chance", x: 500, y: 3900, w: 100, h: 100, hasCollided: false, c: "15%"},
  {name: "chance", x: 550, y: 4800, w: 100, h: 100, hasCollided: false, c: "20%"},
  {name: "chance", x: 0, y: 2750, w: 100, h: 100, hasCollided: false, c: "50%"},
  {name: "block", x: 0, y: 4800,  w: 100, h: 100},
  {name: "block", x:500, y: 3250, w: 100, h: 100},
  {name: "block", x: 350, y: 3650,  w: 100, h: 100},
  {name: "block", x:300, y: 4000, w: 100, h: 100},
  {name: "block", x: 200, y: 5300,  w: 100, h: 100},
  {name: "block", x:100, y: 4250, w: 100, h: 100},



  {name: "chance", x: 100, y: 6000, w: 100, h: 100, hasCollided: false, c: "50%"},
  {name: "block", x: 400, y:6100, w: 100, h: 100},
  {name: "chance", x: 200, y: 6100, w: 200, h: 150, hasCollided: false, c: "80%"},//
  {name: "block", x: 250, y: 6300, w: 100, h: 100,},
  {name: "chance", x: -150, y: 6500,  w: 100, h: 100, hasCollided: false, c: "20%"},
  {name: "block", x:500, y: 6300,  w: 100, h: 100},
  {name: "chance", x:-150, y: 6700,  w: 100, h: 100, hasCollided: false, c: "50%"},
  //{name: "block", x:5, y: 1500, w: 100, h: 100},
  {name: "chance", x:100, y: 6600,  w: 100, h: 100,hasCollided: false, c: "50%"},
  {name: "block", x: 800, y: 6600,  w: 100, h: 100},
  {name: "block", x:100, y: 6800, w: 100, h: 100},
  {name: "chance", x:100, y: 6950,  w: 200, h: 150, hasCollided: false,c: "80%"},//
  {name: "block", x: 100, y: 7000, w: 100, h: 100,},
  {name: "chance", x: 400, y: 7200, w: 100, h: 100, hasCollided: false, c: "10%"},
  {name: "block", x: 300, y: 7000, w: 100, h: 100,},
  {name: "block", x: -150, y: 7300, w: 100, h: 100,},
  {name: "chance", x: -100, y: 7350, w: 100, h: 100, hasCollided: false, c: "50%"},
  {name: "block", x: 0, y: 7650,  w: 100, h: 100,},
  {name: "block", x: 900, y: 7500, w: 100, h: 100,},
  {name: "chance", x: 500, y: 6100, w: 200, h: 150, hasCollided: false, c: "80%"},//
  {name: "block", x: 300, y: 7700, w: 100, h: 100,},
  {name: "chance", x: 400, y: 7900, w: 100, h: 100, hasCollided: false, c: "50%"},
  {name: "chance", x: -50, y: 7700,  w: 100, h: 100, hasCollided: false, c: "50%"},
  {name: "chance", x: 0, y: 7500,  w: 100, h: 100, hasCollided: false, c: "20%"},
  {name: "chance", x: 400, y: 8100, w: 100, h: 100, hasCollided: false, c: "5%"},
  {name: "chance", x: 500, y: 8500, w: 200, h: 150, hasCollided: false, c: "60%"},//
  {name: "chance", x: 500, y: 9000, w: 100, h: 100, hasCollided: false, c: "50%"},
  {name: "chance", x: 300, y: 8700, w: 200, h: 150, hasCollided: false, c: "60%"},//
  {name: "chance", x: 500, y: 9300, w: 100, h: 100, hasCollided: false, c: "15%"},
  {name: "chance", x: 550, y: 9500, w: 100, h: 100, hasCollided: false, c: "20%"},
  {name: "chance", x: 0, y:9750, w: 100, h: 100, hasCollided: false, c: "50%"},
  {name: "chance", x: 400, y: 9300, w: 100, h: 100, hasCollided: false, c: "5%"},
  {name: "chance", x: 450, y: 10000, w: 200, h: 150, hasCollided: false, c: "55%"},//
  {name: "chance", x: 450, y: 10400, w: 200, h: 150, hasCollided: false, c: "70%"},//
  {name: "chance", x: 300, y: 10600, w: 200, h: 150, hasCollided: false, c: "80%"},//
  {name: "chance", x: 500, y: 11300, w: 100, h: 100, hasCollided: false, c: "15%"},
  {name: "chance", x: 550, y: 11000, w: 100, h: 100, hasCollided: false, c: "20%"},
  {name: "chance", x: 0, y: 11500, w: 100, h: 100, hasCollided: false, c: "50%"},
  {name: "chance", x: 450, y: 1800, w: 200, h: 150, hasCollided: false, c: "55%"},//
  {name: "chance", x: 450, y: 2600, w: 200, h: 150, hasCollided: false, c: "70%"},//
  {name: "chance", x: 300, y: 1600, w: 200, h: 150, hasCollided: false, c: "80%"},//
  {name: "chance", x: 500, y: 3000, w: 100, h: 100, hasCollided: false, c: "15%"},
  {name: "chance", x: 100, y: 9300, w: 100, h: 100, hasCollided: false, c: "5%"},
  {name: "chance", x: -150, y: 1000, w: 200, h: 150, hasCollided: false, c: "55%"},//
  {name: "chance", x: 550, y: 20400, w: 200, h: 150, hasCollided: false, c: "70%"},//
  {name: "chance", x: 100, y: 10600, w: 200, h: 150, hasCollided: false, c: "80%"},//
  {name: "chance", x: 300, y: 11300, w: 100, h: 100, hasCollided: false, c: "15%"},
  {name: "chance", x: 450, y: 11000, w: 100, h: 100, hasCollided: false, c: "20%"},
  {name: "chance", x: 0, y: 11500, w: 100, h: 100, hasCollided: false, c: "50%"},
  {name: "chance", x: 250, y: 11800, w: 200, h: 150, hasCollided: false, c: "55%"},//
  {name: "chance", x: 150, y: 11600, w: 200, h: 150, hasCollided: false, c: "70%"},//
  {name: "chance", x: 200, y: 11600, w: 200, h: 150, hasCollided: false, c: "80%"},//
  {name: "chance", x: 400, y: 12000, w: 100, h: 100, hasCollided: false, c: "15%"}
];

for (obstacle in obstacleCourse) {//can be changed
  obstacleCourse[obstacle].y-=obstacleRange;
}
function randInt(min, max){
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
let randomInt = randInt(0, 100);
//IMPORTANT (tdo to change tmr)
function drawBlock(x, y, w, h) {
  image(rock, x, y, w, h);
}
function drawChance(x, y, w, h, p) {
  if (parseInt(p)<50) {
    image(jelly, x, y, w, h);
  }else if (parseInt(p)==50) {
    image(fish, x, y, w, h);
  } else{
    image(coral, x, y, w, h);
  }
  rect(x, y, 40, 20);
  fill(0);
  textSize(small);
  text(p, x, y+15, w, h);
  fill(255);
}
function draw() {
  background(79,66,181);
  textSize(20);
  textFont(font);
  fill(255);

 if (gameState === "playing") {
    if (distanceCompleted >= 13000) {
      gameState = "end";
      finalTim = stopStopwatch(); // Store the final time
    }
  } else if (gameState === "died") {
    // Also, handle the 'died' state.
    // Ensure the stopwatch is only stopped once.
    if (isRunning) {
      finalTim = stopStopwatch();
    }
  }
  if (gameState == "start") {
    drawStartPage();
  } else if (gameState == "playing") {
    drawPlayPage();
   
  displayStopwatch(400, 20);
  } else if (gameState == "end") {
    drawEndPage();
  } else if (gameState == "died") {
    drawDiedPage();
  } else if (gameState == "how") {
    drawHowPage();
  } else if (gameState == "high") {
    drawHighScoresPage();
  }else if (gameState == "settings") {
    drawSettingsPage();
  }
   
  if (moveLeft) {
    if (playerHahaX<=canvasWidth/2-obstacleXRange) {
      if (player.x>0) {
        player.x-=playerSpeed;
        playerHahaX-=playerSpeed;
      }
    } else {
    left();
    }
  } else if (moveRight) {
    if (playerHahaX>=obstacleXRange-canvasWidth/2){
      if (player.x+player.w<canvasWidth) {
      player.x+=playerSpeed;
      playerHahaX+=playerSpeed;
      }
    } else {
    right();
      
    }
  }
  
}
// A new function to manage the state transitions
function updatePlayerState() {
  if (isInvisible && invisibility > 0) {
    playerState = "invisible";
  } else if (speedBoostOn && speedBoost > 0) {
    playerState = "speed";
  } else {
    // If no boost is active, the state depends on movement.
    if (moveLeft) {
      playerState = "left";
    } else if (moveRight) {
      playerState = "right";
    } else {
      playerState = "normal";
    }
  }
}

// Key functions
function keyPressed() {
  if (gameState === "playing") {
    moving = true;
    if (firstmoving) {
      startStopwatch();
      firstmoving = false;
    }
    if (keyCode === LEFT_ARROW || keyCode === 65) {
      moveLeft = true;
      moveRight = false;
      keylog += elapsedTime+",a";
    } else if (keyCode === RIGHT_ARROW || keyCode === 68) {
      moveRight = true;
      moveLeft = false;
      keylog += elapsedTime+",d";
    } else if (keyCode === 70 && speedBoost > 0) {
      speedBoostOn = true;
      isInvisible = false;
      keylog += elapsedTime+",f";
    } else if (keyCode === 73 && invisibility > 0) {
      isInvisible = true;
      speedBoostOn = false;
      
      keylog += elapsedTime+",i";
    }
  }
  updatePlayerState();
}


function keyReleased() {
  if (keyCode === LEFT_ARROW || keyCode === 65) {
    moveLeft = false;
  } else if (keyCode === RIGHT_ARROW || keyCode === 68) {
    moveRight = false;
  }
  keylog+=elapsedTime+",";
  updatePlayerState();
}
function drawStartPage() {
  background(5, 192, 222);
  textSize(60);
  fill(255)
  text("OCEAN", 150, 100);
  textSize(20);
  rect(startButtonX, startButtonY, startButtonWidth, startButtonHeight);
  rect(howButtonX, howButtonY, howButtonWidth, howButtonHeight);
  rect(highButtonX, highButtonY, highButtonWidth, highButtonHeight);
  //rect(settingsButtonX, settingsButtonY, settingsButtonWidth, settingsButtonHeight);
  fill(0)
  text("PLAY", startButtonX, startButtonY+diff, startButtonWidth, startButtonHeight);
  text("HOW", howButtonX, howButtonY+diff, howButtonWidth, howButtonHeight);
  text("LEADERBOARD", highButtonX, highButtonY+diff, highButtonWidth, highButtonHeight);
  //text("SETTINGS", settingsButtonX, settingsButtonY+diff, settingsButtonWidth, settingsButtonHeight);
  fill(255);
  image(fish, howButtonX, settingsButtonY, 100, 100);
}
function drawDiedPage() {
  background(5, 192, 222);
  textSize(40);
  text("GAME OVER", 100, 80, 400, 100);
textSize(small);
//text("Refresh the page to play again", 100, 150, 300, 100);
rect(playAgainButtonX, playAgainButtonY, playAgainButtonWidth, playAgainButtonHeight);
fill(0);
text("PLAY AGAIN", playAgainButtonX, playAgainButtonY+diff/2, playAgainButtonWidth, playAgainButtonHeight);
image(rock, playAgainButtonX, 200, 100, 100);
}
function mouseClicked() {
  if (gameState == "start") {
    if (mouseX >= startButtonX && mouseY >= startButtonY && mouseY <= startButtonY + startButtonHeight && mouseX <= startButtonX + startButtonWidth) {
      gameState = "playing";
      
    } else if (mouseX >= howButtonX && mouseY >= howButtonY && mouseY<=howButtonY + howButtonHeight && mouseX <= howButtonX + howButtonWidth) {
      gameState = "how";
    } else if (mouseX >= highButtonX && mouseY >= highButtonY && mouseY<=highButtonY + highButtonHeight && mouseX <= highButtonX + highButtonWidth) {
      gameState = "high";
    }
  }  else if (gameState == "how" || gameState == "high"/* || gameState == "settings"*/) {
    if (mouseX >= backButtonX && mouseY >= backButtonY && mouseY<=backButtonY + backButtonHeight && mouseX <= backButtonX + backButtonWidth) {
      gameState="start";
    }
    /*if (gameState == "settings") {
      if (mouseX >= gameModeButtonX && mouseY >= gameModeButtonY && mouseY<=gameModeButtonY + gameModeButtonHeight && mouseX <= gameModeButtonX + gameModeButtonWidth) {
      if(gameModeTimed) {
        gameModeTimed = false;
        gameModeButtonText="Game Mode: Endless";
      }else{
        gameModeTimed = true;
        gameModeButtonText="Game Mode: Timed";
      }
    }
    }*/
  } else if (gameState == "end" || gameState == "died") {
    if (gameState == "end") {
    if (mouseX >= submitNameButtonX && mouseY >= submitNameButtonY && mouseY<=submitNameButtonY + submitNameButtonHeight && mouseX <= submitNameButtonX + submitNameButtonWidth) {
      submitInputValue=nameInput.value();
    }
  }
    if (mouseX >= playAgainButtonX && mouseY >= playAgainButtonY && mouseY<=playAgainButtonY + playAgainButtonHeight && mouseX <= playAgainButtonX + playAgainButtonWidth) {
      window.location.reload();
    }
  }
}

function playerTouching(obj) {
    // Basic collision detection
    if (isInvisible && invisibility>0) {
      playerState="invisible";
      invisibility--;
      return false;
    }else{if (invisibility==0) {

      if (moveLeft) {
        playerState="left";
      } else if (moveRight) {
        playerState="right";
      }else{
      playerState="normal";}}
      const objw=obj.w-10
      const objx=obj.x+10
      const objy=obj.y+10
      const objh=obj.h-10
    if (!(player.x + player.w < objx || player.x > objx + objw || player.y + player.h < objy || player.y > objy + objh)) {
        // We have a collision, now handle the chance logic
        if (obj.name === "chance") {
            // This is the crucial part: Check if this is the first frame of collision
            if (!obj.hasCollided) {
                obj.hasCollided = true; // Lock in the collision
                const percentageInt = parseInt(obj.c);
                let randomChance = randInt(0, 100);

                // Determine and store the outcome of this single event
                if (randomChance > percentageInt) {
                    obj.isBlocked = false;
                } else {
                    
                    obj.isBlocked = true;
                    gameState = "died";
                }
            }
            // Return the stored outcome, not a new random one
            return obj.isBlocked;
        }
        if (obj.name=== "block") {
          if (!obj.hasCollided) {
            gameState = "died";
          }
        }
    } else {
        // If there's no collision, reset the flag for the next time
        if (obj.hasCollided) {
            obj.hasCollided = false;
        }
    }
  }
    // No collision at all, so the player is not stopped
    return false;
}

function drawPlayPage() {
  background(5, 192, 222);


  // Update the state for drawing/sound
  updatePlayerState();

  // Drawing and sound logic based on the updated state
  if (playerState === "normal") {
    music.speed(1);
    music.loop();
    image(boatNormal, player.x, player.y, player.w, player.h);
  } else if (playerState === "left") {
    music.speed(1);
    music.loop();
    image(boatLeft, player.x, player.y, player.w, player.h);
  } else if (playerState === "right") {
    music.speed(1);
    music.loop();
    image(boatRight, player.x, player.y, player.w, player.h);
  } else if (playerState === "invisible") {
    music.stop();
    image(playerInvisible, player.x, player.y, player.w, player.h);
  } else if (playerState === "speed") {
    music.speed(2);
    music.loop();
    image(playerSpeedBoost, player.x, player.y, player.w, player.h);
  }

  // Handle speed and invisibility boost durations
  if (speedBoostOn && speedBoost > 0) {
    speedBoost--;
  } else {
    speedBoostOn = false;
  }

  if (isInvisible && invisibility > 0) {
    invisibility--;
  } else {
    isInvisible = false;
  }
fill(255);
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
    if (obstacleMoving && moving) {
        for (let i = 0; i < obstacleCourse.length; i++) {
            let obstacle = obstacleCourse[i];
            if (speedBoostOn && speedBoost>0) {
              obstacle.y+=speedyBlockSpeed;
              playerState ="speed";
              speedBoost--;
            } else {
              if (speedBoost==0) {
                if (moveLeft) {
                  playerState="left";
                  //keylog += elapsedTime+",a";
                } else if (moveRight) {
                  playerState ="right";
                  //keylog += elapsedTime+",d";
                } else{
              playerState="normal";
              //keylog+=elapsedTime+","
                }
              }
            obstacle.y += blockSpeed;
            }
        }
        if(speedBoostOn&& speedBoost>0) {
          distanceCompleted += speedyBlockSpeed;
        }else{
        distanceCompleted += blockSpeed;
        }
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
function drawHowPage() {
  background(5, 192, 222)
  fill(255);
  textSize(20);
  text("INSTRUCTIONS:", 100, 50, 200, 50);
  textSize(small);
  text("Left/right arrow keys or A/D to move\n\nI key to turn invisible\n\nF key to speed boost\n\nYou can't be invisible and have speed boost at the same time\n\nThe percentage is the chance that each thing will kill you. Jellies have the lowest chance, followed by fish, and then coral. Rocks definitely kill you\n\n\n\nTry to reach the end with the fastest time", 100, 100, 400, 500);
  
  image(jelly, 100, 425, 40, 40);
 
  image(fish, 140, 425, 40, 40);
 

  image(coral, 180, 425, 40, 40);
 image(rock, 220, 425, 40, 40);
  
  fill(255);
  rect(backButtonX, backButtonY, backButtonWidth, backButtonHeight);

  fill(0);
textSize(20);
  text("BACK", backButtonX, backButtonY+diff, backButtonWidth, backButtonHeight);
  fill(255);
}
function drawSettingsPage() {
  background(5, 192, 222)
  fill(255);
  textSize(20);
  text("SETTINGS:", 100, 50, 200, 50);
  rect(backButtonX, backButtonY, backButtonWidth, backButtonHeight);
  rect(gameModeButtonX, gameModeButtonY, gameModeButtonWidth, gameModeButtonHeight);
  fill(0);
  textSize(small);
  text("BACK", backButtonX, backButtonY+diff, backButtonWidth, backButtonHeight);
  text(gameModeButtonText, gameModeButtonX, gameModeButtonY+diff, gameModeButtonWidth, gameModeButtonHeight);
  fill(255);

}
function drawEndPage() {
  background(5, 192, 222)
  textSize(40);
  text("GOOD JOB!", 100, 80, 500, 100);
  textSize(20);
  text('YOUR TIME:', 50, 200, 300, 100);
  textSize(small);
  //text(keylog, 50, 220, 300, 100);
   //text('Refresh the page to play again',150, 100, 300, 100);
   text("LEADERBOARD", 50, 300, 100, 40);
   rect(playAgainButtonX, playAgainButtonY, playAgainButtonWidth, playAgainButtonHeight);
   rect(submitNameButtonX, submitNameButtonY, submitNameButtonWidth, submitNameButtonHeight);
   fill(0);
   text("PLAY AGAIN", playAgainButtonX, playAgainButtonY+diff/2, playAgainButtonWidth, playAgainButtonHeight);
   text("SUBMIT SCORE", submitNameButtonX, submitNameButtonY+diff/2, submitNameButtonWidth, submitNameButtonHeight);
   fill(255);
  displayFormattedTime(elapsedTime, 250, 200);
  
  nameInput.show();
  if (submitInputValue!=""&&!submitted){
    submitScore(submitInputValue, elapsedTime);
    submitted = true;
    
}
if(submitted) {
  text("SCORE SUBMITTED", submitNameButtonX, submitNameButtonY + submitNameButtonHeight+20, 200, 50);
}
  if (!scoresLoaded) {
    getHighScores().then(scores => {
    highScores = scores;
    scoresLoaded = true;
  }).catch(error => {
    console.error("FAILED TO FETCH SCORES", error);
  });
  }else{
        let yPos = 350;
        highScores.forEach((scoreData, index) => {
            text(`${index + 1}. ${scoreData.name}: ${formatTime(scoreData.score)}`, 50, yPos);
            yPos += 20;
        });
      }
        
}
function drawHighScoresPage() {
  background(5, 192, 222)
  textSize(20);
  rect(backButtonX, backButtonY, backButtonWidth, backButtonHeight);
  text("HIGH SCORES:", 100, 20, 300, 50);
  textSize(small);
  if (!scoresLoaded) {
    getHighScores().then(scores => {
    highScores = scores;
    scoresLoaded = true;
  }).catch(error => {
    console.error("FAILED TO FETCH SCORES", error);
  });
  }else{
        let yPos = 100;
        highScores.forEach((scoreData, index) => {
            text(`${index + 1}. ${scoreData.name}: ${formatTime(scoreData.score)}`, 100, yPos);
            yPos += 20;
        });
      }
      fill(0);
      text("BACK", backButtonX, backButtonY+diff, backButtonWidth, backButtonHeight)
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
/**
 * Starts the stopwatch. Call this when the game begins.
 */
function startStopwatch() {
  isRunning = true;
  startTime = millis();
}

/**
 * Stops the stopwatch. Call this when the game ends.
 * It also returns the final time in milliseconds.
 * @returns {number} The final elapsed time in milliseconds.
 */
function stopStopwatch() {
  isRunning = false;
  return elapsedTime;
}

/**
 * Updates the high score if the given time is lower.
 * Call this after the game ends.
 * @param {number} finalTime The final elapsed time in milliseconds.
 */
function updateHighScore(finalTime) {
  if (finalTime < highScore) {
    highScore = finalTime;
    console.log("New high score:", finalTime);
  }
}

/**
 * Gets the current elapsed time in milliseconds.
 * @returns {number} The current elapsed time in milliseconds.
 */
function getElapsedTime() {
  if (isRunning) {
    elapsedTime = millis() - startTime; // This is the change
  }
  return elapsedTime;
}

/**
 * Gets the current high score in milliseconds.
 * @returns {number} The current high score.
 */
function getHighScore() {
  return highScore;
}

// --- Display Functions ---

/**
 * Displays the current stopwatch time on the screen.
 * This should be called in your draw() loop.
 * @param {number} x The x-coordinate for the display.
 * @param {number} y The y-coordinate for the display.
 */
function displayStopwatch(x, y) {
  let timeToDisplay = getElapsedTime();
  displayFormattedTime(timeToDisplay, x, y);
}

/**
 * Displays the high score on the screen.
 * @param {number} x The x-coordinate for the display.
 * @param {number} y The y-coordinate for the display.
 */
function displayHighScore(x, y) {
  if (highScore !== Infinity) {
    displayFormattedTime(highScore, x, y);
  }
}

// --- Internal Helper Function ---
function formatTime(timeInMilliseconds) {
  let minutes = floor(timeInMilliseconds / 60000);
  let seconds = floor((timeInMilliseconds % 60000) / 1000);
  let milliseconds = timeInMilliseconds % 1000;
  
  // Format with leading zeros using nf()
  let formattedMinutes = nf(minutes, 2);
  let formattedSeconds = nf(seconds, 2);
  let formattedMilliseconds = nf(milliseconds, 3);
  
  let timeString = formattedMinutes + ':' + formattedSeconds + ':' + formattedMilliseconds;
  
  // Use p5.js text() function to draw the string
  return timeString;
}
function displayFormattedTime(timeInMilliseconds, x, y) {
   let minutes = floor(timeInMilliseconds / 60000);
  let seconds = floor((timeInMilliseconds % 60000) / 1000);
  let milliseconds = timeInMilliseconds % 1000;
  
  // Format with leading zeros using nf()
  let formattedMinutes = nf(minutes, 2);
  let formattedSeconds = nf(seconds, 2);
  let formattedMilliseconds = nf(milliseconds, 3);
  
  let timeString = formattedMinutes + ':' + formattedSeconds + ':' + formattedMilliseconds;
  textSize(20);
  // Use p5.js text() function to draw the string
  text(timeString, x, y);
  textSize(small);
}
function reset() {
   playerX = originalX;
   playerHahaX=0;
   moveLeft = false;
   moveRight = false;
   isInvisible = false;
   distanceCompleted = 0;
   obstacleMoving = true;
   elapsedTime = 0;
   obstacleCourse = originalObstacleCourse;
}
function submitScore(playerName, score) {
  db.collection("high_scores").add({
    name: playerName,
    score: score,
    timestamp: firebase.firestore.FieldValue.serverTimestamp()
  })
  .then((docRef) => {
    console.log("Score written with ID: ", docRef.id);
  })
  .catch((error) => {
    console.error("Error adding document: ", error);
  });
}
async function getHighScores() {
  const highScores = [];
  const snapshot = await db.collection("high_scores")
    .orderBy("score", "asc")
    .limit(10)
    .get();

  snapshot.forEach((doc) => {
    highScores.push(doc.data());
  });
  return highScores;
}