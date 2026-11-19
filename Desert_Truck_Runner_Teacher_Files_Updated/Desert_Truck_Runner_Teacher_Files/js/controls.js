/*--------------------------------
Teacher starter file: keyboard controls
WASD is kept for the class starter project.
Arrow keys are also supported for this game.
---------------------------------*/
var w = false;
var a = false;
var s = false;
var d = false;

document.addEventListener("keydown", press);
function press(e) {
    var key = e.key.toLowerCase();

    if (key === "w" || key === "arrowup") { w = true; }
    if (key === "s" || key === "arrowdown") { s = true; }
    if (key === "a" || key === "arrowleft") { a = true; }
    if (key === "d" || key === "arrowright") { d = true; }

    if (key.startsWith("arrow") || key === " ") {
        e.preventDefault();
    }
}

document.addEventListener("keyup", release);
function release(e) {
    var key = e.key.toLowerCase();

    if (key === "w" || key === "arrowup") { w = false; }
    if (key === "s" || key === "arrowdown") { s = false; }
    if (key === "a" || key === "arrowleft") { a = false; }
    if (key === "d" || key === "arrowright") { d = false; }
}
