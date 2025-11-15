 // --- Game Globals ---
        let playerHahaX = 0;
        let playerX = 300;
        let coins = 5;
        const originalX = playerX;
        const playerY = 400;
        let playerSpeed = 5;
        let isInvisible = false;
        let bullets = 10;
        var gameState = "loading"; // Initial state is loading data
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
        let blockSpeed = 3;

        // --- Stopwatch & Score Globals ---
        let startTime = 0;
        let finalScore = 0; // Stores the score upon game over
        let isRunning = false;
        let hasFinished = false; // New flag: True when the game state first changes to end/died
        let currentHighScore = Infinity; // Stores the retrieved high score
        let highScorerId = "Nobody";

        let player = {
            x: playerX,
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

        let obstacleCourse = [
            { name: "chance", x: 100, y: 100, w: 200, h: 50, hasCollided: false, c: "40%" },
            { name: "chance", x: 600, y: 300, w: 20, h: 20, hasCollided: false, c: "50%" },
            { name: "chance", x: 200, y: 500, w: 220, h: 50, hasCollided: false, c: "30%" },
            { name: "chance", x: 400, y: 700, w: 400, h: 80, hasCollided: false, c: "60%" },
            { name: "chance", x: 100, y: 900, w: 400, h: 50, hasCollided: false, c: "20%" },
            { name: "chance", x: 500, y: 1100, w: 300, h: 80, hasCollided: false, c: "5%" },
            { name: "chance", x: 0, y: 1300, w: 200, h: 25, hasCollided: false, c: "80%" },
            { name: "chance", x: 5, y: 1500, w: 150, h: 50, hasCollided: false, c: "5%" },
            { name: "chance", x: 100, y: 1700, w: 150, h: 40, hasCollided: false, c: "20%" },
            { name: "chance", x: 800, y: 1800, w: 60, h: 20, hasCollided: false, c: "60%" },
            { name: "block", x: 200, y: 400, w: 20, h: 50 }
        ];

        for (let obstacle in obstacleCourse) {
            obstacleCourse[obstacle].y -= obstacleRange;
        }

        // --- Firebase Functions ---

        async function initFirebase() {
            try {
                const app = initializeApp(firebaseConfig);
                auth = getAuth(app);
                db = getFirestore(app);

                onAuthStateChanged(auth, async (user) => {
                    if (user) {
                        userId = user.uid;
                        console.log("User authenticated:", userId);
                        isAuthReady = true;
                        loadHighScore();
                        gameState = "start"; // Ready to start game
                    } else {
                        // Sign in anonymously if no token is available or if user logs out
                        if (initialAuthToken) {
                            await signInWithCustomToken(auth, initialAuthToken);
                        } else {
                            await signInAnonymously(auth);
                        }
                    }
                });
            } catch (error) {
                console.error("Firebase initialization or auth error:", error);
                // Fallback to start if Firebase fails (no high scores)
                isAuthReady = true;
                gameState = "start"; 
            }
        }

        function loadHighScore() {
            if (!db || !isAuthReady) return;

            // Listen to the public high score document for real-time updates
            const docRef = doc(db, 'artifacts', appId, 'public', 'data', 'highscores', 'best');

            onSnapshot(docRef, (docSnap) => {
                if (docSnap.exists()) {
                    const data = docSnap.data();
                    currentHighScore = data.time || Infinity;
                    highScorerId = data.userId || "Unknown User";
                    console.log("High Score Loaded/Updated:", currentHighScore);
                } else {
                    currentHighScore = Infinity;
                    highScorerId = "Nobody";
                    console.log("No high score record found.");
                }
            }, (error) => {
                console.error("Error fetching high score:", error);
            });
        }

        async function saveHighScore(time) {
            if (!db || !userId) {
                console.error("Database not ready or user not logged in.");
                return;
            }

            // Check if the new time is actually better (lower)
            if (time < currentHighScore) {
                console.log(`New High Score achieved: ${time}. Saving...`);

                const docRef = doc(db, 'artifacts', appId, 'public', 'data', 'highscores', 'best');
                
                // Firestore transaction to ensure atomic update is safer, but for simplicity, we use setDoc
                try {
                    await setDoc(docRef, {
                        time: time,
                        userId: userId,
                        timestamp: Date.now()
                    });
                    console.log("High score saved successfully.");
                } catch (e) {
                    console.error("Error saving high score:", e);
                }
            } else {
                console.log(`Score (${time}) was not better than current high score (${currentHighScore}).`);
            }
        }
        
        // --- P5.js Setup and Game Logic ---

        function setup() {
            const canvas = createCanvas(canvasWidth, canvasHeight);
            canvas.parent('game-container'); // Attach canvas to the container div
            textAlign(CENTER, CENTER);
            textSize(20);
            fill(255);
            
            // Initialize Firebase and start loading data
            initFirebase(); 
        }

        function draw() {
            background(50);
            textSize(20);
            fill(255);

            text(`Distance: ${distanceCompleted}`, 20, 20, 200, 100);
            
            if (gameState == "loading") {
                textSize(30);
                text("Loading...", canvasWidth / 2, canvasHeight / 2);
            } else if (gameState == "start") {
                drawStartPage();
            } else if (gameState == "playing") {
                // Continuously update the running time
                finalScore = getElapsedTime();
                drawPlayPage();
                // Display the current time
                displayStopwatch(400, 20);
            } else if (gameState == "end") {
                runEndGameLogic(finalScore);
                drawEndPage();
            } else if (gameState == "died") {
                runEndGameLogic(finalScore);
                drawDiedPage();
            }

            // Draw player in all states except loading
            if (gameState !== "loading") {
                 fill(255);
                 stroke(255, 0, 0);noFill();rect(player.x, player.y, player.w, player.h);
            }
           
            // Movement logic
            if (gameState === "playing") {
                if (moveLeft) {
                    if (playerHahaX <= canvasWidth / 2 - obstacleXRange) {
                        if (player.x > 0) {
                            player.x -= playerSpeed;
                        }
                    } else {
                        left();
                    }
                } else if (moveRight) {
                    if (playerHahaX >= obstacleXRange - canvasWidth / 2) {
                        if (player.x + player.w < canvasWidth) {
                            player.x += playerSpeed;
                        }
                    } else {
                        right();
                    }
                }
                
                // Check win condition
                if (distanceCompleted >= 2500) {
                    gameState = "end";
                }
            }
        }

        // --- Game State Transitions ---

        function runEndGameLogic(time) {
            // This ensures stopStopwatch and high score logic run ONLY ONCE
            if (!hasFinished) {
                stopStopwatch();
                saveHighScore(time);
                hasFinished = true;
            }
        }

        function mouseClicked() {
            if (gameState == "start") {
                if (mouseX >= startButtonX && mouseY >= startButtonY && mouseY <= startButtonY + startButtonHeight && mouseX <= startButtonX + startButtonWidth) {
                    gameState = "playing";
                    startStopwatch();
                    hasFinished = false; // Reset flag for new game
                }
            } 
        }

        // --- Stopwatch Functions (Revised) ---

        /**
         * Starts the stopwatch. Call this when the game begins.
         */
        function startStopwatch() {
            isRunning = true;
            startTime = millis();
            finalScore = 0; // Reset final score for the new game
        }

        /**
         * Stops the stopwatch and captures the final time.
         */
        function stopStopwatch() {
            // IMPORTANT: finalScore has already been updated in the draw loop,
            // so we just need to stop the running flag.
            isRunning = false;
        }

        /**
         * Gets the current elapsed time in milliseconds.
         * @returns {number} The current elapsed time in milliseconds.
         */
        function getElapsedTime() {
            if (isRunning) {
                // While running, return the calculated time
                return millis() - startTime;
            }
            // When stopped, return the last captured finalScore
            return finalScore;
        }

        // --- Helper and Drawing Functions ---

        function randInt(min, max) {
            return Math.floor(Math.random() * (max - min + 1)) + min;
        }

        function drawBlock(x, y, w, h) {
            fill(255, 0, 0); // Red for blocks
            rect(x, y, w, h);
            fill(255);
        }

        function drawChance(x, y, w, h, p) {
            fill(0, 255, 0); // Green for chance blocks
            rect(x, y, w, h);
            fill(0);
            text(p, x, y, w, h);
            fill(255);
        }

        function drawStartPage() {
            background(50);
            textSize(60);
            fill(255);
            text("BLAH Runner", canvasWidth / 2, 100);
            textSize(20);
            
            // Draw Start Button
            rect(startButtonX, startButtonY, startButtonWidth, startButtonHeight);
            fill(0);
            text("PLAY", startButtonX, startButtonY, startButtonWidth, startButtonHeight);
            
            // Display High Score
            fill(255);
            textSize(24);
            text("Current High Score:", canvasWidth / 2, 350);
            if (currentHighScore !== Infinity) {
                 displayFormattedTime(currentHighScore, canvasWidth / 2, 380);
                 textSize(16);
                 text(`Set by User ID: ${highScorerId.substring(0, 8)}...`, canvasWidth / 2, 410);
            } else {
                 textSize(20);
                 text("No score yet!", canvasWidth / 2, 380);
            }
        }

        function drawDiedPage() {
            background(50, 0, 0); // Dark Red background
            textSize(40);
            text("YOU DIED", canvasWidth / 2, 100);
            textSize(24);
            text("Your Time:", canvasWidth / 2, 200);
            displayFormattedTime(finalScore, canvasWidth / 2, 230);
            
            // Display High Score for comparison
            if (finalScore < currentHighScore) {
                fill(0, 255, 0);
                text("NEW HIGH SCORE!", canvasWidth / 2, 300);
            } else {
                fill(255);
                text("Best Time:", canvasWidth / 2, 300);
                displayFormattedTime(currentHighScore, canvasWidth / 2, 330);
            }
            
            // Display User ID
            textSize(12);
            text(`Your User ID: ${userId}`, canvasWidth / 2, canvasHeight - 30);
        }

        function drawEndPage() {
            background(0, 50, 0); // Dark Green background
            textSize(40);
            text("VICTORY!", canvasWidth / 2, 100);
            textSize(24);
            text("Final Time:", canvasWidth / 2, 200);
            displayFormattedTime(finalScore, canvasWidth / 2, 230);

             // Display High Score for comparison
            if (finalScore < currentHighScore) {
                fill(0, 255, 0);
                text("NEW HIGH SCORE!", canvasWidth / 2, 300);
            } else {
                fill(255);
                text("Best Time:", canvasWidth / 2, 300);
                displayFormattedTime(currentHighScore, canvasWidth / 2, 330);
            }
            
            // Display User ID
            textSize(12);
            text(`Your User ID: ${userId}`, canvasWidth / 2, canvasHeight - 30);
        }

        function playerTouching(obj) {
            // Basic collision detection
            if (!(player.x + player.w < obj.x || player.x > obj.x + obj.w || player.y + player.h < obj.y || player.y > obj.y + obj.h)) {
                
                if (obj.name === "chance") {
                    if (!obj.hasCollided) {
                        obj.hasCollided = true;
                        const percentageInt = parseInt(obj.c);
                        let randomChance = randInt(0, 100);
                        obj.isBlocked = randomChance > percentageInt;
                    }
                    return obj.isBlocked;
                }
                
                if (obj.name === "block") {
                    // Collision with a permanent block ends the game immediately
                    gameState = "died";
                    // The runEndGameLogic in draw will handle stopStopwatch and saveHighScore
                    return true;
                }
            } else {
                // Reset flag when no longer touching
                if (obj.hasCollided) {
                    obj.hasCollided = false;
                }
            }
            return false;
        }

        function drawPlayPage() {
            obstacleMoving = true;

            for (let i = 0; i < obstacleCourse.length; i++) {
                let obstacle = obstacleCourse[i];
                if (playerTouching(obstacle)) {
                    // Check if the game has ended due to a "block" collision
                    if (gameState === "died") {
                       return; // Exit drawPlayPage early to let draw() switch states
                    }
                    
                    // If blocked by a chance obstacle, stop movement
                    obstacleMoving = false;
                    break;
                }
            }

            // Move obstacles only if the player is not blocked
            if (obstacleMoving) {
                for (let i = 0; i < obstacleCourse.length; i++) {
                    obstacleCourse[i].y += blockSpeed;
                }
                distanceCompleted += blockSpeed;
            }

            // Draw obstacles
            for (let i = 0; i < obstacleCourse.length; i++) {
                let obstacle = obstacleCourse[i];
                if (obstacle.name === "block") {
                    drawBlock(obstacle.x, obstacle.y, obstacle.w, obstacle.h);
                } else if (obstacle.name === "chance") {
                    drawChance(obstacle.x, obstacle.y, obstacle.w, obstacle.h, obstacle.c);
                }
            }
        }

        function left() {
            for (let obstacle of obstacleCourse) {
                obstacle.x += playerSpeed;
            }
            playerHahaX -= playerSpeed;
        }

        function right() {
            for (let obstacle of obstacleCourse) {
                obstacle.x -= playerSpeed;
            }
            playerHahaX += playerSpeed;
        }

        function keyPressed() {
            if (keyCode === LEFT_ARROW || keyCode === 65) {
                moveLeft = true;
                moveRight = false;
            } else if (keyCode === RIGHT_ARROW || keyCode === 68) {
                moveRight = true;
                moveLeft = false;
            }
        }

        function keyReleased() {
            if (keyCode === LEFT_ARROW || keyCode === 65) {
                moveLeft = false;
            } else if (keyCode === RIGHT_ARROW || keyCode === 68) {
                moveRight = false;
            }
        }

        // --- Stopwatch Display Function ---
        function displayStopwatch(x, y) {
            let timeToDisplay = getElapsedTime();
            displayFormattedTime(timeToDisplay, x, y);
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

            // Ensure fill is white before drawing time
            fill(255);
            text(timeString, x, y);
        }