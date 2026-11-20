/*
DESERT TRUCK RUNNER - GAME PLAN / PSEUDOCODE

1. Set up the canvas and the game objects.
2. Create the truck in the middle lane near the bottom of the screen.
3. Start with 250 fuel and 0 meters traveled.
4. While the game is running:
   - Read A/Left and D/Right to move the truck between the three lanes.
   - Increase distance at 10 meters per second.
   - Every 20 meters, remove 10 fuel.
   - Every 100 meters, add a fuel can to a random lane.
   - A regular fuel can adds 100 fuel, but never above 250.
   - A gold fuel can fills the tank back to 250.
   - Start adding barricades at 100 meters.
   - Choose random barricade lanes, but always leave at least one lane open.
   - Move barricades and fuel cans toward the bottom of the screen.
   - Use GameObject.overlaps() to check collisions.
   - If the truck collects fuel, increase fuel and remove that can.
   - If the truck hits a barricade, end the game unless its bubble shield is active.
   - If fuel reaches 0, end the game.
   - If distance reaches 1,000 meters, the player wins.
5. Draw the road, truck, obstacles, fuel, distance, fuel bar, and game messages.

*/

/*-------------------------------------------
Game Setup - kept from the teacher's starter
1. canvas
2. context
3. frame rate
4. animation timer runs main() 60 times per second
-------------------------------------------*/
var c = document.querySelector("canvas");
var ctx = c.getContext("2d");
var fps = 1000 / 60;
var timer = setInterval(main, fps);

/*------------ Declare Variables Here --------*/
var laneX = [300, 400, 500];
var roadLeft = 230;
var roadRight = 570;
var playerLane = 1;
var truck;
var obstacles = [];
var fuelCans = [];
var bubbles = [];

var distance = 0;
var fuel = 250;
var maxFuel = 250;
var fuelLossStep = 20;
var nextFuelLoss = 20;
var nextGasSpawn = 100;
var nextBarricadeSpawn = 100;
var nextBubbleSpawn = 300;
var scrollSpeed = 3.2;
var duneOffset = -180;
var laneMarkOffset = 0;
var laneDashLength = 24;
var laneDashGap = 22;
var laneDashCycle = laneDashLength + laneDashGap;

var gameState = "start"; // start, playing, gameover, win
var shieldTime = 0;
var lastTime = 0;
var elapsedTime = 0;
var distanceRemainder = 0;


var truckImageID = "#avatar";
var barricadeImageID = "#barricade";
var gasImageID = "#gas";
var goldGasImageID = "#gold-gas";
var bubbleImageID = "#bubble";


function makeSprite(imageID, x, y, w, h, color) {
    var sprite = new GameObject(imageID);
    sprite.x = x;
    sprite.y = y;
    sprite.w = w;
    sprite.h = h;
    sprite.color = color || "hotpink";
    sprite.img.w = w;
    sprite.img.h = h;
    sprite.img.scale.x = 1;
    sprite.img.scale.y = 1;
    return sprite;
}

function resetGame() {
    playerLane = 1;
    truck = makeSprite(truckImageID, laneX[playerLane], 405, 54, 82, "#c94b27");
    truck.w = 40;
    truck.h = 60;
    obstacles = [];
    fuelCans = [];
    bubbles = [];
    distance = 0;
    fuel = maxFuel;
    nextFuelLoss = 20;
    nextGasSpawn = 100;
    nextBarricadeSpawn = 100;
    nextBubbleSpawn = 300;
    shieldTime = 0;
    laneMarkOffset = 0;
    duneOffset = -180;
    distanceRemainder = 0;
    elapsedTime = 0;
    lastTime = 0;
    gameState = "playing";
}
function getClearSpawnLanes() {
    var clearLanes = [];

    for (var lane = 0; lane < 3; lane++) {
        var occupied = false;
        var lanePosition = laneX[lane];

        //Check obstacles
        for (var i = 0; i < obstacles.length; i++) {
            if (
                obstacles[i].x === lanePosition &&
                Math.abs(obstacles[i].y - (-40) ) < 70
            ) {
                occupied = true;
            }
        }
        //check fuel cans
        for (var j = 0; j < fuelCans.length; j++) {
            if (
                fuelCans[j].object.x === lanePosition &&
                Math.abs(fuelCans[j].object.y - (-40)) < 70
            ) {
                occupied = true;
            }
        }

        if (!occupied) {
            clearLanes.push(lane);
        }
    }

    return clearLanes;
}
function addBarricades() {
    var availableLanes = getClearSpawnLanes();
    var blocked = [];

    if (availableLanes.length === 0) {
        return;
    }

    // Always spawn at least one barricade.
    var firstIndex = Math.floor(Math.random() * availableLanes.length);
    blocked.push(availableLanes.splice(firstIndex, 1)[0]);

    // Sometimes spawn a second barricade.
    if (availableLanes.length > 0 && Math.random() < 0.35) {
        var secondIndex = Math.floor(Math.random() * availableLanes.length);
        blocked.push(availableLanes.splice(secondIndex, 1)[0]);
    }

    for (var i = 0; i < blocked.length; i++) {
        var barrier = makeSprite(
            barricadeImageID,
            laneX[blocked[i]],
            -45,
            66,
            44,
            "#f4a52f"
        );

        barrier.w = 48;
        barrier.h = 32;

        obstacles.push(barrier);
    }
}

function addFuelCan() {
    var availableLanes = getClearSpawnLanes();

    if (availableLanes.length === 0) {
        return;
    }

    var lane = availableLanes[Math.floor(Math.random() * availableLanes.length)];
    var isGold = Math.random() < 0.15;
    var imageID = isGold ? goldGasImageID : gasImageID;

    fuelCans.push({
        object: makeSprite(imageID, laneX[lane], -40, 42, 48, "#e33d32"),
        gold: isGold
    });
}

function addBubble() {
    var availableLanes = getClearSpawnLanes();

    if (availableLanes.length === 0) {
        return;
    }

    var lane = availableLanes[Math.floor(Math.random() * availableLanes.length)];

    bubbles.push(
        makeSprite(bubbleImageID, laneX[lane], -40, 48, 48, "#8bdcf4")
    );
}

function updateGame(deltaSeconds) {
    laneMarkOffset = (laneMarkOffset + scrollSpeed ) ;

    if (a && playerLane > 0) {
        playerLane--;
        a = false;
        truck.x = laneX[playerLane];
    }
    if (d && playerLane < 2) {
        playerLane++;
        d = false;
        truck.x = laneX[playerLane];
    }

    distance += 10 * deltaSeconds;

    duneOffset += scrollSpeed * 0.35;

    if (duneOffset > c.height + 180) {
        duneOffset = -180;
    }

    while (distance >= nextFuelLoss) {
        fuel -= 10;
        nextFuelLoss += fuelLossStep;
    }

    while (distance >= nextGasSpawn) {
        addFuelCan();
        nextGasSpawn += 150;
    }

    while (distance >= nextBarricadeSpawn) {
        addBarricades();
        nextBarricadeSpawn += 10;
    }

    while (distance >= nextBubbleSpawn) {
        addBubble();
        nextBubbleSpawn += 350;
    }

    if (shieldTime > 0) {
        shieldTime -= deltaSeconds;
        if (shieldTime < 0) { shieldTime = 0; }
    }

    for (var i = obstacles.length - 1; i >= 0; i--) {
        obstacles[i].y += scrollSpeed;
        if (truck.overlaps(obstacles[i])) {
            if (shieldTime > 0) {
                shieldTime = 0;
                obstacles.splice(i, 1);
            } else {
                gameState = "gameover";
            }
        } else if (obstacles[i].y > c.height + 60) {
            obstacles.splice(i, 1);
        }
    }

    for (var j = fuelCans.length - 1; j >= 0; j--) {
        fuelCans[j].object.y += scrollSpeed;
        if (truck.overlaps(fuelCans[j].object)) {
            if (fuelCans[j].gold) {
                fuel = maxFuel;
            } else {
                fuel = Math.min(maxFuel, fuel + 100);
            }
            fuelCans.splice(j, 1);
        } else if (fuelCans[j].object.y > c.height + 60) {
            fuelCans.splice(j, 1);
        }
    }

    for (var k = bubbles.length - 1; k >= 0; k--) {
        bubbles[k].y += scrollSpeed;
        if (truck.overlaps(bubbles[k])) {
            shieldTime = 5;
            bubbles.splice(k, 1);
        } else if (bubbles[k].y > c.height + 60) {
            bubbles.splice(k, 1);
        }
    }

    if (fuel <= 0) {
        fuel = 0;
        gameState = "gameover";
    }
    if (distance >= 1000) {
        distance = 1000;
        gameState = "win";
    }
}

function drawRoad() {
    // Desert background
    ctx.fillStyle = "#d8b477";
    ctx.fillRect(0, 0, c.width, c.height);

    // Single looping distant sand dune
    ctx.fillStyle = "#c99d5d";
    ctx.beginPath();

    ctx.moveTo(0, 110 + duneOffset);
    ctx.quadraticCurveTo(
        130, 40 + duneOffset,
        260, 115 + duneOffset
    );
    ctx.quadraticCurveTo(
        410, 35 + duneOffset,
        560, 112 + duneOffset
    );
    ctx.quadraticCurveTo(
        690, 45 + duneOffset,
        800, 110 + duneOffset
    );

    ctx.lineTo(800, 180 + duneOffset);
    ctx.lineTo(0, 180 + duneOffset);
    ctx.closePath();
    ctx.fill();


    // Road
    ctx.fillStyle = "#51483f";
    ctx.fillRect(roadLeft, 0, roadRight - roadLeft, c.height);
    ctx.fillStyle = "#e9d5a9";


    
    ctx.fillRect(roadLeft - 7, 0, 7, c.height);
    ctx.fillRect(roadRight, 0, 7, c.height);

    // Dashed lane markers
    ctx.strokeStyle = "#f8e9c8";
    ctx.lineWidth = 4;
    ctx.beginPath();
    var firstMarkerY = laneMarkOffset % laneDashCycle;
    for (var markerY = firstMarkerY; markerY < c.height; markerY += laneDashCycle) {
        ctx.moveTo(roadLeft + (roadRight - roadLeft) / 3, markerY);
        ctx.lineTo(roadLeft + (roadRight - roadLeft) / 3, markerY + laneDashLength);
        ctx.moveTo(roadLeft + 2 * (roadRight - roadLeft) / 3, markerY);
        ctx.lineTo(roadLeft + 2 * (roadRight - roadLeft) / 3, markerY + laneDashLength);
    }
    ctx.stroke();
}

function drawHud() {
    ctx.fillStyle = "rgba(35, 27, 21, 0.82)";
    ctx.fillRect(15, 14, 220, 78);
    ctx.fillStyle = "#fff7e8";
    ctx.font = "bold 18px Arial";
    ctx.fillText("DISTANCE: " + Math.floor(distance) + " m", 28, 42);
    ctx.fillText("FUEL: " + Math.floor(fuel) + " / 250", 28, 70);

    ctx.fillStyle = "#3a2b20";
    ctx.fillRect(250, 24, 170, 18);
    ctx.fillStyle = fuel > 70 ? "#7fbd56" : "#e45a3e";
    ctx.fillRect(250, 24, 170 * (fuel / maxFuel), 18);
    ctx.strokeStyle = "#fff7e8";
    ctx.strokeRect(250, 24, 170, 18);

    if (shieldTime > 0) {
        ctx.fillStyle = "#e9fbff";
        ctx.font = "bold 16px Arial";
        ctx.fillText("BUBBLE SHIELD: " + shieldTime.toFixed(1) + "s", 445, 38);
    }
}

function drawObjects() {
    for (var i = 0; i < fuelCans.length; i++) {
        fuelCans[i].object.graphic();
    }
    for (var j = 0; j < bubbles.length; j++) {
        bubbles[j].graphic();
    }
    for (var k = 0; k < obstacles.length; k++) {
        obstacles[k].graphic();
    }
    if (truck) {
        if (shieldTime > 0) {
            ctx.save();
            ctx.globalAlpha = 0.75;
            var shieldVisual = makeSprite(bubbleImageID, truck.x, truck.y, 84, 104, "#8bdcf4");
            shieldVisual.graphic();
            ctx.restore();
        }
        truck.graphic();
    }
}

function drawMessage(title, subtitle) {
    ctx.fillStyle = "rgba(26, 20, 16, 0.78)";
    ctx.fillRect(115, 160, 570, 180);
    ctx.strokeStyle = "#f0bd64";
    ctx.lineWidth = 4;
    ctx.strokeRect(115, 160, 570, 180);
    ctx.textAlign = "center";
    ctx.fillStyle = "#fff4d8";
    ctx.font = "bold 38px Arial";
    ctx.fillText(title, 400, 225);
    ctx.font = "18px Arial";
    ctx.fillText(subtitle, 400, 270);
    ctx.fillText("Press SPACE to " + (gameState === "start" ? "start" : "play again"), 400, 310);
    ctx.textAlign = "left";
}

function main() {
    var now = Date.now();
    var deltaSeconds = lastTime === 0 ? 1 / 60 : Math.min((now - lastTime) / 1000, 0.05);
    lastTime = now;

    ctx.clearRect(0, 0, c.width, c.height);
    drawRoad();

    if (gameState === "playing") {
        updateGame(deltaSeconds);
    }

    drawObjects();
    drawHud();

    if (gameState === "start") {
        drawMessage("DESERT TRUCK RUNNER", "Dodge barricades and collect fuel to reach 1,000 meters!");
    } else if (gameState === "gameover") {
        drawMessage("GAME OVER", "You ran out of fuel or hit a barricade.");
    } else if (gameState === "win") {
        drawMessage("YOU MADE IT!", "You reached the end of the desert road!");
    }
}

// Start or restart with Space.
document.addEventListener("keydown", function(e) {
    if (e.code === "Space" && gameState !== "playing") {
        e.preventDefault();
        resetGame();
    }
});


function rand(_low, _high) {
    return Math.random() * (_high - _low) + _low;
}
function radians(_deg) {
    return _deg * Math.PI / 180;
}
function degrees(_rad) {
    return _rad * 180 / Math.PI;
}
