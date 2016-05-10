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
  this.alive = true;

  var start = new Coord(Math.floor(board.dim/2), Math.floor(3 * board.dim/4));
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
  var head = this.head();

  if (!this.board.validPosition(head)) {
    return false;
  }

  // check if bike runs into itself
  for (var i = 0; i < this.segments.length - 1; i++) {
    if (this.segments[i].equals(head)) {
      return false;
    }
  }
  return true;
};

// USE WHEN CHECKING COLLISIONS WITH OTHER PLAYER
// Bike.prototype.segmentsContain = function (coord) {
//   var contains = false;
//   this.segments.forEach(function(segment) {
//     if (segment.equals(coord) ) {
//       contains = true;
//     }
//   });
//   return contains;
// };

// Bike.prototype.checkCollision = function() {
//   var head = this.head();
//   TODO
// };

Bike.prototype.move = function () {
  var newCoord = this.head().plus(Bike.DIFFS[this.dir]);
  this.segments.push(newCoord);

  this.turning = false;
  if (!this.isValid() ) {
    this.alive = false;
  }
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
