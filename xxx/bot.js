function determineBotMove(game) {
  var botSnake = game.snakes[1];
  var playerSnake = game.snakes[0];
  var food = game.food[0];

  var directions = ["north", "south", "east", "west"];
  var bestDirection = null;
  var bestScore = -Infinity;

  directions.forEach(function(direction) {
    var score = evaluateMove(direction, game);
    if (score > bestScore) {
      bestScore = score;
      bestDirection = direction;
    }
  });

  return bestDirection;
}

function evaluateMove(direction, game) {
  var botSnake = game.snakes[1];
  var playerSnake = game.snakes[0];
  var food = game.food[0];

  var newPos = simulateMove(botSnake.body[0], direction);

  // Evita collisioni
  if (isCollision(newPos, botSnake) || isCollision(newPos, playerSnake) || isOutOfBounds(newPos, game.boardSize)) {
    return -Infinity;
  }

  var score = 0;

  // Priorità al cibo
  var distanceToFood = manhattanDistance(newPos, food);
  score -= distanceToFood * 2;

  // Evita di intrappolarsi
  if (willTrapItself(newPos, botSnake, game.boardSize)) {
    score -= 100;
  }

  // Cerca di tagliare la strada al giocatore
  var distanceToPlayerHead = manhattanDistance(newPos, playerSnake.body[0]);
  if (distanceToPlayerHead < botSnake.body.length && botSnake.body.length > playerSnake.body.length) {
    score += 50;
  }

  // Evita di avvicinarsi troppo alla testa del giocatore se è più lungo
  if (distanceToPlayerHead === 1 && playerSnake.body.length >= botSnake.body.length) {
    score -= 200;
  }

  return score;
}

function simulateMove(pos, direction) {
  var newPos = pos.slice();
  if (direction === "north") newPos[1]--;
  if (direction === "south") newPos[1]++;
  if (direction === "east") newPos[0]++;
  if (direction === "west") newPos[0]--;
  return newPos;
}

function isCollision(pos, snake) {
  return snake.body.some(segment => pos[0] === segment[0] && pos[1] === segment[1]);
}

function isOutOfBounds(pos, boardSize) {
  return pos[0] < 0 || pos[0] >= boardSize || pos[1] < 0 || pos[1] >= boardSize;
}

function manhattanDistance(pos1, pos2) {
  return Math.abs(pos1[0] - pos2[0]) + Math.abs(pos1[1] - pos2[1]);
}

function willTrapItself(newPos, snake, boardSize) {
  var virtualSnake = {
    body: [newPos].concat(snake.body.slice(0, -1)),
    length: snake.length
  };

  var floodFill = (pos) => {
    if (isOutOfBounds(pos, boardSize) || isCollision(pos, virtualSnake)) {
      return 0;
    }
    virtualSnake.body.unshift(pos);
    var count = 1;
    count += floodFill([pos[0] + 1, pos[1]]);
    count += floodFill([pos[0] - 1, pos[1]]);
    count += floodFill([pos[0], pos[1] + 1]);
    count += floodFill([pos[0], pos[1] - 1]);
    return count;
  };

  var freeSpace = floodFill(newPos);
  return freeSpace < snake.length;
}






