/**
 * Processes the raw levels data to:
 * 1. Remove exact duplicates within each level.
 * 2. Double the remaining unique obstacles (cloning and applying an X offset).
 * 3. Sort all obstacles within each level by their 'y' coordinate.
 */

// Original levels data provided by the user
const rawLevels = [
    [
        {name: "chance", x: 100, y: 100, w: 100, h: 100, hasCollided: false, c: "50%"},
        {name: "block", x: 400, y:1300, w: 100, h: 100},
        {name: "chance", x: 200, y: 500, w: 200, h: 150, hasCollided: false, c: "80%"},//
        {name: "block", x: 250, y: 4700, w: 100, h: 100,},
        {name: "chance", x: -150, y: 1000,  w: 100, h: 100, hasCollided: false, c: "20%"},
        {name: "block", x:500, y: 1500,  w: 100, h: 100},
        {name: "chance", x:-150, y: 1200,  w: 100, h: 100, hasCollided: false, c: "50%"},
        //{name: "block", x:5, y: 1500, w: 100, h: 100},
        {name: "chance", x:100, y: 2000,  w: 100, h: 100,hasCollided: false, c: "50%"},
        {name: "block", x: 800, y: 1600,  w: 100, h: 100},
        {name: "block", x:100, y: 2500, w: 100, h: 100},
        {name: "chance", x:100, y: 2250,  w: 200, h: 150, hasCollided: false,c: "80%"},//
        {name: "block", x: -150, y: 2900, w: 100, h: 100,},
        {name: "chance", x: -100, y: 1800, w: 100, h: 100, hasCollided: false, c: "50%"},
        {name: "block", x: 0, y: 4550,  w: 100, h: 100,},
        {name: "block", x: 900, y: 3500, w: 100, h: 100,},
        {name: "chance", x: 500, y: 3100, w: 200, h: 150, hasCollided: false, c: "20%"},
        {name: "block", x: 100, y: 3500, w: 100, h: 100,},
        {name: "chance", x: 200, y: 500, w: 200, h: 150, hasCollided: false, c: "80%"},//
        {name: "block", x: 250, y: 4700, w: 100, h: 100,},
        {name: "chance", x: -150, y: 1000,  w: 100, h: 100, hasCollided: false, c: "20%"},
        {name: "block", x:500, y: 1500,  w: 100, h: 100},
        {name: "chance", x: 400, y: 8000, w: 100, h: 100, hasCollided: false, c: "10%"},
    ],
    [
        {name: "block", x: 300, y: 2800, w: 100, h: 100,},
        {name: "block", x: -150, y: 2900, w: 100, h: 100,},
        {name: "chance", x: -100, y: 1800, w: 100, h: 100, hasCollided: false, c: "50%"},
        {name: "block", x: 0, y: 4550,  w: 100, h: 100,},
        {name: "block", x: 900, y: 3500, w: 100, h: 100,},
        {name: "chance", x: 500, y: 3100, w: 200, h: 150, hasCollided: false, c: "80%"},//
        {name: "block", x: 300, y: 5900, w: 100, h: 100,},
        {name: "chance", x: 400, y: 2300, w: 100, h: 100, hasCollided: false, c: "50%"},
        {name: "chance", x: -50, y: 2000,  w: 100, h: 100, hasCollided: false, c: "50%"},
        {name: "chance", x: 0, y: 2200,  w: 100, h: 100, hasCollided: false, c: "20%"},
        {name: "chance", x: 400, y: 1500, w: 100, h: 100, hasCollided: false, c: "5%"},
        {name: "chance", x: 500, y: 5000, w: 200, h: 150, hasCollided: false, c: "60%"},//
        {name: "chance", x: 500, y: 6000, w: 100, h: 100, hasCollided: false, c: "50%"},
        {name: "chance", x: 300, y: 1000, w: 200, h: 150, hasCollided: false, c: "60%"},//
        {name: "chance", x: 500, y: 5500, w: 100, h: 100, hasCollided: false, c: "15%"},
        {name: "chance", x:100, y: 2000,  w: 100, h: 100,hasCollided: false, c: "50%"},
        {name: "block", x: 800, y: 1600,  w: 100, h: 100},
        {name: "block", x:100, y: 2500, w: 100, h: 100},
        {name: "chance", x:100, y: 2250,  w: 200, h: 150, hasCollided: false,c: "80%"},//
        {name: "block", x: 100, y: 3500, w: 100, h: 100,},
        {name: "chance", x: 400, y: 8000, w: 100, h: 100, hasCollided: false, c: "10%"},
        {name: "chance", x: 0, y: 4150, w: 100, h: 100, hasCollided: false, c: "50%"},
        {name: "chance", x: 450, y: 5700, w: 200, h: 150, hasCollided: false, c: "55%"},//
        {name: "chance", x: 450, y: 5800, w: 200, h: 150, hasCollided: false, c: "70%"},//
        {name: "chance", x: 300, y: 4750, w: 200, h: 150, hasCollided: false, c: "80%"},//
        {name: "chance", x: 550, y: 4000, w: 100, h: 100, hasCollided: false, c: "20%"},
        {name: "chance", x: 0, y:1750, w: 100, h: 100, hasCollided: false, c: "50%"},
        {name: "chance", x: 400, y: 3500, w: 100, h: 100, hasCollided: false, c: "5%"},
        {name: "chance", x: 450, y: 4700, w: 200, h: 150, hasCollided: false, c: "55%"},//
        {name: "chance", x: 450, y: 5200, w: 200, h: 150, hasCollided: false, c: "70%"},//
        {name: "chance", x: 300, y: 5750, w: 200, h: 150, hasCollided: false, c: "80%"},//
        {name: "chance", x: 500, y: 5900, w: 100, h: 100, hasCollided: false, c: "15%"},
        {name: "chance", x: 550, y: 4800, w: 100, h: 100, hasCollided: false, c: "20%"},
        {name: "chance", x: 500, y: 3900, w: 100, h: 100, hasCollided: false, c: "15%"},
        {name: "chance", x: 550, y: 4800, w: 100, h: 100, hasCollided: false, c: "20%"},
    ],
    [
        {name: "chance", x:100, y: 6950,  w: 200, h: 150, hasCollided: false,c: "80%"},//
        {name: "block", x: 100, y: 7000, w: 100, h: 100,},
        {name: "chance", x: 400, y: 7200, w: 100, h: 100, hasCollided: false, c: "10%"},
        {name: "chance", x: 0, y: 11500, w: 100, h: 100, hasCollided: false, c: "50%"},
        {name: "chance", x: 250, y: 11800, w: 200, h: 150, hasCollided: false, c: "55%"},//
        {name: "chance", x: 150, y: 11600, w: 200, h: 150, hasCollided: false, c: "70%"},//
        {name: "chance", x: 200, y: 11600, w: 200, h: 150, hasCollided: false, c: "80%"},//
        {name: "chance", x: 400, y: 12000, w: 100, h: 100, hasCollided: false, c: "15%"},
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
        {name: "block", x: 300, y: 5900, w: 100, h: 100,},
        {name: "chance", x: 400, y: 2300, w: 100, h: 100, hasCollided: false, c: "50%"},
        {name: "chance", x: -50, y: 2000,  w: 100, h: 100, hasCollided: false, c: "50%"},
        {name: "chance", x: 0, y: 2200,  w: 100, h: 100, hasCollided: false, c: "20%"},
        {name: "chance", x: 400, y: 1500, w: 100, h: 100, hasCollided: false, c: "5%"},
    ],
    [
        {name: "chance", x: 0, y: 2750, w: 100, h: 100, hasCollided: false, c: "50%"},
        {name: "block", x: 0, y: 4800,  w: 100, h: 100},
        {name: "block", x:500, y: 3250, w: 100, h: 100},
        {name: "block", x: 350, y: 3650,  w: 100, h: 100},
        {name: "block", x:300, y: 4000, w: 100, h: 100},
        {name: "chance", x: 200, y: 6100, w: 200, h: 150, hasCollided: false, c: "80%"},//
        {name: "block", x: 250, y: 6300, w: 100, h: 100,},
        {name: "chance", x: -150, y: 6500,  w: 100, h: 100, hasCollided: false, c: "20%"},
        {name: "block", x:500, y: 6300,  w: 100, h: 100},
        {name: "chance", x:-150, y: 6700,  w: 100, h: 100, hasCollided: false, c: "50%"},
        //{name: "block", x:5, y: 1500, w: 100, h: 100},
        {name: "block", x: 200, y: 5300,  w: 100, h: 100},
        {name: "chance", x: 450, y: 5700, w: 200, h: 150, hasCollided: false, c: "55%"},//
        {name: "chance", x: 450, y: 5800, w: 200, h: 150, hasCollided: false, c: "70%"},//
        {name: "chance", x: 300, y: 4750, w: 200, h: 150, hasCollided: false, c: "80%"},//
        {name: "chance", x: 500, y: 3900, w: 100, h: 100, hasCollided: false, c: "15%"},
        {name: "chance", x: 550, y: 4800, w: 100, h: 100, hasCollided: false, c: "20%"},
        {name: "block", x:100, y: 4250, w: 100, h: 100},
        {name: "chance", x:100, y: 6950,  w: 200, h: 150, hasCollided: false,c: "80%"},//
        {name: "block", x: 100, y: 7000, w: 100, h: 100,},
        {name: "chance", x: 400, y: 7200, w: 100, h: 100, hasCollided: false, c: "10%"},
        {name: "chance", x: 0, y: 11500, w: 100, h: 100, hasCollided: false, c: "50%"},
        {name: "chance", x: 250, y: 11800, w: 200, h: 150, hasCollided: false, c: "55%"},//
        {name: "chance", x: 150, y: 11600, w: 200, h: 150, hasCollided: false, c: "70%"},//
        {name: "chance", x: 200, y: 11600, w: 200, h: 150, hasCollided: false, c: "80%"},//
        {name: "chance", x: 400, y: 12000, w: 100, h: 100, hasCollided: false, c: "15%"}
    ],
    [
        {name: "chance", x: 100, y: 6000, w: 100, h: 100, hasCollided: false, c: "50%"},
        {name: "block", x: 400, y:6100, w: 100, h: 100},
        {name: "chance", x: 200, y: 6100, w: 200, h: 150, hasCollided: false, c: "80%"},//
        {name: "block", x: 250, y: 6300, w: 100, h: 100,},
        {name: "chance", x: -150, y: 6500,  w: 100, h: 100, hasCollided: false, c: "20%"},
        {name: "block", x:500, y: 6300,  w: 100, h: 100},
        {name: "chance", x:-150, y: 6700,  w: 100, h: 100, hasCollided: false, c: "50%"},
        //{name: "block", x:5, y: 1500, w: 100, h: 100},
        {name: "block", x: 250, y: 6300, w: 100, h: 100,},
        {name: "chance", x: -150, y: 6500,  w: 100, h: 100, hasCollided: false, c: "20%"},
        {name: "block", x:500, y: 6300,  w: 100, h: 100},
        {name: "chance", x:-150, y: 6700,  w: 100, h: 100, hasCollided: false, c: "50%"},
        {name: "chance", x:100, y: 6600,  w: 100, h: 100,hasCollided: false, c: "50%"},
        {name: "block", x: 800, y: 6600,  w: 100, h: 100},
        {name: "block", x:100, y: 6800, w: 100, h: 100},
        {name: "chance", x:100, y: 6950,  w: 200, h: 150, hasCollided: false,c: "80%"},//
        {name: "block", x: 100, y: 7000, w: 100, h: 100,},
        {name: "chance", x: 400, y: 7200, w: 100, h: 100, hasCollided: false, c: "10%"},
        {name: "chance", x: 450, y: 5700, w: 200, h: 150, hasCollided: false, c: "55%"},//
        {name: "chance", x: 450, y: 5800, w: 200, h: 150, hasCollided: false, c: "70%"},//
        {name: "chance", x: 300, y: 4750, w: 200, h: 150, hasCollided: false, c: "80%"},//
        {name: "chance", x: 500, y: 3900, w: 100, h: 100, hasCollided: false, c: "15%"},
        {name: "chance", x: 550, y: 4800, w: 100, h: 100, hasCollided: false, c: "20%"},
        {name: "block", x: 300, y: 5900, w: 100, h: 100,},
    ],
    [
        {name: "block", x: 300, y: 7000, w: 100, h: 100,},
        {name: "block", x: -150, y: 7300, w: 100, h: 100,},
        {name: "chance", x: -100, y: 7350, w: 100, h: 100, hasCollided: false, c: "50%"},
        {name: "block", x: 0, y: 7650,  w: 100, h: 100,},
        {name: "block", x: 900, y: 7500, w: 100, h: 100,},
        {name: "chance", x: 500, y: 6100, w: 200, h: 150, hasCollided: false, c: "80%"},//
        {name: "block", x: 300, y: 7700, w: 100, h: 100,},
        {name: "chance", x: 400, y: 7900, w: 100, h: 100, hasCollided: false, c: "50%"},
        {name: "chance", x: -50, y: 7700,  w: 100, h: 100, hasCollided: false, c: "50%"},
        {name: "chance", x: 0, y: 7500,  w: 100, h: 100, hasCollided: false, c: "20%"},
        {name: "chance", x: 400, y: 8100, w: 100, h: 100, hasCollided: false, c: "5%"},
        {name: "chance", x: 500, y: 8500, w: 200, h: 150, hasCollided: false, c: "60%"},//
        {name: "chance", x: 500, y: 9000, w: 100, h: 100, hasCollided: false, c: "50%"},
        {name: "chance", x: 300, y: 8700, w: 200, h: 150, hasCollided: false, c: "60%"},//
        {name: "chance", x: 400, y: 7200, w: 100, h: 100, hasCollided: false, c: "10%"},
        {name: "chance", x: 0, y: 11500, w: 100, h: 100, hasCollided: false, c: "50%"},
        {name: "chance", x: 250, y: 11800, w: 200, h: 150, hasCollided: false, c: "55%"},//
        {name: "chance", x: 150, y: 11600, w: 200, h: 150, hasCollided: false, c: "70%"},//
        {name: "chance", x: 500, y: 9300, w: 100, h: 100, hasCollided: false, c: "15%"},
        {name: "chance", x: 550, y: 9500, w: 100, h: 100, hasCollided: false, c: "20%"},
        {name: "chance", x: 0, y:9750, w: 100, h: 100, hasCollided: false, c: "50%"},
        {name: "chance", x: 400, y: 9300, w: 100, h: 100, hasCollided: false, c: "5%"},
    ],
    [
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
        {name: "block", x: 800, y: 6600,  w: 100, h: 100},
        {name: "block", x:100, y: 6800, w: 100, h: 100},
        {name: "chance", x:100, y: 6950,  w: 200, h: 150, hasCollided: false,c: "80%"},//
        {name: "block", x: 100, y: 7000, w: 100, h: 100,},
        {name: "chance", x: 400, y: 7200, w: 100, h: 100, hasCollided: false, c: "10%"},
        {name: "chance", x: 400, y: 7200, w: 100, h: 100, hasCollided: false, c: "10%"},
        {name: "chance", x: 0, y: 11500, w: 100, h: 100, hasCollided: false, c: "50%"},
        {name: "chance", x: 250, y: 11800, w: 200, h: 150, hasCollided: false, c: "55%"},//
        {name: "chance", x: 150, y: 11600, w: 200, h: 150, hasCollided: false, c: "70%"},//
        {name: "chance", x: 500, y: 9300, w: 100, h: 100, hasCollided: false, c: "15%"},
        {name: "chance", x: 550, y: 9500, w: 100, h: 100, hasCollided: false, c: "20%"},
        {name: "chance", x: 0, y:9750, w: 100, h: 100, hasCollided: false, c: "50%"},
    ],
    [
        {name: "chance", x: 100, y: 9300, w: 100, h: 100, hasCollided: false, c: "5%"},
        {name: "chance", x: -150, y: 1000, w: 200, h: 150, hasCollided: false, c: "55%"},//
        {name: "chance", x: 550, y: 20400, w: 200, h: 150, hasCollided: false, c: "70%"},//
        {name: "chance", x: 100, y: 10600, w: 200, h: 150, hasCollided: false, c: "80%"},//
        {name: "chance", x: 300, y: 11300, w: 100, h: 100, hasCollided: false, c: "15%"},
        {name: "chance", x: 450, y: 11000, w: 100, h: 100, hasCollided: false, c: "20%"},
        {name: "block", x: 800, y: 6600,  w: 100, h: 100},
        {name: "block", x:100, y: 6800, w: 100, h: 100},
        {name: "chance", x:100, y: 6950,  w: 200, h: 150, hasCollided: false,c: "80%"},//
        {name: "block", x: 100, y: 7000, w: 100, h: 100,},
        {name: "chance", x: 400, y: 7200, w: 100, h: 100, hasCollided: false, c: "10%"},
        {name: "chance", x: 0, y: 11500, w: 100, h: 100, hasCollided: false, c: "50%"},
        {name: "chance", x: 250, y: 11800, w: 200, h: 150, hasCollided: false, c: "55%"},//
        {name: "chance", x: 150, y: 11600, w: 200, h: 150, hasCollided: false, c: "70%"},//
        {name: "chance", x: 200, y: 11600, w: 200, h: 150, hasCollided: false, c: "80%"},//
        {name: "chance", x: 400, y: 12000, w: 100, h: 100, hasCollided: false, c: "15%"}
    ]
];

/**
 * Creates a unique string key for an obstacle for deduplication purposes.
 * It ensures only the relevant properties are included in the key.
 * @param {object} obstacle - The obstacle object.
 * @returns {string} A JSON string representation for comparison.
 */
function getObstacleKey(obstacle) {
    const comparable = {
        name: obstacle.name,
        x: obstacle.x,
        y: obstacle.y,
        w: obstacle.w,
        h: obstacle.h,
    };
    // Only include 'c' (chance) and 'hasCollided' if they exist, which are relevant
    // for distinguishing chance blocks.
    if (obstacle.c !== undefined) {
        comparable.c = obstacle.c;
    }
    // hasCollided is usually game state, but since it's present in the original data,
    // we include it in the comparison key to be conservative.
    if (obstacle.hasCollided !== undefined) {
        comparable.hasCollided = obstacle.hasCollided;
    }
    // We stringify the sorted keys of the comparable object to ensure consistency
    // across environments, although JSON.stringify on a simple object is usually fine.
    return JSON.stringify(Object.keys(comparable).sort().reduce((obj, key) => {
        obj[key] = comparable[key];
        return obj;
    }, {}));
}

/**
 * Filters a level array to remove duplicates.
 * @param {Array<object>} level - The array of obstacles for a single level.
 * @returns {Array<object>} An array of unique obstacles.
 */
function deduplicate(level) {
    const seen = new Set();
    const uniqueLevel = [];
    for (const obstacle of level) {
        const key = getObstacleKey(obstacle);
        if (!seen.has(key)) {
            seen.add(key);
            // Create a fresh deep copy to avoid modifying the original data unintentionally
            // although in this context it won't matter as we use rawLevels only once.
            uniqueLevel.push(JSON.parse(JSON.stringify(obstacle)));
        }
    }
    return uniqueLevel;
}

/**
 * Doubles the unique obstacles, applying a small horizontal offset to the clones.
 * This prevents two objects from being stacked perfectly on top of each other in the game.
 * @param {Array<object>} uniqueLevel - The array of unique obstacles.
 * @returns {Array<object>} An array with twice the number of obstacles.
 */
function doubleAndOffset(uniqueLevel) {
    const finalLevel = [...uniqueLevel];
    const offsetX = 250; // Constant horizontal offset for the clone

    for (const obstacle of uniqueLevel) {
        // Create a deep clone
        const clone = JSON.parse(JSON.stringify(obstacle));

        // Offset the clone horizontally
        clone.x = clone.x + offsetX;

        // Add the clone to the final list
        finalLevel.push(clone);
    }
    return finalLevel;
}

/**
 * Sorts the obstacles in ascending order based on the 'y' coordinate.
 * @param {Array<object>} level - The array of obstacles.
 * @returns {Array<object>} The sorted array.
 */
function sortLevel(level) {
    return level.sort((a, b) => a.y - b.y);
}

/**
 * Main function to process all levels according to user requirements.
 * @param {Array<Array<object>>} levels - The nested array of raw level data.
 * @returns {Array<Array<object>>} The processed levels data.
 */
function processLevels(levels) {
    return levels.map(level => {
        // 1. Remove duplicates
        const uniqueLevel = deduplicate(level);

        // 2. Double the unique obstacles and space them out
        const doubledLevel = doubleAndOffset(uniqueLevel);

        // 3. Sort by y value
        return sortLevel(doubledLevel);
    });
}

const updatedLevels = processLevels(rawLevels);

// Export the updated levels array
const levels = updatedLevels;
console.log("Updated Levels structure is ready:");
console.log(levels);
