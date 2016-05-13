
var View = function($el) {
  this.$el = $el;

  this.board = new Board(100, 70);
  this.setupGrid();
};

View.prototype.startGame = function () {
  this.intervalId = window.setInterval(
    this.step.bind(this),
    30 //milliseconds; change if necessary
  );

  $(window).on("keydown", this.handleKeyEvent.bind(this));
};

View.KEYS = {
  38: "N",
  39: "E",
  40: "S",
  37: "W"
};

View.prototype.handleKeyEvent = function (event) {
  if (View.KEYS[event.keyCode]) {
    this.board.player1.turn(View.KEYS[event.keyCode]);
  } else {
    // ignore other keys, or maybe have pause button?
  }
};

View.prototype.setupGrid = function () {
  var html = "";

  for (var i = 0; i < this.board.dimY; i++) {
    html += "<ul>";
    for (var j = 0; j < this.board.dimX; j++) {
      html += "<li></li>";
    }
    html += "</ul>";
  }

  this.$el.html(html);
  this.$li = this.$el.find("li");
};

View.prototype.step = function () {
  if (this.board.player1.alive && this.board.computer.alive) {
    this.board.player1.move();
    this.board.computer.computerMove();
    this.render();
  } else {
    window.clearInterval(this.intervalId);
    $('#replay').show();

    if (this.checkWinner() === "Player 1") {
      $('#player1-win').show();
    } else {
      $('#computer-win').show();
    }
  }
};

View.prototype.render = function () {
  this.updateClasses(this.board.player1.segments, "player");
  this.updateClasses(this.board.computer.segments, "computer");
};

View.prototype.updateClasses = function (coords, className) {
  // find the index of each coord that will be in the jQuery array of li elements
  var self = this;
  coords.forEach(function(coord) {
    var coordIdx = (coord.i * self.board.dimX) + coord.j;
    self.$li.eq(coordIdx).addClass(className);
  });
};

View.prototype.checkWinner = function() {
  if (!this.board.player1.alive) {
    return "Computer";
  } else {
    return "Player 1";
  }
};

// so linter doesn't yell at us
var Board = Board || {};
