
//board
let board;
let boardWidth = 360;
let boardHeight = 640;
let context;


//bird
let birdWidth = 34;
let birdHeight = 24;
let birdX = boardWidth/8;
let birdY = boardHeight/2;
let birdImg;

let bird = {
    x : birdX,
    y : birdY,
    width : birdWidth,
    height : birdHeight
}

//pipes
let pipeArray = [];
let pipeWidth = 64;
let pipeHeight = 512;
let pipeX = boardWidth;
let pipeY = 0;

let topPipeImg;
let bottompipeImg;

//physics
let velocityX = -2.5; //pipes moving to left
let velocityY = 0; //bird jump speed
let gravity = 0.4;
let gameOver = false;
let score = 0;
let highScore = 0;

window.onload = function() {
    board = document.getElementById("board");
    board.height = boardHeight;
    board.width = boardWidth;
    context = board.getContext("2d");

    //draw the bird
    //context.fillStyle = "green";
    //context.fillRect(bird.x, bird.y, bird.width, bird.height);

    //bird image
    birdImg = new Image();
    birdImg.src = "./images/flappybird.png";
    birdImg.onload = function() {
        context.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height);
    }

    topPipeImg = new Image();
    topPipeImg.src = "./images/toppipe.png";

    bottompipeImg = new Image();
    bottompipeImg.src = "./images/bottompipe.png";

    requestAnimationFrame(update);
    setInterval(placePipes, 1500); //1.5sec
    
    // Add event listener for touchstart
    document.addEventListener("touchstart", handleTouch);

    // Existing keyboard event listener
    document.addEventListener("keydown", moveBird);
}

function update() {
    requestAnimationFrame(update);
    if(gameOver) {
        return;
    }
    context.clearRect(0, 0, board.width, board.height);
    //bird
    velocityY += gravity;
    //bird.y += velocityY;
    bird.y = Math.max(bird.y + velocityY, 0);
    context.drawImage(birdImg, bird.x, bird.y, birdWidth, birdHeight);

    if(bird.y > board.height) {
        gameOver = true;
    }
    //pipes
    for(let i=0; i < pipeArray.length; i++) {
        let pipe = pipeArray[i];
        pipe.x += velocityX;
        context.drawImage(pipe.img, pipe.x, pipe.y, pipe.width, pipe.height);

        if(!pipe.passed && bird.x > pipe.x + pipe.width) {
            score += 0.5;
            pipe.passed = true;  
        }

        if(detectCollision(bird, pipe)) {
           gameOver = true; 
        }
    }
    // clear pipes
   while(pipeArray.length > 0 && pipeArray[0].x < -pipeWidth) {
    pipeArray.shift();
   } 

   //score
   context.fillStyle = "white";
   context.font = "45px sans-serif";
   context.fillText(score,5,45);


    if (gameOver) {
        if (score > highScore) {
            highScore = score;
        }
        context.fillText("GAME OVER!",60,340,240);
        context.fillStyle = "yellow";
        context.font = "29px sans-serif";
        context.fillText("High Score: " + highScore, 5, 85); // Display high score
        context.fillStyle = "gray";
        context.font = "15px sans-serif";
        context.fillText("Press Space Key to Reset",80,360);
    }
    
}

function placePipes() {
    if(gameOver) {
        return;
    }
    let randomPipeY = pipeY - pipeHeight/4 - Math.random()*(pipeHeight/2) ;
    let openingSpace = boardHeight/4;

    let topPipe = {
        img : topPipeImg,
        x : pipeX,
        y : randomPipeY,
        width : pipeWidth,
        height : pipeHeight,
        passed : false 
    }

    pipeArray.push(topPipe);

    let bottomPipe = {
        img : bottompipeImg,
        x : pipeX,
        y : randomPipeY + pipeHeight + openingSpace,
        width : pipeWidth,
        height : pipeHeight,
        passed : false
    }
    pipeArray.push(bottomPipe);
}

function handleTouch(e) {
    // Trigger the same action as the space key
    velocityY = -6;
    if (gameOver) {
        bird.y = birdY;
        pipeArray = [];
        score = 0;
        gameOver = false;
    }
}

function moveBird(e) {
    if (e.code == "Space" || e.code == "ArrowUp" || e.code == "KeyX")
    {
        //jump
        velocityY = -6;
        if (gameOver) {
            bird.y = birdY;
            pipeArray = [];
            score = 0;
            gameOver = false;
        }
    }
    
    
}

function detectCollision(a, b) {
    return a.x < b.x + b.width &&
           a.x + a.width > b.x &&
           a.y < b.y + b.height &&
           a.y + a.height > b.y;
}