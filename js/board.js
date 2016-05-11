var Board = function (dimX, dimY) {
  this.dimX = dimX;
  this.dimY = dimY;

  // enter start coordinates as an array - [i, j]
  var player1StartPos = [Math.floor(dimY/2), Math.floor(3*dimX/4)] ;
  this.player1 = new Bike(this, player1StartPos, "W");

  var computerStartPos = [Math.floor(dimY/2), Math.floor(dimX/4)];
  this.computer = new Bike(this, computerStartPos, "E");

  this.player1.opponent = this.computer;
  this.computer.opponent = this.player1;
};

Board.prototype.validPosition = function (coord) {
  return (coord.i >= 0 && coord.i < this.dimY) &&
         (coord.j >= 0 && coord.j < this.dimX);
};


// so linter doesn't yell at us
var Bike = Bike || {};
