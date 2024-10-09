function determineBotMove(game) {
  var botSnake = game.snakes[1];
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
  var food = game.food[0];

  var newPos = simulateMove(botSnake.body[0], direction);

  // Evita collisioni
  if (isCollision(newPos, botSnake) || isOutOfBounds(newPos, game.boardSize)) {
    return -Infinity;
  }

  var score = 0;

  // Priorità al cibo
  var distanceToFood = manhattanDistance(newPos, food);
  score -= distanceToFood;

  // Evita di intrappolarsi
  if (willTrapItself(newPos, botSnake, game)) {
    score -= 1000;
  }

  // Premia i movimenti che portano verso spazi aperti
  score += evaluateOpenSpace(newPos, game);

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

function willTrapItself(newPos, snake, game) {
  var virtualSnake = {
    body: [newPos].concat(snake.body.slice(0, -1)),
    length: snake.length
  };

  var floodFill = (pos, depth) => {
    if (depth > 10) return 0; // Limita la profondità della ricorsione
    if (isOutOfBounds(pos, game.boardSize) || isCollision(pos, virtualSnake)) {
      return 0;
    }
    virtualSnake.body.unshift(pos);
    var count = 1;
    count += floodFill([pos[0] + 1, pos[1]], depth + 1);
    count += floodFill([pos[0] - 1, pos[1]], depth + 1);
    count += floodFill([pos[0], pos[1] + 1], depth + 1);
    count += floodFill([pos[0], pos[1] - 1], depth + 1);
    return count;
  };

  var freeSpace = floodFill(newPos, 0);
  return freeSpace < snake.length * 2; // Aumentato il fattore di spazio libero
}

function evaluateOpenSpace(pos, game) {
  var directions = [[1, 0], [-1, 0], [0, 1], [0, -1]];
  var openSpaces = 0;

  directions.forEach(function(dir) {
    var newPos = [pos[0] + dir[0], pos[1] + dir[1]];
    if (!isOutOfBounds(newPos, game.boardSize) && !isCollision(newPos, game.snakes[1])) {
      openSpaces++;
    }
  });

  return openSpaces * 10; // Premia di più gli spazi aperti
}
