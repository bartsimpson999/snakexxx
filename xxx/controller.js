function Controller() {
  this.game = new Game(50);
  this.canvas = document.getElementById('canvas');
  this.context = canvas.getContext('2d');
  this.mousePosition = { x: 250, y: 250 }; // Posizione iniziale al centro
  this.addMouseMoveHandler();
}

Controller.prototype.drawCircle = function (pos, color) {
  this.context.beginPath();
  this.context.arc(10 * pos[0] + 5, 10 * pos[1] + 5, 5, 0, Math.PI * 2, false);
  this.context.fillStyle = color;
  this.context.fill();
}

Controller.prototype.addMouseMoveHandler = function() {
  var controller = this;
  this.canvas.addEventListener('mousemove', function(event) {
    var rect = controller.canvas.getBoundingClientRect();
    controller.mousePosition = {
      x: Math.floor((event.clientX - rect.left) / 10),
      y: Math.floor((event.clientY - rect.top) / 10)
    };
  });
}

Controller.prototype.findShortestPath = function(start, end) {
  var dx = end.x - start[0];
  var dy = end.y - start[1];
  
  var possibleDirections = [];
  
  if (Math.abs(dx) > Math.abs(dy)) {
    possibleDirections.push(dx > 0 ? "east" : "west");
    possibleDirections.push(dy > 0 ? "south" : "north");
  } else {
    possibleDirections.push(dy > 0 ? "south" : "north");
    possibleDirections.push(dx > 0 ? "east" : "west");
  }
  
  return possibleDirections;
}

Controller.prototype.turn = function () {
  var playerSnake = this.game.snakes[0];
  var possibleDirections = this.findShortestPath(playerSnake.body[0], this.mousePosition);
  
  // Prova le direzioni in ordine di preferenza
  for (var i = 0; i < possibleDirections.length; i++) {
    if (playerSnake.turn(possibleDirections[i])) {
      break; // Direzione valida trovata
    }
  }

  // Bot logic remains unchanged
  var botMove = determineBotMove(this.game);
  if (botMove) {
    this.game.snakes[1].turn(botMove);
  }
}

Controller.prototype.render = function () {
  var controller = this;
  controller.clear();

  controller.drawCircle(this.game.snakes[0].body[0], 'blue');
  _.each(this.game.snakes[0].body.slice(1), function (el) {
    controller.drawCircle(el, 'lightblue');
  });

  controller.drawCircle(this.game.snakes[1].body[0], 'red');
  _.each(this.game.snakes[1].body.slice(1), function (el) {
    controller.drawCircle(el, 'pink');
  });

  _.each(this.game.food, function (el) {
    controller.drawCircle(el, 'yellow');
  });

  // Draw cursor position
  controller.drawCircle([this.mousePosition.x, this.mousePosition.y], 'green');

  controller.drawScore();
}

Controller.prototype.clear = function () {
  this.context.clearRect(0, 0, 500, 500);
}

Controller.prototype.addHandler = function () {
  // We don't need keyboard handlers anymore
}

Controller.prototype.drawScore = function () {
  var context = this.context;
  context.font = "bold 12px sans-serif";
  context.textAlign = "left";
  context.fillStyle = "blue";
  context.fillText("Score: " + this.game.snakes[0].length, 435, 15);
  context.fillStyle = "red";
  context.fillText("Score: " + this.game.snakes[1].length, 435, 40);
}

Controller.prototype.drawPrompt = function (text, color) {
  var context = this.context;
  context.font = "bold 20px Arial";
  context.textAlign = "center";
  context.textBaseline = "middle";
  context.fillStyle = color;
  context.fillText(text, 250, 250);
}

Controller.prototype.addStartHandler = function () {
  var controller = this;
  $('#canvas').on('click', function () {
    controller.runLoop();
    $(this).off('click');
  });
}

Controller.prototype.runStep = function () {
  var controller = this;
  controller.turn();
  controller.game.step();
  controller.render();
  if (!controller.game.lose()) {
    controller.runLoop();
  } else {
    var losers = controller.game.lose();
    var lostText = "";
    if (losers !== -1) {
      lostText = "Player " + losers + " loses!";
    } else {
      lostText = "Tie game!"
    }
    if (lostText == "Tie game!")
      controller.runLoop();
    else controller.drawPrompt(lostText + " Click to Restart.", "red");
    if (lostText == "Player " + losers + " loses!") {
      $('#canvas').on('click', () => {
        window.location.reload()
      });
    }
    controller.game.randomCoord();
    controller.reset();
    console.log("-------------->")
    controller.addStartHandler();
  }
}

Controller.prototype.reset = function () {
  this.game = new Game(50);
}

Controller.prototype.runLoop = function () {
  var controller = this;

  window.setTimeout(function () {
    controller.runStep();
  }, controller.stepTime());
}

Controller.prototype.stepTime = function () {
  return 125 - this.game.snakes[0].length - this.game.snakes[1].length;
}

$(function () {
  var controller = new Controller()
  console.log(controller.game.snakes);
  controller.addStartHandler();
  controller.drawPrompt("Click to Start", "#818267");
});
