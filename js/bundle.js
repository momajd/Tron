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
	
	  this.board = new Board(100);
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
	    this.board.bike.turn(View.KEYS[event.keyCode]);
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
	  if (this.board.bike.alive) {
	    this.board.bike.move();
	    this.render();
	  } else {
	    // TODO display winner with CSS instead of alert
	    // alert("come on man");
	    window.clearInterval(this.intervalId);
	  }
	};
	
	View.prototype.render = function () {
	  this.updateClasses(this.board.bike.segments, "bike");
	};
	
	View.prototype.updateClasses = function (coords, className) {
	  this.$li.filter("." + className).removeClass();
	
	  // find the index of each coord that will be in the jQuery object
	  var self = this;
	  coords.forEach(function(coord) {
	    var flatCoord = (coord.i * self.board.dim) + coord.j;
	    self.$li.eq(flatCoord).addClass(className);
	  });
	};
	
	// TODO
	// View.prototype.checkWinner = function() {
	//   if (!this.board.bike.alive) {
	//     alert("You Lost!!");
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


/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	var Bike = __webpack_require__(2);
	
	var Board = function (dim) {
	  this.dim = dim;
	
	  this.bike = new Bike(this);
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
	//   this.bike.segments.forEach(function (segment) {
	//     grid[segment.i][segment.j] = Bike.SYMBOL;
	//   });
	//
	//   // join the grid into a big string
	//   grid.map(function (row) {
	//     return row.join("");
	//   }).join("\n");
	// };
	
	module.exports = Board;


/***/ }
/******/ ]);
//# sourceMappingURL=bundle.js.map