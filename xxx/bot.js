function determineBotMove(game) {
  var mySnake = game.snakes[0];
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
  var mySnake = game.snakes[0];
  var botSnake = game.snakes[1];
  var food = game.food[0];

  var newPos = simulateMove(botSnake.body[0], direction, game.width, game.height);

  if (isCollision(newPos, mySnake) || isCollision(newPos, botSnake)) {
    return -Infinity;
  }

  var score = 0;

  score -= getDistance(newPos, food, game.width, game.height);
  score -= getDistance(newPos, mySnake.body[mySnake.body.length - 1], game.width, game.height) * 0.5;

  var distanceToHead = getDistance(newPos, mySnake.body[0], game.width, game.height);
  if (distanceToHead == 1) {
    score += 100;
  }

  if (distanceToTail == 1 && distanceToFood <= 1) {
    score -= 200;
  }

  return score;
}

function simulateMove(pos, direction, width, height) {
  var newPos = [...pos];
  switch (direction) {
    case "north":
      newPos[1]--;
      if (newPos[1] < 0) newPos[1] = height - 1;
      break;
    case "south":
      newPos[1]++;
      if (newPos[1] >= height) newPos[1] = 0;
      break;
    case "east":
      newPos[0]++;
      if (newPos[0] >= width) newPos[0] = 0;
      break;
    case "west":
      newPos[0]--;
      if (newPos[0] < 0) newPos[0] = width - 1;
      break;
  }
  return newPos;
}

function getDistance(pos1, pos2, width, height) {
  var dx = Math.abs(pos1[0] - pos2[0]);
  var dy = Math.abs(pos1[1] - pos2[1]);

  // Considera l'attraversamento del bordo
  dx = Math.min(dx, width - dx);
  dy = Math.min(dy, height - dy);

  return dx + dy;
}

function isCollision(pos, body) {
  return body.some(segment => segment[0] === pos[0] && segment[1] === pos[1]);
}


