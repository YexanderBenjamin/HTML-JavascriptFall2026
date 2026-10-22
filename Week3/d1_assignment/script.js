
 var canvas = document.getElementById("canvas");
 var ctx = canvas.getContext("2d");

canvas.width = 800;
canvas.height = 800;

//Square
ctx.fillStyle = "yellow";
ctx.strokeStyle = "black";
ctx.lineWidth = 5;
ctx.fillRect(85, 302, 100, 100);
ctx.strokeRect(85, 302, 100, 100);

//Circle
ctx.fillStyle = "#ffff00";
ctx.strokeStyle = "red";
ctx.lineWidth = 5;
ctx.beginPath();
ctx.arc(385, 442, 65, 0, 2 * Math.PI);
ctx.fill();
ctx.stroke();

//Pentagon
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

//Line
ctx.strokeStyle = "rgb(255,0,0)";
ctx.lineWidth = 5;
ctx.beginPath();
ctx.moveTo(85, 682);
ctx.lineTo(279, 550);
ctx.stroke();

//Star
ctx.fillStyle = "#ffff00";
ctx.strokeStyle = "rgb(32,32,32)";
ctx.lineWidth = 5;
ctx.beginPath();

ctx.moveTo(636, 497);
ctx.lineTo(668, 555);
ctx.lineTo(734, 567);
ctx.lineTo(688, 616);
ctx.lineTo(696, 682);
ctx.lineTo(636, 654);
ctx.lineTo(576, 682);
ctx.lineTo(584, 616);
ctx.lineTo(538, 567);
ctx.lineTo(604, 555);

ctx.closePath();
ctx.fill();
ctx.stroke();
