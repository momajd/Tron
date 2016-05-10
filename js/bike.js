var Coord = function (i, j) {
  this.i = i;
  this.j = j;
};

Coord.prototype.equals = function (coord2) {
  return (this.i === coord2.i) && (this.j === coord2.j);
};

Coord.prototype.plus = function (coord2) {
  // use to find new position of the bike on each move
  return new Coord(this.i + coord2.i, this.j + coord2.j);
};

Coord.prototype.isOpposite = function (coord2) {
  // use to prevent bike from turning around on itself
  return (this.i === (-1 * coord2.i) && this.j === (-1 * coord2.j));
};

var Bike = function (board) {
  this.dir = "W";
  this.turning = false;
  this.board = board;

  var start = new Coord(Math.floor(board.dim/2), Math.floor(board.dim/4));
  this.segments = [start];
};

Bike.DIFFS = {
  "N": new Coord(-1, 0),
  "E": new Coord(0, 1),
  "S": new Coord(1, 0),
  "W": new Coord(0, -1)
};

Bike.SYMBOL = "B";

Bike.prototype.isOccupying = function (array) {
  var result = false;
  this.segments.forEach(function (segment) {
    // TODO can we use the Coord.equals method?
    if (segment.i === array[0] && segment.j === array[1]) {
      result = true;
    }
  });
  return result;
};

Bike.prototype.head = function () {
  return this.segments[this.segments.length - 1];
};

Bike.prototype.isValid = function() {
  //
};

Bike.prototype.move = function () {
  var newCoord = this.head().plus(Bike.DIFFS[this.dir]);
  this.segments.push(newCoord);

  this.turning = false;

  // TODO check if collision
};

Bike.prototype.turn = function (dir) {
  // avoid turning directly back
  if (Bike.DIFFS[dir].isOpposite(Bike.DIFFS[this.dir]) || this.turning) {
    return;
  } else {
    this.turning = true;
    this.dir = dir;
  }
};

module.exports = Bike;
