function Game(boardSize) {
  this.boardSize = boardSize;
  this.snakes = this.makeSnakes(2);
  this.food = [this.randomCoord()];
  n = 0;
  k = 1;
}

Game.prototype.makeSnakes = function (number) {
  var snakes = [];
  var game = this;
  _.times(number, function () {
    snakes.push(new Snake(game.randomCoord1()));
  });
  return snakes;
}

Game.prototype.collision = function () {
  var bodies = [];
  var tag1 = [];
  var tag0 = [];
  for (var i = 0; i < this.snakes.length; i++) {
    bodies = bodies.concat(this.snakes[i].body.slice(1, this.snakes[i].length - 1));
    tag1 = tag1.concat(this.snakes[1].body.slice(this.snakes[1].length - 1));
    tag0 = tag0.concat(this.snakes[0].body.slice(this.snakes[0].length - 1));
  }
  var losers = [];
  if (includes(tag1, this.snakes[0].body[0])) this.snakes[0].length += 1;
  if (includes(tag0, this.snakes[1].body[0])) this.snakes[1].length += 1;
  if (includes(tag0, this.snakes[0].body[0])) losers.push(i);
  if (includes(tag1, this.snakes[1].body[0])) losers.push(i);
  else {
    for (var i = 0; i < this.snakes.length; i++) {
      if (includes(bodies, this.snakes[i].body[0])) {
        console.log("dat collision by " + i);
        losers.push(i + 1);
      }
    }
  }
  for (var i = 0; i < this.snakes.length - 1; i++) {
    if (compareCoord(this.snakes[i].body[0], this.snakes[i + 1].body[0])) {
      losers.push(i + 1, i + 2);
    }
  }
  return losers;
}

Game.prototype.loopSnakes = function (doThis) {
  var game = this;
  _.each(game.snakes, function (snake) {
    doThis.call(snake);
  });
}

Game.prototype.step = function () {
  this.loopSnakes(this.snakes[0].move);
  for (var i = 0; i < this.snakes.length; i++) {
    this.hitEdge(this.snakes[i]);
    if (this.hitFood(this.snakes[i])) {
      console.log('yum');
      this.snakes[i].eat();
      this.food.pop();
      this.generateFood(1);
    }
  }
}

var x = 0;
var y = 0;
Game.prototype.randomCoord = function () {
  y = this.snakes[0].length;
  x = this.snakes[1].length;

  return [Math.floor(Math.random() * this.boardSize),
  Math.floor(Math.random() * this.boardSize)];
}

var a = 0;
Game.prototype.randomCoord1 = function () {
  if (a == 0) {
    a = 1;
    return [1, 1];
  }
  if (a == 1) {
    a = 0;
    return [this.boardSize - 2, this.boardSize - 2];
  }
}

Game.prototype.generateFood = function (amount) {
  var game = this;
  _.times(amount, function () {
    newFood = game.randomCoord();
    while (_.include(game.snakes[0].body, newFood)) {
      newFood = game.randomCoord();
    }
    game.food.push(newFood);
  });
}

Game.prototype.hitFood = function (snake) {
  return includes(this.food, snake.body[0]);
}

Game.prototype.lose = function () {
  var collision = this.collision();
  if (collision.length) {
    console.log("pppppppppp", collision);
  }
  switch (collision.length) {
    case 0:
      return false;
    case 1:
      return collision[0];
    case 2:
      return -1;
  }
}

Game.prototype.hitEdge = function (snake) {
  snake.body[0][0] += this.boundsOneWay(snake.body[0][0]) * this.boardSize;
  snake.body[0][1] += this.boundsOneWay(snake.body[0][1]) * this.boardSize;
}

Game.prototype.exchange = function () {
  return console.log("--------->", this.snakes[1].length);
}

Game.prototype.boundsOneWay = function (position) {
  if (position < 0) {
    return 1;
  } else if (position >= this.boardSize) {
    return -1;
  } else {
    return 0;
  }
}

k = 0;
var aa = 0;
function Snake(start) {
  aa++;
  if (k == 0) this.length = 10;
  if (k == 1) {
    if (aa % 2 == 0) this.length = x + 1;
    else this.length = y + 1;
  }

  this.body = [start];
  this.oldDirection = [1, 0];
  this.direction = [-1, 0];
}

Snake.prototype.oroborus = function () {
  var head = this.body[0];
  return includes(this.body.slice(1), head);
}

var n = 0;
Snake.prototype.move = function () {
  n++;
  if (n == 1) this.direction = [1, 0];
  this.oldDirection = this.direction;
  var newPosition = this.addVector(this.body[0], this.direction);
  this.body.unshift(this.addVector(this.body[0], this.direction));
  if (this.body.length > this.length) {
    this.body.pop();
  }
}

Snake.prototype.eat = function () {
  this.length += 1;
}

Snake.prototype.addVector = function (position, vector) {
  return [position[0] + vector[0], position[1] + vector[1]];
}

Snake.prototype.turn = function (cardinals) {
  var newDirection;
  switch (cardinals) {
    case "east":
      newDirection = [1, 0];
      break;
    case "west":
      newDirection = [-1, 0];
      break;
    case "north":
      newDirection = [0, -1];
      break;
    case "south":
      newDirection = [0, 1];
      break;
  }

  // Verifica se la nuova direzione causerebbe una collisione immediata
  var newHead = this.addVector(this.body[0], newDirection);
  if (this.willCollideWithSelf(newHead)) {
    // Se la nuova direzione causa una collisione, mantieni la direzione corrente
    return false;
  }

  if (compareCoord(this.addVector(newDirection, this.oldDirection), [0, 0])) {
    return false;
  } else if (compareCoord(newDirection, this.oldDirection)) {
    return false;
  } else {
    this.direction = newDirection;
    return true;
  }
}

Snake.prototype.willCollideWithSelf = function(newHead) {
  // Verifica se la nuova posizione della testa colliderà con il corpo del serpente
  return this.body.slice(1).some(segment => compareCoord(newHead, segment));
}

var compareCoord = function (coord1, coord2) {
  if (coord1[0] === coord2[0] && coord1[1] === coord2[1]) {
    return true;
  }
  return false;
}

var includes = function (arr, target) {
  return _.some(arr, function (el) {
    return target[0] === el[0] && target[1] === el[1]
  });
}
