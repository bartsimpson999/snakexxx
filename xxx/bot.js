function determineBotMove(game) {
  var mySnake = game.snakes[0]; // Tu sei snake 0
  var botSnake = game.snakes[1]; // Il bot è snake 1
  var food = game.food[0]; // Assumendo un solo cibo sul campo di gioco

  var gameWidth = game.width; // Assumendo che il gioco abbia una proprietà width
  var gameHeight = game.height; // Assumendo che il gioco abbia una proprietà height

  var obstacles = mySnake.body.concat(botSnake.body);
  var pathToFood = aStarSearch(botSnake.body[0], food, gameWidth, gameHeight, obstacles);
  var pathToTail = aStarSearch(botSnake.body[0], mySnake.body[mySnake.body.length - 1], gameWidth, gameHeight, obstacles);

  // Valuta i percorsi e scegli la mossa migliore
  // ... (resto del codice per valutare i percorsi e scegliere la mossa migliore)

  return bestDirection; // Restituisci la direzione scelta come migliore
}

function getNeighbors(pos, gameWidth, gameHeight) {
  var neighbors = [];
  var directions = [
    [0, -1], // north
    [0, 1],  // south
    [1, 0],  // east
    [-1, 0]  // west
  ];
  for (var i = 0; i < directions.length; i++) {
    var x = pos[0] + directions[i][0];
    var y = pos[1] + directions[i][1];
    if (x < 0) x = gameWidth - 1;
    if (x >= gameWidth) x = 0;
    if (y < 0) y = gameHeight - 1;
    if (y >= gameHeight) y = 0;
    neighbors.push([x, y]);
  }
  return neighbors;
}

function heuristic(pos, goal) {
  var dx = Math.abs(pos[0] - goal[0]);
  var dy = Math.abs(pos[1] - goal[1]);
  return dx + dy;
}

function aStarSearch(start, goal, gameWidth, gameHeight, obstacles) {
  var openSet = [start];
  var cameFrom = {};
  var gScore = {};
  var fScore = {};
  gScore[start] = 0;
  fScore[start] = heuristic(start, goal);

  while (openSet.length > 0) {
    var current = openSet.reduce((a, b) => fScore[a] < fScore[b] ? a : b);
    if (current[0] == goal[0] && current[1] == goal[1]) {
      return reconstructPath(cameFrom, current);
    }

    openSet = openSet.filter(cell => cell[0] != current[0] || cell[1] != current[1]);
    var neighbors = getNeighbors(current, gameWidth, gameHeight);

    for (var i = 0; i < neighbors.length; i++) {
      var neighbor = neighbors[i];
      if (obstacles.some(obstacle => obstacle[0] == neighbor[0] && obstacle[1] == neighbor[1])) {
        continue;
      }
      var tentativeGScore = gScore[current] + 1;
      if (!gScore[neighbor] || tentativeGScore < gScore[neighbor]) {
        cameFrom[neighbor] = current;
        gScore[neighbor] = tentativeGScore;
        fScore[neighbor] = gScore[neighbor] + heuristic(neighbor, goal);
        if (!openSet.some(cell => cell[0] == neighbor[0] && cell[1] == neighbor[1])) {
          openSet.push(neighbor);
        }
      }
    }
  }
  return null;
}

function reconstructPath(cameFrom, current) {
  var totalPath = [current];
  while (cameFrom[current]) {
    current = cameFrom[current];
    totalPath.unshift(current);
  }
  return totalPath;
}

