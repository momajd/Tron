var Bike = require("./bike");

var Board = function (dim) {
  this.dim = dim;

  this.bike = new Bike(this);
};

Board.BLANK_SYMBOL = ".";

Board.blankGrid = function (dim) {
  var grid = [];

  for (var i = 0; i < dim; i++) {
    var row = [];
    for (var j = 0; j < dim; j++) {
      row.push(Board.BLANK_SYMBOL);
    }
    grid.push(row);
  }
  grid.push(row);
};

Board.prototype.render = function () {
  var grid = Board.blankGrid(this.dim);

  this.bike.segments.forEach(function (segment) {
    grid[segment.i][segment.j] = Bike.SYMBOL;
  });

  // join the grid into a big string
  grid.map(function (row) {
    return row.join("");
  }).join("\n");
};

module.exports = Board;
