/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/js/";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	var View = __webpack_require__(1);
	
	$(function () {
	  var rootEl = $('.tron-game');
	  new View(rootEl);
	});


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	var Board = __webpack_require__(2);
	
	var View = function($el) {
	  this.$el = $el;
	
	  this.board = new Board(100, 70);
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
	
	  for (var i = 0; i < this.board.dimY; i++) {
	    html += "<ul>";
	    for (var j = 0; j < this.board.dimX; j++) {
	      html += "<li></li>";
	    }
	    html += "</ul>";
	  }
	
	  this.$el.html(html);
	  this.$li = this.$el.find("li");
	};
	
	View.prototype.step = function () {
	  if (this.board.player1.alive && this.board.computer.alive) {
	    this.board.player1.move();
	    this.board.computer.computerMove();
	    this.render();
	  } else {
	    // TODO display winner with CSS instead of alert
	    // alert("come on man");
	    window.clearInterval(this.intervalId);
	  }
	};
	
	View.prototype.render = function () {
	  this.updateClasses(this.board.player1.segments, "player");
	  this.updateClasses(this.board.computer.segments, "computer");
	};
	
	View.prototype.updateClasses = function (coords, className) {
	  // find the index of each coord that will be in the jQuery object
	  var self = this;
	  coords.forEach(function(coord) {
	    var flatCoord = (coord.i * self.board.dimX) + coord.j;
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


/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	var Bike = __webpack_require__(3);
	
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
	
	module.exports = Board;


/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	var Coord = __webpack_require__(4);
	
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
	
	  // decide the turn to make based on the length of the open path
	  var firstDir = turningDirs[0];
	  var firstDirPathCount = 0; //for counting the open spaces on this path
	  var firstDirCoord = this.head().plus(Bike.DIFFS[firstDir]);
	
	  while (this.isValid(firstDirCoord)) {
	    firstDirPathCount += 1;
	    // go to next coord and see if it is free
	    firstDirCoord = firstDirCoord.plus(Bike.DIFFS[firstDir]);
	  }
	
	  var secondDir = turningDirs[1];
	  var secondDirPathCount = 0;
	  var secondDirCoord = this.head().plus(Bike.DIFFS[secondDir]);
	
	  while (this.isValid(secondDirCoord)) {
	    secondDirPathCount += 1;
	    secondDirCoord = secondDirCoord.plus(Bike.DIFFS[secondDir]);
	  }
	
	  // go with the direction that has the clearest path
	  if (firstDirPathCount > secondDirPathCount) {
	    this.dir = firstDir;
	  } else {
	    this.dir = secondDir;
	  }
	};
	
	Bike.prototype.computerMove = function () {
	  var nextCoord = this.head().plus(Bike.DIFFS[this.dir]);
	
	  // make a random turn once in awhile to seem more human-like
	  if (Math.random() > 0.98) {
	    this.computerChangeDir();
	  }
	
	  if (this.isValid(nextCoord)) {
	    this.segments.push(nextCoord);
	  } else {
	    this.computerChangeDir();
	    nextCoord = this.head().plus(Bike.DIFFS[this.dir]);
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


/***/ },
/* 4 */
/***/ function(module, exports) {

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
	
	module.exports = Coord;


/***/ }
/******/ ]);
//# sourceMappingURL=bundle.js.map