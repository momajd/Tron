var Board = require('./bike.js');

var View = function($el) {
  this.$el = $el;

  this.board = new Board(100);
  this.setupGrid();

  this.intervalId = window.setInterval(
    this.step.bind(this),
    25 //say 100ms, change if necessary
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
    this.board.bike.turn(View.KEYS[event.keyCode]);
  } else {
    // ignore other keys, or maybe have pause button?
  }
};

View.prototype.render = function () {
  this.updateClasses(this.board.bike.segments, "bike");
};

View.prototype.updateClasses = function (coords, className) {
  // TODO: review this; don't really know what's going on
  this.$li.filter("." + className).removeClass();

  var self = this;
  coords.forEach(function(coord) {
    var flatCoord = (coord.i * self.board.dim) + coord.j;
    self.$li.eq(flatCoord).addClass(className);
  });
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

// TODO review!
  this.$el.html(html);
  this.$li = this.$el.find("li");
};

View.prototype.step = function () {
  if (this.board.bike.segments.length > 0) {
    this.board.bike.move();
    this.render();
  } else {
    // TODO message for losing
  }
};

module.exports = View;
