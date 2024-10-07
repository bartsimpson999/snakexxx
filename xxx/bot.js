function determineBotMove(game) {
  const botSnake = game.snakes[1];
  const playerSnake = game.snakes[0];
  const food = game.food[0];
  const boardSize = game.boardSize;

  const directions = ["north", "south", "east", "west"];
  let bestDirection = null;
  let bestScore = -Infinity;

  for (const direction of directions) {
    const newHead = simulateMove(botSnake.body[0], direction);
    
    if (isValidMove(newHead, boardSize, botSnake, playerSnake)) {
      const score = evaluateMove(newHead, food, playerSnake, botSnake, boardSize);
      if (score > bestScore) {
        bestScore = score;
        bestDirection = direction;
      }
    }
  }

  return bestDirection || directions[Math.floor(Math.random() * directions.length)];
}

function simulateMove(pos, direction) {
  const [x, y] = pos;
  switch (direction) {
    case "north": return [x, y - 1];
    case "south": return [x, y + 1];
    case "east": return [x + 1, y];
    case "west": return [x - 1, y];
  }
}

function isValidMove(pos, boardSize, botSnake, playerSnake) {
  const [x, y] = pos;
  if (x < 0 || x >= boardSize || y < 0 || y >= boardSize) return false;
  if (botSnake.body.some(segment => segment[0] === x && segment[1] === y)) return false;
  if (playerSnake.body.some(segment => segment[0] === x && segment[1] === y)) return false;
  return true;
}

function evaluateMove(newHead, food, playerSnake, botSnake, boardSize) {
  let score = 0;

  // Distanza dal cibo
  const distanceToFood = manhattanDistance(newHead, food);
  score += (boardSize * 2 - distanceToFood) * 2;

  // Evita di colpire se stesso
  if (botSnake.body.some(segment => segment[0] === newHead[0] && segment[1] === newHead[1])) {
    score -= 1000;
  }

  // Evita di colpire il giocatore (tranne la coda)
  if (playerSnake.body.slice(0, -1).some(segment => segment[0] === newHead[0] && segment[1] === newHead[1])) {
    score -= 500;
  }

  // Prova a prendere la coda del giocatore
  const playerTail = playerSnake.body[playerSnake.body.length - 1];
  const distanceToPlayerTail = manhattanDistance(newHead, playerTail);
  if (distanceToPlayerTail === 0) {
    score += 300;
  } else {
    score += (boardSize * 2 - distanceToPlayerTail);
  }

  // Evita di rimanere intrappolato
  const freeSpaces = countFreeSpaces(newHead, boardSize, botSnake, playerSnake);
  score += freeSpaces * 5;

  return score;
}

function manhattanDistance(pos1, pos2) {
  return Math.abs(pos1[0] - pos2[0]) + Math.abs(pos1[1] - pos2[1]);
}

function countFreeSpaces(pos, boardSize, botSnake, playerSnake) {
  const directions = [[0, 1], [1, 0], [0, -1], [-1, 0]];
  let count = 0;

  for (const [dx, dy] of directions) {
    const newPos = [pos[0] + dx, pos[1] + dy];
    if (isValidMove(newPos, boardSize, botSnake, playerSnake)) {
      count++;
    }
  }

  return count;
}

window.determineBotMove = determineBotMove;






