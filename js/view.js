var Board = require('./board');

var View = function($el) {
  this.$el = $el;

  this.board = new Board(100);
  this.setupGrid();

  this.intervalId = window.setInterval(
    this.step.bind(this),
    25 //milliseconds; change if necessary
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

  for (var i = 0; i < this.board.dim; i++) {
    html += "<ul>";
    for (var j = 0; j < this.board.dim; j++) {
      html += "<li></li>";
    }
    html += "</ul>";
  }

  this.$el.html(html);
  this.$li = this.$el.find("li");
};

View.prototype.step = function () {
  if (this.board.player1.alive) {
    this.board.player1.move();
    this.render();
  } else {
    // TODO display winner with CSS instead of alert
    // alert("come on man");
    window.clearInterval(this.intervalId);
  }
};

View.prototype.render = function () {
  this.updateClasses(this.board.player1.segments, "bike");
};

View.prototype.updateClasses = function (coords, className) {
  this.$li.filter("." + className).removeClass();

  // find the index of each coord that will be in the jQuery object
  var self = this;
  coords.forEach(function(coord) {
    var flatCoord = (coord.i * self.board.dim) + coord.j;
    self.$li.eq(flatCoord).addClass(className);
  });
};

// TODO
// View.prototype.checkWinner = function() {
//   if (!this.board.player1.alive) {
//    
//   }
// };

module.exports = View;
