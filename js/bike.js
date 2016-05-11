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

Bike.prototype.isValid = function(coord) {
  // check boundaries on board
  if (!this.board.validPosition(coord)) {
    return false;
  }
  // check if bike runs into itself
  for (var i = 0; i < this.segments.length - 1; i++) {
    if (this.segments[i].equals(coord)) {
      return false;
    }
  }
  // check if bike runs into opponent
  if (this.opponent.isOccupying(coord)) {
    return false;
  }
  return true;
};

Bike.prototype.move = function () {
  var nextCoord = this.head().plus(Bike.DIFFS[this.dir]);
  this.segments.push(nextCoord);

  this.turning = false;
  if (!this.isValid(nextCoord) ) {
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

// for AI only
Bike.prototype.computerChangeDir = function () {
  var turningDirs;
  if (this.dir === "N" || this.dir === "S") {
    turningDirs = ["W", "E"];
  } else {
    turningDirs = ["N", "S"];
  }

  // check if first turning move leads to crash
  // var firstTurn = turningDirs[0];
  // var firstTurnCount = 0;
  // var firstTurnCoord = this.head().plus(Bike.DIFFS[])
  // var secondTurn = turningDirs[1];
  // var secondTurnCount = 0;


};

Bike.prototype.computerMove = function () {
  var nextCoord = this.head().plus(Bike.DIFFS[this.dir]);

  if (this.isValid(nextCoord)) {
    this.segments.push(nextCoord);
  } else {
    nextCoord = this.head().plus(Bike.DIFFS[this.dir]);
    // check if the turned direction still causes collision
    if (!this.isValid(nextCoord)) {
      this.computerChangeDir();

    }
    this.segments.push(nextCoord);
  }

  // if still invalid the computer lost
  if (!this.isValid(nextCoord)) {
    this.alive = false;
  }
};


module.exports = Bike;


// Old, possibly use for easy level
// Bike.prototype.computerChangeDir = function () {
//   var turningDirs;
//   if (this.dir === "N" || this.dir === "S") {
//     turningDirs = ["W", "E"];
//   } else {
//     turningDirs = ["N", "S"];
//   }
//
//   var randomIdx = Math.floor((Math.random()*2));
//   this.dir = turningDirs[randomIdx];
// };
