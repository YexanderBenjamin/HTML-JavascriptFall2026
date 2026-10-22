
 var canvas = document.getElementById("canvas");
 var ctx = canvas.getContext("2d");

canvas.width = 800;
canvas.height = 800;

// 1. Square
ctx.fillStyle = "yellow";
ctx.strokeStyle = "black";
ctx.lineWidth = 5;
ctx.fillRect(85, 302, 100, 100);
ctx.strokeRect(85, 302, 100, 100);

// 2. Circle
ctx.fillStyle = "#ffff00";
ctx.strokeStyle = "red";
ctx.lineWidth = 5;
ctx.beginPath();
ctx.arc(385, 442, 65, 0, 2 * Math.PI);
ctx.fill();
ctx.stroke();

// 3. Pentagon
ctx.fillStyle = "#ff00ff";
ctx.strokeStyle = "#00ffff";
ctx.lineWidth = 5;
ctx.beginPath();
ctx.moveTo(558, 309);
ctx.lineTo(668, 284);
ctx.lineTo(725, 381);
ctx.lineTo(651, 465);
ctx.lineTo(548, 421);
ctx.closePath();
ctx.fill();
ctx.stroke();

// 4. Line
ctx.strokeStyle = "rgb(255,0,0)";
ctx.lineWidth = 5;
ctx.beginPath();
ctx.moveTo(85, 682);
ctx.lineTo(279, 550);
ctx.stroke();

// 5. Star
ctx.fillStyle = "#ffff00";
ctx.strokeStyle = "rgb(32,32,32)";
ctx.lineWidth = 5;
ctx.beginPath();

// Top point
ctx.moveTo(636, 497);

// Upper right point
ctx.lineTo(668, 555);

// Right upper point
ctx.lineTo(734, 567);

// Right lower point
ctx.lineTo(688, 616);

// Bottom right point
ctx.lineTo(696, 682);

// Bottom point
ctx.lineTo(636, 654);

// Bottom left point
ctx.lineTo(576, 682);

// Left lower point
ctx.lineTo(584, 616);

// Left upper point
ctx.lineTo(538, 567);

// Upper left point
ctx.lineTo(604, 555);

ctx.closePath();
ctx.fill();
ctx.stroke();
