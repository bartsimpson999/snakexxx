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

  // Simula il movimento del bot in una certa direzione
  var newPos = simulateMove(botSnake.body[0], direction, game.width, game.height);

  // Controlla se la nuova posizione causerà una collisione
  if (isCollision(newPos, mySnake) || isCollision(newPos, botSnake)) {
    return -Infinity; // mossa non valida
  }

  var score = 0;

  // Aumenta il punteggio se la mossa porta il bot più vicino al cibo
  var distanceToFood = getDistance(newPos, food, game.width, game.height);
  score -= distanceToFood;

  // Aumenta il punteggio se la mossa porta il bot a prendere la coda del giocatore
  var distanceToTail = getDistance(newPos, mySnake.body[mySnake.body.length - 1], game.width, game.height);
  score -= distanceToTail * 0.5; // la coda è meno prioritaria rispetto al cibo

  // Aumenta il punteggio se la mossa porta il bot a colpire la testa del giocatore
  var distanceToHead = getDistance(newPos, mySnake.body[0], game.width, game.height);
  if (distanceToHead == 1) {
    score += 100; // colpire la testa è molto vantaggioso
  }

  // Se il bot sta seguendo la coda del giocatore e il giocatore sta per prendere il cibo, riduci il punteggio
  if (distanceToTail == 1 && distanceToFood <= 1) {
    score -= 200; // penalizza fortemente questa mossa
  }

  return score;
}

function simulateMove(pos, direction, width, height) {
  var newPos = pos.slice();
  if (direction == "north") {
    newPos[1]--;
    if (newPos[1] < 0) newPos[1] = height - 1;
  }
  if (direction == "south") {
    newPos[1]++;
    if (newPos[1] >= height) newPos[1] = 0;
  }
  if (direction == "east") {
    newPos[0]++;
    if (newPos[0] >= width) newPos[0] = 0;
  }
  if (direction == "west") {
    newPos[0]--;
    if (newPos[0] < 0) newPos[0] = width - 1;
  }
  return newPos;
}

function getDistance(pos1, pos2, width, height) {
  var dx = Math.abs(pos1[0] - pos2[0]);
  var dy = Math.abs(pos1[1] - pos2[1]);
  // Considera la possibilità di attraversare il bordo
  dx = Math.min(dx, width - dx);
  dy = Math.min(dy, height - dy);
  return dx + dy;
}

function isCollision(pos, snake) {
  for (var i = 0; i < snake.body.length; i++) {
    if (pos[0] == snake.body[i][0] && pos[1] == snake.body[i][1]) {
      return true;
    }
  }
  return false;
}






