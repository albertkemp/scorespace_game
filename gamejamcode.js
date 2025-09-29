/*
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


//Defining global variables - x, y, speed. OriginalX is for teleporting it back to the start
let playerHahaX = 0;
let finalTim = 0; // Add this to your global variables section.

let playerX=300;
let coins = 5;
const originalX = playerX;
const playerY = 400;
let playerSpeed = 5;
let isInvisible = false;
let invisibility = 3600;
let speedBoost = 400;
let speedBoostOn = false;

let bullets = 10;
var gameState = "start";
let playerState = "normal";
var canvasWidth = 600;
var canvasHeight = 600;
const obstacleRange = 3000;
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

const howButtonX = 250;
const howButtonY = 300;
const howButtonWidth = 100;
const howButtonHeight = 50;

const backButtonX = 400;
const backButtonY = 50;
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

const submitNameButtonX = 290;
const submitNameButtonY = 330;
const submitNameButtonWidth = 100;
const submitNameButtonHeight = 50;

const playAgainButtonX = 200;
const playAgainButtonY = 100;
const playAgainButtonWidth = 150;
const playAgainButtonHeight = 50;


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
}
function setup() {
  createCanvas(canvasWidth, canvasHeight);
  nameInput = createInput('Enter your name');
  nameInput.position(300, 300);
  nameInput.hide(); // Hide it until the game is over
  db  = firebase.firestore();
  
}
let obstacleCourse = [
  {name: "chance", x: 100, y: 100, w: 100, h: 100, hasCollided: false, c: "50%"},
  {name: "block", x: 400, y:300, w: 100, h: 100},
  {name: "chance", x: 200, y: 500, w: 100, h: 100, hasCollided: false, c: "80%"},
  {name: "block", x: 250, y: 700, w: 100, h: 100,},
  {name: "chance", x: -150, y: 800,  w: 100, h: 100, hasCollided: false, c: "20%"},
  {name: "block", x:500, y: 1100,  w: 100, h: 100},
  {name: "chance", x:-150, y: 1300,  w: 100, h: 100, hasCollided: false, c: "50%"},
  {name: "block", x:5, y: 1500, w: 100, h: 100},
  {name: "chance", x:100, y: 1700,  w: 100, h: 100,hasCollided: false, c: "50%"},
  {name: "block", x: 800, y: 1800,  w: 100, h: 100},
  {name: "block", x:100, y: 250, w: 100, h: 100},
  {name: "chance", x:100, y: 1500,  w: 100, h: 100, hasCollided: false,c: "80%"},
  {name: "block", x: 100, y: 500, w: 100, h: 100,},
  {name: "chance", x: 400, y: 1000, w: 100, h: 100, hasCollided: false, c: "10%"},
  {name: "block", x: 300, y: 800, w: 100, h: 100,},
  {name: "block", x: -150, y: 2100, w: 100, h: 100,},
  {name: "chance", x: -100, y: 2300, w: 100, h: 100, hasCollided: false, c: "50%"},
  {name: "block", x: 0, y: 2350,  w: 100, h: 100,},
  {name: "block", x: 900, y: 2500, w: 100, h: 100,},
  {name: "chance", x: 500, y: 2700, w: 100, h: 100, hasCollided: false, c: "80%"},
  {name: "block", x: 300, y: 2900, w: 100, h: 100,},
  {name: "chance", x: 400, y: 2300, w: 100, h: 100, hasCollided: false, c: "50%"},
  {name: "chance", x: -50, y: 2000,  w: 100, h: 100, hasCollided: false, c: "50%"},
  {name: "chance", x: 0, y: 200,  w: 100, h: 100, hasCollided: false, c: "20%"},
  {name: "chance", x: 400, y: 1500, w: 100, h: 100, hasCollided: false, c: "5%"},
  {name: "chance", x: 500, y: 5000, w: 100, h: 100, hasCollided: false, c: "50%"}
];

for (obstacle in obstacleCourse) {//can be changed
  obstacleCourse[obstacle].y-=obstacleRange;
}
function randInt(min, max){
  return Math.floor(Math.random() * (max - min + 1)) + min;
}/*
for (i=0;i<obstacleNumber;i++) {
  obstacleCourse.push({
    name: "chance",
    x: randInt(0, obstacleXRange),
    y: randInt(-obstacleRange, 0),
    w: randInt(0, blockRange),
    h: randInt(0, blockRange),
    hasCollided: false,
    c: str(randInt(0, 100))+"%"
  });
}*/
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
  textSize(20);
  text(p, x, y, w, h);
  fill(255);
}
function draw() {
  background(79,66,181);
  textSize(20);
  fill(255);
// text("Distance covered"+distanceCompleted, 200, 20, 200, 100);
 /* for (i=0; i<10; i++) {
    for (j=0; j<canvasWidth/10; j++) {
      if ((j/2).isInteger()) {
      fill(255);
      }else{
        fill(0);
      }
      rect(j*10, i*10, 10, 10);
    }
  }*/
 if (gameState === "playing") {
    if (distanceCompleted >= 3500) {
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
  }
   
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
  }/*
  if (distanceCompleted>=7000) {
    gameState= "end";
    
  }*/
  
}
function keyPressed() {
  if (gameState === "playing") {
  if (keyCode === LEFT_ARROW || keyCode === 65) {
    playerState = "left";
    moveLeft = true;
    moveRight = false;
  } else if (keyCode === RIGHT_ARROW || keyCode === 68) {
    playerState = "right";
    moveRight = true;
    moveLeft = false;
  } else if (keyCode === 70 && speedBoost>0) {
    playerState = "speed";
    speedBoostOn = true;
    isInvisible = false;
  } else if (keyCode === 73 && invisibility>0) {
    playerState = "invisible"
    isInvisible=true;
    speedBoostOn=false;
  }
  //We can add more key stuff here, like fire missile, invisible, etc.
}
}
function keyReleased() {
  if (keyCode === LEFT_ARROW || keyCode === 65) {
   if (playerState != "invisible" && playerState != "speed") {
moveLeft = false;
    playerState = "normal";
   }else{
    moveLeft = false;
   }
    
  } else if (keyCode === RIGHT_ARROW || keyCode === 68) {
    if (playerState != "invisible" && playerState != "speed") {
    moveRight = false;
    playerState = "normal";
  } else{
    moveRight = false;
  }
  
}
}
function drawStartPage() {
  background(5, 192, 222);
  textSize(60);
  fill(255)
  text("Blah", 200, 100);
  textSize(20);
  rect(startButtonX, startButtonY, startButtonWidth, startButtonHeight);
  rect(howButtonX, howButtonY, howButtonWidth, howButtonHeight);
  fill(0)
  text("PLAY", startButtonX, startButtonY, startButtonWidth, startButtonHeight);
  text("HOW", howButtonX, howButtonY, howButtonWidth, howButtonHeight)
  fill(255);
}
function drawDiedPage() {
  background(5, 192, 222);
  textSize(60);
  text("GAME OVER", 100, 20, 400, 100);
textSize(20);
//text("Refresh the page to play again", 100, 150, 300, 100);
rect(playAgainButtonX, playAgainButtonY, playAgainButtonWidth, playAgainButtonHeight);
fill(0);
text("PLAY AGAIN", playAgainButtonX, playAgainButtonY, playAgainButtonWidth, playAgainButtonHeight);
}
function mouseClicked() {
  if (gameState == "start") {
    if (mouseX >= startButtonX && mouseY >= startButtonY && mouseY <= startButtonY + startButtonHeight && mouseX <= startButtonX + startButtonWidth) {
      gameState = "playing";
      startStopwatch();
    } else if (mouseX >= howButtonX && mouseY >= howButtonY && mouseY<=howButtonY + howButtonHeight && mouseX <= howButtonX + howButtonWidth) {
      gameState = "how";
    }
  }  else if (gameState == "how") {
    if (mouseX >= backButtonX && mouseY >= backButtonY && mouseY<=backButtonY + backButtonHeight && mouseX <= backButtonX + backButtonWidth) {
      gameState="start";
    }
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
  if (playerState == "normal") {
    image(boatNormal, player.x, player.y, player.w, player.h);
  } else if (playerState == "left") {
    image(boatLeft, player.x, player.y, player.w, player.h);
  } else if (playerState == "right") {
    image(boatRight, player.x, player.y, player.w, player.h);
  } else if (playerState == "invisible") {
    image(playerInvisible, player.x, player.y, player.w, player.h);
  } else if (playerState == "speed") {
    image(playerSpeedBoost, player.x, player.y, player.w, player.h);
  }
    textSize(20);/*
  if (isInvisible && invisibility>0) {
    fill(0, 255, 0);
   text("Invisibility: On", 10, 10, 200, 100);
   fill(255);
  }else{
    text("Invisibility: Off", 10, 10, 200, 100);
  }
  if (speedBoostOn && speedBoost >0) {
    fill(0, 255, 0);
    text("Speed boost: On", 10, 50, 200, 100);
    fill(255);
  } else{
    text("Speed boost: Off", 10, 50, 200, 100);
  }*/
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
    if (obstacleMoving) {
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
                } else if (moveRight) {
                  playerState ="right";
                } else{
              playerState="normal";
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
  text("Left/right arrow keys/AD to move\n\nI key to turn invisible\n\nF key to speed boost\n\nThe percentage is the chance that each thing will kill you. Jellies have the lowest chance, followed by fish, and then coral. Rocks definitely kill you\n\n\n\nTry to reach the end with the fastest time\nYou can't be invisible and have speed boost at the same time\nTo submit your score to the leaderboard, type your name in the box and hit submit", 100, 100, 400, 500);
  
  image(jelly, 100, 350, 40, 40);
 
  image(fish, 140, 350, 40, 40);
 

  image(coral, 180, 350, 40, 40);
 image(rock, 220, 350, 40, 40);
  
  fill(255);
  rect(backButtonX, backButtonY, backButtonWidth, backButtonHeight);

  fill(0);

  text("BACK", backButtonX, backButtonY, backButtonWidth, backButtonHeight);
  fill(255);
}
function drawEndPage() {
  background(5, 192, 222)
  textSize(60);
  text("GOOD JOB!", 150, 20, 500, 100);
  textSize(30);
  text('YOUR TIME:', 50, 200, 300, 50);
  textSize(20);
   //text('Refresh the page to play again',150, 100, 300, 100);
   text("LEADERBOARD", 50, 300, 100, 40);
   rect(playAgainButtonX, playAgainButtonY, playAgainButtonWidth, playAgainButtonHeight);
   rect(submitNameButtonX, submitNameButtonY, submitNameButtonWidth, submitNameButtonHeight);
   fill(0);
   textSize(20);
   text("PLAY AGAIN", playAgainButtonX, playAgainButtonY, playAgainButtonWidth, playAgainButtonHeight);
   text("SUBMIT SCORE", submitNameButtonX, submitNameButtonY, submitNameButtonWidth, submitNameButtonHeight);
   fill(255);
  displayFormattedTime(elapsedTime, 230, 220);
  
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
            text(`${index + 1}. ${scoreData.name}: ${scoreData.score}`, 50, yPos);
            yPos += 20;
        });
      }
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
  textSize(30);
  // Use p5.js text() function to draw the string
  text(timeString, x, y);
  textSize(20);
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