// botLogic.js

function Bot(snake, enemy, apple) {
    this.snake = snake;
    this.enemy = enemy;
    this.apple = apple;
}

Bot.prototype.isEnemyNearby = function() {
    var myHead = this.snake.body[0];
    for (var i = 0; i < this.enemy.body.length; i++) {
        if (Math.abs(myHead.x - this.enemy.body[i].x) <= 1 && Math.abs(myHead.y - this.enemy.body[i].y) <= 1) {
            return true;
        }
    }
    return false;
}

Bot.prototype.isSelfCollisionRisk = function() {
    var myHead = this.snake.body[0];
    for (var i = 1; i < this.snake.body.length; i++) {
        if (myHead.x === this.snake.body[i].x && myHead.y === this.snake.body[i].y) {
            return true;
        }
    }
    return false;
}

Bot.prototype.decideMove = function() {
    var myHead = this.snake.body[0];
    var enemyHead = this.enemy.body[0];
    var applePosition = this.apple.position;

    // Logic to decide the move based on the positions of the apple, enemy, and potential threats
    // This is a basic example and can be expanded upon
    if (!this.isEnemyNearby() && !this.isSelfCollisionRisk()) {
        if (applePosition.x > myHead.x) {
            return "RIGHT";
        } else if (applePosition.x < myHead.x) {
            return "LEFT";
        } else if (applePosition.y > myHead.y) {
            return "DOWN";
        } else {
            return "UP";
        }
    } else {
        // Add more logic here for other scenarios
    }
}

// Usage in the game loop (in controller.js or snake.js):
// var bot = new Bot(playerSnake, enemySnake, apple);
// var move = bot.decideMove();
// playerSnake.turn(move);

