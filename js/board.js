var Bike = require("./bike");

var Board = function (dim) {
  this.dim = dim;

  this.player1 = new Bike(this);
};

Board.BLANK_SYMBOL = ".";

Board.prototype.blankGrid = function (dim) {
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

Board.prototype.validPosition = function (coord) {
  return (coord.i > 0 && coord.i < this.dim) &&
         (coord.j > 0 && coord.j < this.dim);
};


// TODO remove if not being used
// Board.prototype.render = function () {
//   var grid = Board.blankGrid(this.dim);
//
//   this.player1.segments.forEach(function (segment) {
//     grid[segment.i][segment.j] = Bike.SYMBOL;
//   });
//
//   // join the grid into a big string
//   grid.map(function (row) {
//     return row.join("");
//   }).join("\n");
// };

module.exports = Board;
