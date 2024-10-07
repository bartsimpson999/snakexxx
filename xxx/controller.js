function Controller() {
  this.game = new Game(50);
  this.canvas = document.getElementById('canvas');
  this.context = canvas.getContext('2d');
  this.lastDirection = null; // Aggiungiamo questa variabile per tracciare l'ultima direzione
}

Controller.prototype.drawCircle = function (pos, color) {
  this.context.beginPath();
  this.context.arc(10 * pos[0] + 5, 10 * pos[1] + 5, 5, 0, Math.PI * 2, false);
  this.context.fillStyle = color;
  this.context.fill();
}

Controller.prototype.turn = function (keyCode) {
  console.log(keyCode);
  let newDirection;

  switch (keyCode) {
    case 37: newDirection = "west"; break;
    case 38: newDirection = "north"; break;
    case 39: newDirection = "east"; break;
    case 40: newDirection = "south"; break;
    case 65: newDirection = "west"; break;
    case 87: newDirection = "north"; break;
    case 68: newDirection = "east"; break;
    case 83: newDirection = "south"; break;
    default: return; // Ignora altri tasti
  }

  // Previeni movimenti in diagonale
  if (this.lastDirection) {
    const oppositeDirections = {
      "north": "south",
      "south": "north",
      "east": "west",
      "west": "east"
    };
    if (newDirection !== this.lastDirection && newDirection !== oppositeDirections[this.lastDirection]) {
      return; // Ignora il movimento diagonale
    }
  }

  // Applica la nuova direzione al serpente appropriato
  if ([37, 38, 39, 40].includes(keyCode)) {
    this.game.snakes[0].turn(newDirection);
    this.lastDirection = newDirection;
  } else if ([65, 87, 68, 83].includes(keyCode)) {
    this.game.snakes[1].turn(newDirection);
  }
}

Controller.prototype.render = function () {
  var controller = this;
  controller.clear();

  controller.drawCircle(this.game.snakes[0].body[0], 'blue');
  _.each(this.game.snakes[0].body.slice(1), function (el) {
    controller.drawCircle(el, 'red');
  });
  _.each(this.game.snakes[0].body.slice(-1), function (el) {
    controller.drawCircle(el, 'yellow');
  });

  controller.drawCircle(this.game.snakes[1].body[0], 'red');
  _.each(this.game.snakes[1].body.slice(1), function (el) {
    controller.drawCircle(el, 'blue');
  });
  _.each(this.game.snakes[1].body.slice(-1), function (el) {
    controller.drawCircle(el, 'yellow');
  });

  _.each(this.game.food, function (el) {
    controller.drawCircle(el, 'yellow');
  });
  controller.drawScore();
}

Controller.prototype.clear = function () {
  this.context.clearRect(0, 0, 500, 500);
}

Controller.prototype.addHandler = function () {
  var controller = this;
  $('html').keydown(function (event) {
    controller.turn(event.keyCode);
  });
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
  context.font = "bold 20px zapfino";
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
  var botMove = determineBotMove(controller.game);
  if (botMove) {
    controller.game.snakes[1].turn(botMove);
  }
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
    if (lostText == "Tie game!") {
      controller.runLoop();
    } else {
      controller.drawPrompt(lostText + " Click to Restart.", "red");
      $('#canvas').on('click', () => {
        window.location.reload()
      });
    }
    controller.reset();
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
  const baseSpeed = 200; // Velocità di base più lenta
  const minSpeed = 50; // Velocità minima
  const speedReduction = 1; // Riduzione di velocità per ogni punto
  
  const totalLength = this.game.snakes[0].length + this.game.snakes[1].length;
  const speed = Math.max(baseSpeed - totalLength * speedReduction, minSpeed);
  
  return speed;
}

$(function () {
  var controller = new Controller()
  console.log(controller.game.snakes);
  controller.addHandler();
  controller.addStartHandler();
  controller.drawPrompt("Start Game", "#818267");
});
