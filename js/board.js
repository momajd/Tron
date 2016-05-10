var Bike = require("./bike");

var Board = function (dim) {
  this.dim = dim;

  // enter start coordinates as an array - [i, j]
  var player1StartPos = [Math.floor(dim/2), Math.floor(3*dim/4)] ;
  this.player1 = new Bike(this, player1StartPos, "W");

  var computerStartPos = [Math.floor(dim/2), Math.floor(dim/4)];
  this.computer = new Bike(this, computerStartPos, "E");

  this.player1.opponent = this.computer;
  this.computer.opponent = this.player1;
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

module.exports = Board;
