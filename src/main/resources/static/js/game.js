var Game = {};

Game.isRuning = false;

Game.context = $('#field')[0].getContext('2d');
// Game.context = document.getElementById('field').getContext('2d');
Game.canvas = {
    width: 700,
    height: 400
};

Game.ballPos = {
    x: 350,
    y: 0
};

Game.ballDirection = {
    x: (Math.random() > 0.5 ? 1 : -1),
    y: 3
};

Game.board = {
    w: 50,
    h: 2
};

Game.boardPos = {
    x: 250
};

Game.initWsConnection = function() {
    var host = window.location.host;
    Game.ws = new WebSocket('ws://' + host + '/ws');

    Game.gameIntervalID = setInterval(Game.executeGameFrame, 20);

    //replace with this
    Game.ws.onmessage = function (data) {
        console.log(data);
        var serverMessage = JSON.parse(data.data);
        Game.ballPos = serverMessage.ballPos;
        Game.ballDirection = serverMessage.ballDirection;

        // invert y to make ball moving down
        Game.ballDirection.y = Game.ballDirection.y * -1;
    };

    Game.ws.onclose = function (p1) {
        Game.stopGame()
        // clearInterval(Game.gameIntervalID);
    };
};

Game.executeGameFrame = function () {
    Game.context.clearRect(0, 0, Game.canvas.width, Game.canvas.height);
    Game.drawBoard();

    if (Game.isRuning) {
        Game.moveBall();
        Game.drawBall();
        Game.checkCollision();
        Game.isMatchLost();
        Game.isBallLeftField();
    }
};

Game.moveBall = function() {
    var nextX = Game.ballPos.x + Game.ballDirection.x;
    if (nextX >= Game.canvas.width) {
        Game.ballPos.x = Game.canvas.width;
    } else if (nextX <= 0) {
        Game.ballPos.x = 0;
    } else {
        Game.ballPos.x = nextX;
    }

    var nextY = Game.ballPos.y + Game.ballDirection.y;
    if (nextY >= Game.canvas.height) {
        Game.ballPos.y = Game.canvas.height;
    } else if (nextY <= 0) {
        Game.ballPos.y = 0;
    } else {
        Game.ballPos.y = nextY;
    }
};

Game.drawBall = function() {
    Game.context.beginPath();
    Game.context.arc(Game.ballPos.x, Game.ballPos.y, 1, 0, 2*Math.PI);
    Game.context.stroke();
};

Game.drawBoard = function () {
    Game.context.fillRect(Game.boardPos.x, Game.canvas.height - Game.board.h, Game.board.w, Game.board.h);
    Game.context.stroke();
};

Game.checkCollision = function() {
    if (Game.ballPos.x === 0 || Game.ballPos.x === Game.canvas.width) {
        Game.ballDirection.x = Game.ballDirection.x * -1;
    }

    if (Game.isBoardHit()) {
        Game.ballDirection.y = Game.ballDirection.y * -1;
    }
};

Game.isBoardHit = function() {
    return Game.ballPos.y >= Game.canvas.height - Game.board.h &&
        (Game.ballPos.x > Game.boardPos.x && Game.ballPos.x < (Game.boardPos.x + Game.board.w));
};

Game.isMatchLost = function() {
    if (Game.ballPos.y >= Game.canvas.height){
        console.log("you lost");
        // Game.stopGame();
    }
};

Game.isBallLeftField = function() {
    if (Game.ballPos.y <= 0) {
        // Game.stopGame();
        var toServerMsg = {};
        toServerMsg.ballPos = Game.ballPos;
        toServerMsg.ballDirection = Game.ballDirection;
        console.log(toServerMsg);

        Game.ws.send(JSON.stringify(toServerMsg));
    }
};

Game.stopGame = function() {
    clearInterval(Game.gameIntervalID);
};

$(document).ready(function() {
// document.onload = function() {
    Game.initWsConnection();
    // document.getElementsByTagName('body').keydown(function(e) {
    $('body').keydown(function(e) {
        switch (e.keyCode) {
            case 37:
                Game.boardPos.x = Game.boardPos.x - 10;
                break;
            case 39:
                Game.boardPos.x = Game.boardPos.x + 10;
                break;
        }
    });
});

// $("#start").click(function() {
// // document.getElementById("start").click(function() {
//     Game.gameIntervalID = setInterval(Game.executeGameFrame, 30);
// });