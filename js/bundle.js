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

	var Board = __webpack_require__(3);
	
	var View = function($el) {
	  this.$el = $el;
	
	  this.board = new Board(80);
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
	
	  for (var i = 0; i < this.board.dim; i++) {
	    html += "<ul>";
	    for (var j = 0; j < this.board.dim; j++) {
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
	    this.board.computer.move();
	    this.render();
	  } else {
	    // TODO display winner with CSS instead of alert
	    // alert("come on man");
	    window.clearInterval(this.intervalId);
	  }
	};
	
	View.prototype.render = function () {
	  // debugger;
	  this.updateClasses(this.board.player1.segments, "player");
	  this.updateClasses(this.board.computer.segments, "computer");
	};
	
	View.prototype.updateClasses = function (coords, className) {
	
	  // find the index of each coord that will be in the jQuery object
	  var self = this;
	  coords.forEach(function(coord) {
	    var flatCoord = (coord.i * self.board.dim) + coord.j;
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
	
	var Bike = function (board, startPos, dir) {
	  this.dir = dir;
	  this.turning = false;
	  this.board = board;
	  this.alive = true;
	
	  var start = new Coord(startPos[0], startPos[1]);
	  this.segments = [start];
	};
	
	Bike.DIFFS = {
	  "N": new Coord(-1, 0),
	  "E": new Coord(0, 1),
	  "S": new Coord(1, 0),
	  "W": new Coord(0, -1)
	};
	
	// TODO: Is this used for anything?
	// Bike.prototype.isOccupying = function (array) {
	//   var result = false;
	//   this.segments.forEach(function (segment) {
	//     if (segment.i === array[0] && segment.j === array[1]) {
	//       result = true;
	//     }
	//   });
	//   return result;
	// };
	
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
	  // don't allow user to turn directly around in opposite direction
	  if (Bike.DIFFS[dir].isOpposite(Bike.DIFFS[this.dir]) || this.turning) {
	    return;
	  } else {
	    this.turning = true;
	    this.dir = dir;
	  }
	};
	
	Bike.prototype.computerMove = function () {
	  
	}
	
	module.exports = Bike;


/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	var Bike = __webpack_require__(2);
	
	var Board = function (dim) {
	  this.dim = dim;
	
	  // enter start coordinates as an array - [i, j]
	  var player1StartPos = [Math.floor(dim/2), Math.floor(3*dim/4)] ;
	  this.player1 = new Bike(this, player1StartPos, "W");
	
	  var computerStartPos = [Math.floor(dim/2), Math.floor(dim/4)];
	  this.computer = new Bike(this, computerStartPos, "E");
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


/***/ }
/******/ ]);
//# sourceMappingURL=bundle.js.map