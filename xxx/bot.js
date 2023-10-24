function determineBotMove(game) {
  // ... (resto del codice rimane invariato)
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

  // Aumenta il punteggio se la mossa porta il bot più vicino al cibo
  var distanceToFood = getDistance(newPos, food, game.width, game.height);
  score -= distanceToFood * 1.5; // Diamo la massima priorità al cibo

  // Aumenta il punteggio se la mossa porta il bot a prendere la coda del giocatore
  var distanceToTail = getDistance(newPos, mySnake.body[mySnake.body.length - 1], game.width, game.height);
  score -= distanceToTail; // La coda ha una priorità intermedia

  // Aumenta il punteggio se la mossa porta il bot a colpire la testa del giocatore
  var distanceToHead = getDistance(newPos, mySnake.body[0], game.width, game.height);
  if (distanceToHead == 1) {
    score += 50; // Colpire la testa ha la priorità più bassa
  }

  // Se il bot sta seguendo la coda del giocatore e il giocatore sta per prendere il cibo, riduci il punteggio
  if (distanceToTail == 1 && distanceToFood <= 1) {
    score -= 200;
  }

  return score;
}

function simulateMove(pos, direction, width, height) {
  // ... (resto del codice rimane invariato)
}

function getDistance(pos1, pos2, width, height) {
  // ... (resto del codice rimane invariato)
}

function isCollision(pos, snake) {
  // ... (resto del codice rimane invariato)
}


