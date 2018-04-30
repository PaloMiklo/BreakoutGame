var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");
// allows me to draw to canvas

var x = (canvas.width / 2) + Math.floor(Math.random() * 21) - 10; 		 // change the starting ball position with those numbers
var y = (canvas.height - 30) + Math.floor(Math.random() * 21) - 10 - 30; // aswell
var dy = -2; 													 		 // var dx and dy values change the speed of the ball
var dx = 2;
var ballRadius = 15;
var paddleHeight = 10;
var paddleWidth = 100; 													 // if difficulty is the case
var paddleX = (canvas.width - paddleWidth) / 2;
var rightPressed = false;
var leftPressed = false;
var brickRowCount = 3;
var brickColumnCount = 5;
var brickWidth = 75;
var brickHeight = 20;
var brickPadding = 10;
var brickOffsetTop = 30;
var brickOffsetLeft = 30;
var score = 0;
var lives = 3;
var level = 1;
var maxLevel = 5;
var paused = false;
var ball = new Image();
// ball.src = "https://s20.postimg.org/cayyuwmal/ball.jpg";
ball.src = "./ball.jpg";

var bricks = [];
initBricks();
function initBricks() {
	for (c = 0; c < brickColumnCount; c++) {
		bricks[c] = [];
		for (r = 0; r < brickRowCount; r++) {
			bricks[c][r] = { x: 0, y: 0, status: 1 };
		}
	}
}


document.addEventListener("keydown", keyDownHandler);				// push a key will call a function 
document.addEventListener("keyup", keyUpHandler);				 	// release a key will call also a function 

function drawBricks() {
	for (c = 0; c < brickColumnCount; c++) {
		for (r = 0; r < brickRowCount; r++) {
			if (bricks[c][r].status == 1) {
				var brickX = (c * (brickWidth + brickPadding)) + brickOffsetLeft;
				var brickY = (r * (brickHeight + brickPadding)) + brickOffsetTop;
				bricks[c][r].x = 0;
				bricks[c][r].x = brickX;
				bricks[c][r].y = brickY;
				ctx.beginPath();
				ctx.rect(brickX, brickY, brickWidth, brickHeight);
				ctx.fillStyle = "0095DD";
				ctx.fill();
				ctx.closePath();
			}
		}
	}
}

function keyDownHandler(e) {
	if (e.keyCode == 39) {						// 39 is the right cursor key
		rightPressed = true;
	}
	else if (e.keyCode == 37) { 				// 37 is the left cursor key
		leftPressed = true;
	}
}

function keyUpHandler(e) {
	if (e.keyCode == 39) {
		rightPressed = false;
	}
	else if (e.keyCode == 37) {
		leftPressed = false;
	}
}

function drawBall() {
	// position and style - draw
	// ctx.beginPath();
	// ctx.arc(x, y, ballRadius, 0, Math.PI*2);
	ctx.drawImage(ball, x, y, ballRadius, ballRadius);
	// ctx.fillStyle = "#0095DD";
	// ctx.fill();
	// ctx.closePath();
}

function drawPaddle() {
	ctx.beginPath();
	ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
	ctx.fillStyle = "#0095DD";
	ctx.fill();
	ctx.closePath();
}

function collisionDetection() {
	for (c = 0; c < brickColumnCount; c++) {
		for (r = 0; r < brickRowCount; r++) {
			var b = bricks[c][r];
			if (b.status == 1) {
				if (x > b.x && x < b.x + brickWidth && y > b.y && y < b.y + brickHeight) {
					dy = -dy;
					b.status = 0;
					score++;
					if (score == brickColumnCount * brickRowCount) { //	1 only for demo purposes 
						if (level === maxLevel) {
							alert("YOU WIN, CONGRATULATIONS!");
							document.location.reload();
						} else {
							// start the next level
							level++;
							brickRowCount++;
							initBricks(); // add bricks again
							score = 0;
							// change the ball speed 
							dx += 1;
							dy = -dy;
							dy -= 1;
							//	set up the start from the middle again
							x = (canvas.width / 2) + Math.floor(Math.random() * 21) - 10;
							y = (canvas.height - 30) + Math.floor(Math.random() * 21) - 10;
							paddleX = (canvas.width - paddleWidth / 2);
							paused = true;
							ctx.beginPath();
							ctx.rect(0, 0, canvas.width, canvas.height);
							ctx.fillStyle = "#0095DD";
							ctx.fill();
							ctx.font = "16px Arial";
							ctx.fillStyle = "#FFFFFF";
							ctx.fillText("Level " + (level - 1) + " completed, starting next level...", 110, 150);
							setTimeout(function () {
								paused = false;
								draw();
							}, 3000);
						}
					}
				}
			}
		}
	}
}

function drawScore() {
	ctx.font = "16px Arial";
	ctx.fillStyle = "#0095DD";
	ctx.fillText("Score: " + score, 8, 20); 						// x, y position of text
}

function drawLives() {
	ctx.font = "16px Arial";
	ctx.fillStyle = "#0095DD";
	ctx.fillText("Lives: " + lives, canvas.width - 65, 20)
	//	offset 65px from the right of the canvas and set up the height so it is inline with the score above
}

function drawLevel() {
	ctx.font = "16px Arial";
	ctx.fillStyle = "#0095DD";
	ctx.fillText("Level: " + level, 210, 20); 						//	x, y position of text
}

function draw() {
	//drawing code
	//clean the canvas 
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	drawBricks();
	drawBall();
	drawPaddle();
	drawScore();
	drawLives();
	drawLevel();
	collisionDetection();

	//top and bottom edge
	if (y + dy < ballRadius) { 										 //	if it gets touched the up or down border
		dy = -dy; 							 						 //	reverse the ball
	} else if (y + dy > canvas.height - ballRadius) {
		if (x > paddleX && x < paddleX + paddleWidth) {
			dy = -dy;
		} else {
			lives--;
			if (!lives) {
				alert("GAME OVER!");
				document.location.reload();
			} else {
				x = (canvas.width / 2) + Math.floor(Math.random() * 21) - 10;
				y = (canvas.height - 30) + Math.floor(Math.random() * 21) - 10;
				paddleX = (canvas.width - paddleWidth) / 2;
			}
		}

	}

	//left and right edge
	if (x + dx > canvas.width - ballRadius || x + dx < ballRadius) {  //if it touch the left or right border
		dx = -dx;													  //reverse the ball
	}

	if (rightPressed && paddleX < canvas.width - paddleWidth) {
		paddleX += 7;
	} else if (leftPressed && paddleX > 0) {
		paddleX -= 7;
	}

	//draw it again
	x += dx;
	y += dy;
	if (!paused) {
		requestAnimationFrame(draw);
	}
}

document.addEventListener("mousemove", mouseMoveHandler);

function mouseMoveHandler(e) {
	var relativeX = e.clientX - canvas.offsetLeft;
	if (relativeX > 0 + paddleWidth / 2 && relativeX < canvas.width - paddleWidth / 2) {
		paddleX = relativeX - paddleWidth / 2;
	}
}

draw();
