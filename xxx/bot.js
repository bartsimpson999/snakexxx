function determineBotMove(game) {
  // Ottieni la posizione della testa del nostro serpente e del serpente nemico
  const ourSnakeHead = game.snakes[1].body[0];
  const enemySnakeHead = game.snakes[0].body[0];
  const enemySnakeTail = game.snakes[0].body[game.snakes[0].body.length - 1];
  const food = game.food[0];

  // Calcola la distanza tra la nostra testa e altri oggetti di interesse
  const distanceToEnemyHead = calculateDistance(ourSnakeHead, enemySnakeHead);
  const distanceToEnemyTail = calculateDistance(ourSnakeHead, enemySnakeTail);
  const distanceToFood = calculateDistance(ourSnakeHead, food);

  // Se la mela è la più vicina, dirigiti verso di essa
  if (distanceToFood < distanceToEnemyHead && distanceToFood < distanceToEnemyTail) {
    return getDirectionTowards(ourSnakeHead, food);
  }

  // Se la coda del nemico è la più vicina e accessibile, dirigiti verso di essa
  if (distanceToEnemyTail < distanceToEnemyHead) {
    return getDirectionTowards(ourSnakeHead, enemySnakeTail);
  }

  // Altrimenti, dirigiti verso la testa del nemico
  return getDirectionTowards(ourSnakeHead, enemySnakeHead);
}

function calculateDistance(coord1, coord2) {
  return Math.abs(coord1[0] - coord2[0]) + Math.abs(coord1[1] - coord2[1]);
}

function getDirectionTowards(from, to) {
  if (from[0] < to[0]) return "east";
  if (from[0] > to[0]) return "west";
  if (from[1] < to[1]) return "south";
  return "north";
}
