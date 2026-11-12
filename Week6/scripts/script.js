const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

var fps = 1000 / 60;
var timer = setInterval(game, fps);

var startPoint = { x: canvas.width / 2, y: canvas.height / 2 };//canvas.width/2;
var moveDirection = { x: 1, y: 1 };

var boxColor = "red";
var shipSprite = { image: document.getElementById("ship"), x: 1, y: 1, moveX: 0, moveY: 0 };

var acceleration = 0.5;
var friction = 0.9;

var score = 0;
var starsHit = 0;
var states = ["title", "game"];
state = "title";

var hitSound = new Audio("audio/button-3.mp3");
var boxHitSound = new Audio("audio/explosion.mp3");

function playSound(audio) {
    if (!audio) return;
    audio.currentTime = 0;
    try {
        audio.play();
    } catch (e) {

    }
}

function createStar() {
    var star = {
        x: 0,
        y: 0,
        radius: 0,
        color: "black",
        drawCircle: function () {
            ctx.beginPath()
            ctx.fillStyle = this.color;
            ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
            ctx.fill();
        },
    }
    return star;
}


var starCount = 50;
var stars = [];  //Creates an array

for (var i = 0; i < starCount; i++) {
    stars[i] = createStar();
    stars[i].x = Math.random() * canvas.width;
    stars[i].y = Math.random() * canvas.height;
    stars[i].radius = Math.random() * 5;
    //stars[i].color = `rgb(${Math.random()*255},${Math.random()*255},${Math.random()*255})`;
    stars[i].color = "white";

}

shipSprite.x = canvas.width / 2;
shipSprite.y = canvas.height / 2 + 100;

var a = false;
var d = false;
var w = false;
var s = false;
var space = false;
var enter = false;

//Add a variable for the bullets
var bullets = [];
var shootCooldown = 0;

//This is our Game Loop Function
    function game() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        switch (state) {
            case "title":
                ctx.fillStyle = "black";
                ctx.font = "50px Arial";
                let titleText = "Star Shooter";
                ctx.fillText(titleText, canvas.width / 2 - ctx.measureText(titleText).width / 2, canvas.height / 2);
                ctx.font = "16px Arial";
                let instructionText = "Press Enter to Start";
                ctx.fillText(instructionText, canvas.width / 2 - ctx.measureText(instructionText).width / 2, canvas.height / 2 + 40);
                
                if (state === "title") {
                    // title screen is drawn here; actual start is handled by keydown
                }
                //draws the button to start the game
                ctx.fillStyle = "red";
                ctx.fillRect(canvas.width/2 - 100, canvas.height/2 + 100, 200, 80);
                //draws the text on the button
                ctx.fillStyle = "black";
                ctx.font = "24px Arial";
                let buttonText = "Start Game";
                ctx.fillText(buttonText,canvas.width/2 - (ctx.measureText(buttonText).width/2), canvas.height/2 + 100 + 45);
                break;

            case "game":
                //clear the screen
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                startPoint.x += moveDirection.x;
                startPoint.y += moveDirection.y;

                var hitBox = shipSprite.x < startPoint.x + 25 &&
                    shipSprite.x + 25 > startPoint.x &&
                    shipSprite.y < startPoint.y + 25 &&
                    shipSprite.y + 25 > startPoint.y;

                //Colliding with random box
                if (hitBox == true) {
                    resetToTitle();
                    return;
                }

                if (a == true) {
                    shipSprite.moveX -= acceleration;
                }

                if (d == true) {
                    shipSprite.moveX += acceleration;
                }

                if (w == true) {
                    shipSprite.moveY -= acceleration;
                }

                if (s == true) {
                    shipSprite.moveY += acceleration;
                }

                if (shipSprite.x > canvas.width) {
                    shipSprite.x = -25;
                }

                if (shipSprite.x < -25) {
                    shipSprite.x = 800;
                }

                if (startPoint.y > canvas.height - 25 || startPoint.y < 0) {
                    moveDirection.y *= -1;
                    boxColor = `rgb(${Math.random() * 255},${Math.random() * 255},${Math.random() * 255})`;
                }

                if (startPoint.x > canvas.width - 25 || startPoint.x < 0) {
                    moveDirection.x *= -1;
                    boxColor = `rgb(${Math.random() * 255},${Math.random() * 255},${Math.random() * 255})`;
                }

                shipSprite.moveX *= friction;
                shipSprite.moveY *= friction;
                shipSprite.x += shipSprite.moveX;
                shipSprite.y += shipSprite.moveY;

                if (shootCooldown > 0) {
                    shootCooldown--;
                }

                if (space && shootCooldown === 0) {
                    bullets.push({
                        x: shipSprite.x + 25 / 2 - 2,
                        y: shipSprite.y + -10,
                        width: 4,
                        height: 10,
                        speed: 8,
                        color: "white"
                    });
                    shootCooldown = 10;
                }

                ctx.fillStyle = "black";
                ctx.fillRect(0, 0, canvas.width, canvas.height);

                for (var i = 0; i < stars.length; i++) {
                    if (shipToStarCollision(shipSprite, stars[i])) {
                        resetToTitle();
                        return;
                    }
                    stars[i].drawCircle();
                    stars[i].y++;
                    if (stars[i].y > canvas.height + stars[i].radius * 2) {
                        stars[i].x = Math.random() * canvas.width;
                        stars[i].y = -(Math.random() * canvas.height);
                        score += 10;
                    }
                }

                for (var i = bullets.length - 1; i >= 0; i--) {
                    var bullet = bullets[i];
                    bullet.y -= bullet.speed;

                    if (bullet.y + bullet.height < 0) {
                        bullets.splice(i, 1);
                        continue;
                    }

                    var hitBox = bullet.x < startPoint.x + 25 &&
                        bullet.x + bullet.width > startPoint.x &&
                        bullet.y < startPoint.y + 25 &&
                        bullet.y + bullet.height > startPoint.y;

                    if (hitBox) {
                        bullets.splice(i, 1);
                        startPoint.x = Math.random() * (canvas.width - 25);
                        startPoint.y = Math.random() * (canvas.height - 25);
                        moveDirection.x = (Math.random() * 2 - 1) * 3;
                        moveDirection.y = (Math.random() * 2 - 1) * 3;
                        starsHit += 10;
                        playSound(boxHitSound);
                        continue;
                    }

                    for (var j = 0; j < stars.length; j++) {
                        if (shipToStarCollision(bullet, stars[j])) {
                            bullets.splice(i, 1);
                            stars[j].x = Math.random() * canvas.width;
                            stars[j].y = -(Math.random() * canvas.height);
                            starsHit++;
                            playSound(hitSound);
                            continue;
                        }
                    }

                    ctx.fillStyle = bullet.color;
                    ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
                }

                ctx.fillStyle = boxColor;
                ctx.fillRect(startPoint.x, startPoint.y, 25, 25);
                ctx.drawImage(shipSprite.image, shipSprite.x, shipSprite.y, 25, 25);

                ctx.fillStyle = "White";
                ctx.font = "30px Arial";
                ctx.fillText(`Score: ${score}`, 30, 80);

                ctx.fillStyle = "White";
                ctx.font = "30px Arial";
                ctx.fillText(`Stars Hit: ${starsHit}`, 600, 80);
                break;
        }
    }

//on key pressed
document.addEventListener("keydown", function (e) {
    console.log(e.key);
    if (e.key == "a") {
        a = true;
    }
    if (e.key == "d") {
        d = true;
    }
    if (e.key == "w") {
        w = true;
    }
    if (e.key == "s") {
        s = true;
    }
    if (e.code === "Space") {
        space = true;
        e.preventDefault();
    }
    if (e.code === "Enter") {
        e.preventDefault();
        if (state === "title") {
            switchScenes("game");
        }
    }
});
//on key released
document.addEventListener("keyup", function (e) {
    console.log(e.key);
    if (e.key == "a") {
        a = false;
    }
    if (e.key == "d") {
        d = false;
    }
    if (e.key == "w") {
        w = false;
    }
    if (e.key == "s") {
        s = false;
    }
    if (e.code === "Space") {
        space = false;
    }
    if (e.code === "Enter") {
        enter = false;
    }
});

//Event for button click
canvas.addEventListener("click", function (e) {
    const rect = canvas.getBoundingClientRect();
    const mouseX = (e.clientX - rect.left) * canvas.width/ rect.width;
    const mouseY = (e.clientY - rect.top) * canvas.height/ rect.height;

    if(states != "game" &&
        mouseX >= canvas.width/2 - 100 &&
        mouseX <= canvas.width/2 + 100 &&
        mouseY >= canvas.height/2 + 100 &&
        mouseY <= canvas.height/2 + 180 
    ){
        startcooldown = 180;
        switchScenes("game");
    }
});

function shipToStarCollision(obj, star) {
    var closestX = Math.max(obj.x, Math.min(star.x, obj.x + 25));
    var closestY = Math.max(obj.y, Math.min(star.y, obj.y + 25));

    var dx = star.x - closestX;
    var dy = star.y - closestY;

    var dist = dx * dx + dy * dy;
    return dist <= star.radius * star.radius;
}

function switchScenes(nameOfScene) {
    state = nameOfScene;
    if (nameOfScene === "title") {
        enter = false;
    }
    if (nameOfScene === "game") {
        shootCooldown = 30;
    }
}

function resetToTitle() {
    state = "title";
    enter = false;
    score = 0;
    starsHit = 0;
    shipSprite.x = canvas.width / 2;
    shipSprite.y = canvas.height / 2 + 100;
    shipSprite.moveX = 0;
    shipSprite.moveY = 0;
    startPoint.x = canvas.width / 2;
    startPoint.y = canvas.height / 2;
    moveDirection.x = 1;
    moveDirection.y = 1;
    bullets = [];
    shootCooldown = 0;
}