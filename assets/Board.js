/* ||||||     ||||    ||||||||||||    ||||||||||      ||||||||||||    ||||||
 * ||||||||  || ||    ||||    ||||    ||||||    ||    ||||||          ||||||
 * |||||| ||||  ||    ||||    ||||    ||||||    ||    ||||||          ||||||
 * ||||||  ||   ||    ||||    ||||    ||||||    ||    ||||||||||||    ||||||
 * ||||||       ||    ||||    ||||    ||||||    ||    ||||||          ||||||
 * ||||||       ||    ||||    ||||    ||||||    ||    ||||||          ||||||
 * ||||||       ||    ||||||||||||    ||||||||||      ||||||||||||    ||||||||||||
 */
/* ===============================================================================
                            Class Definition: "Board"
=============================================================================== */
function Board (pieceArray) {
	// Static values
	Board.BOARD_SIZE = 3;
	Board.BOARD_LENGTH = Board.BOARD_SIZE*Board.BOARD_SIZE;
	Board.FINAL_STATE = [1,2,3,4,5,6,7,8,0];

	// Attributes
	var board;
	var completeness;
	
	// Get
	this.getCompleteness = function () {return this.completeness;}



	// Methods

	/*/////////////////////////////////////////
				     Read-only
	/////////////////////////////////////////*/
	// [1] - Receives the value, finds it and returns the position
	this.find = function (value) {
		for (var k = 0; k < Board.BOARD_LENGTH; k++) {
			if (board[k] == value) {
				var remainder = value % Board.BOARD_SIZE;
				var	quotient  = (value - remainder) / Board.BOARD_SIZE;

				return {i:quotient, j:remainder};
			};
		};

		throw "Board.find(value): Not Found!";
	};

	// [2] - Receives the matrix-position and returns the value
	this.getSquare = function (i, j) {
		if ((i < 0) ||
			(j < 0) ||
			(i >= Board.BOARD_SIZE) ||
			(j >= Board.BOARD_SIZE)) {
			throw "Board.get(i,j): Out of board!";
		};

		return board[i*Board.BOARD_SIZE + j];
	};

	// [3] - Receives the linear position and returns the value
	this.get = function (k) {
		if ((i < 0) || (k >= Board.BOARD_LENGTH)) throw "Board.get(k): Out of board!";

		return board[k];
	};

	// [4] - Are these boards the same?
	this.equal = function (B2) {
		for (var k = 0; k < Board.BOARD_SIZE; k++) {
			if (board[k] != B2.get(k)) return false;
		};
		return true;
	};

	// [5] - Compares to final state
	this.final = function () {
		for (var k = 0; k < Board.BOARD_SIZE; k++) {
			if (board[k] != Board.FINAL_STATE[k]) return false;
		};
		return true;
	};


	///////// VALID MOVES /////////
	// [1] - UP leads to...?
	this.up = function () {
		var square = this.find(0);
		if (square.i > 0) {
			var nextBoard = new Board(board);

			// Swap 0 and the upper element
			nextBoard.setSquare(this.getSquare(i-1, j), square.i, square.j);
			nextBoard.setSquare(0, square.i-1, square.j);
			nextBoard.updateCompleteness();
		};
		return false;
	};

	// [2] - DOWN leads to...?
	this.down = function () {
		var square = this.find(0);
		if (square.i < BOARD_SIZE-1) {
			var nextBoard = new Board(board);

			// Swap 0 and the upper element
			nextBoard.setSquare(this.getSquare(i+1, j), square.i, square.j);
			nextBoard.setSquare(0, square.i+1, square.j);
			nextBoard.updateCompleteness();
		};
		return false;
	};

	// [3] - LEFT leads to...?
	this.left = function () {
		var square = this.find(0);
		if (square.j > 0) {
			var nextBoard = new Board(board);

			// Swap 0 and the upper element
			nextBoard.setSquare(this.getSquare(i, j-1), square.i, square.j);
			nextBoard.setSquare(0, square.i, square.j-1);
			nextBoard.updateCompleteness();
		};
		return false;
	};

	// [4] - RIGHT leads to...?
	this.right = function () {
		var square = this.find(0);
		if (square.j < BOARD_SIZE-1) {
			var nextBoard = new Board(board);

			// Swap 0 and the upper element
			nextBoard.setSquare(this.getSquare(i, j+1), square.i, square.j);
			nextBoard.setSquare(0, square.i, square.j+1);
			nextBoard.updateCompleteness();
		};
		return false;
	};


	/*/////////////////////////////////////////
				       Write
	/////////////////////////////////////////*/
	// [1] - Sets the value of a square
	this.setSquare = function (value, i, j) {
		if ((i < 0) ||
			(j < 0) ||
			(i >= Board.BOARD_SIZE) ||
			(j >= Board.BOARD_SIZE)) {
			throw "Board.get(i,j): Out of board!";
		};
		board[(i-1)*Board.BOARD_SIZE + j-1] = value;
	};

	// [2] - Receives a data array and sets the board with it
	this.setBoard = function (pieceArray) {
		var presenceList = [0, 0, 0, 0, 0, 0, 0, 0, 0];

		for (var i = 0; i < pieceArray.length; i++) presenceList[pieceArray]++;

		for (var i = 0; i < presenceList.length; i++) {
			if (presenceList[i] != 1) throw "Board.setBoard: Invalid input array!";
		};
			
		board = pieceArray;
	};

	// [3] - Receives two values, finds their squares and SWAPS them
	this.swap = function (Va, Vb) {
		var _A = this.find(Va);
		var _B = this.find(Vb);

		this.setSquare(Vb, _A.i, _A.j);
		this.setSquare(Va, _B.i, _B.j);
	};

	// [4] - Distance to final state
	this.updateCompleteness = function () {
		var manhattanDist = 0;

		// Zero stays in the last square
		var square = this.find(0);
		manhattanDist += Math.abs( 4 - square.i - square.j);

		// And here, the others...
		for (var k = 0; k < Board.BOARD_LENGTH-1; k++) {
			square = this.find(k);
			var remainder = k % Board.BOARD_SIZE;
			var quotient = (k - remainder) / Board.BOARD_SIZE;
			manhattanDist += Math.abs( remainder + quotient - square.i - square.j);
		};

		this.completeness = manhattanDist;
	};



	// Constructor
	if (pieceArray.length != Board.BOARD_LENGTH) throw "Board constructor: Wrong Size!";
	board = pieceArray;
	this.updateCompleteness();
};

// Object comparison
Board.compare = function (B1, B2) {
	if (B1.completeness < B2.completeness) return -1;
	if (B1.completeness > B2.completeness) return  1;

	return 0;
};