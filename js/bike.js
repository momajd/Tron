var Coord = require('./coord');

var Bike = function (board, startPos, dir) {
  this.dir = dir;
  this.turning = false;
  this.board = board;
  this.alive = true;
  this.opponent = null;

  var start = new Coord(startPos[0], startPos[1]);
  this.segments = [start];
};

Bike.DIFFS = {
  "N": new Coord(-1, 0),
  "E": new Coord(0, 1),
  "S": new Coord(1, 0),
  "W": new Coord(0, -1)
};

Bike.prototype.isOccupying = function (coord) {
  var result = false;
  this.segments.forEach(function (segment) {
    if (segment.equals(coord)) {
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

  // check boundaries on board
  if (!this.board.validPosition(head)) {
    return false;
  }

  // check if bike runs into itself
  for (var i = 0; i < this.segments.length - 1; i++) {
    if (this.segments[i].equals(head)) {
      return false;
    }
  }

  // check if bike runs into opponent
  if (this.opponent.isOccupying(head)) {
    return false;
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
  // don't allow user to turn directly around in opposite direction
  if (Bike.DIFFS[dir].isOpposite(Bike.DIFFS[this.dir]) || this.turning) {
    return;
  } else {
    this.turning = true;
    this.dir = dir;
  }
};

Bike.prototype.computerMove = function () {
  //
};

module.exports = Bike;
