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
function Board (squareArray) {
	// Static values
	Board.BOARD_SIZE = 3;
	Board.BOARD_LENGTH = Board.BOARD_SIZE*Board.BOARD_SIZE;
	Board.FINAL_STATE = [1, 2, 3, 4, 5, 6, 7, 8, 0];

	// Attributes
	var boardArray;
	var completeness;
	
	// Get
	this.getBoard = function () {return this.boardArray.slice();};
	this.getCompleteness = function () {return this.completeness;};

	this.toString = function () {
		return (
			this.boardArray[0] + ", " + this.boardArray[1] + ", " + this.boardArray[2] + "\n " + 
			this.boardArray[3] + ", " + this.boardArray[4] + ", " + this.boardArray[5] + "\n " + 
			this.boardArray[6] + ", " + this.boardArray[7] + ", " + this.boardArray[8]
		);
	};



	// Methods

	/*/////////////////////////////////////////
				     Read-only
	/////////////////////////////////////////*/
	// [1] - Receives the value, finds it and returns the position
	this.find = function (value) {
		for (var k = 0; k < Board.BOARD_LENGTH; k++) {
			if (this.boardArray[k] === value) {
				var remainder = k % Board.BOARD_SIZE;
				var	quotient  = (k - remainder) / Board.BOARD_SIZE;

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
			return false;
		};

		return this.boardArray[i*Board.BOARD_SIZE + j];
	};

	// [3] - Receives the linear position and returns the value
	this.get = function (k) {
		if ((i < 0) || (k >= Board.BOARD_LENGTH)) throw "Board.get(k): Out of board!";

		return this.boardArray[k];
	};

	// [4] - Are these boards the same?
	this.equal = function (B2) {
		for (var k = 0; k < Board.BOARD_SIZE; k++) {
			if (this.boardArray[k] !== B2.get(k)) return false;
		};
		return true;
	};

	// [5] - Compares to final state
	this.final = function () {
		for (var k = 0; k < Board.BOARD_SIZE; k++) {
			if (this.boardArray[k] !== Board.FINAL_STATE[k]) return false;
		};
		return true;
	};


	///////// VALID MOVES /////////
	this.generateNeighbors = function () {
		var zero = this.find(0);
		var result = [];

		// Up
		if (zero.i > 0) {
			var upBoard = new Board(this.getBoard());

			// Swap 0 and the upper element
			upBoard.setSquare(this.getSquare(zero.i-1, zero.j), zero.i, zero.j);
			upBoard.setSquare(0, zero.i-1, zero.j);
			upBoard.updateCompleteness();

			result.push(upBoard);
		}
		else { result.push(false); };

		// Down
		if (zero.i < Board.BOARD_SIZE-1) {
			var downBoard = new Board(this.getBoard());

			// Swap 0 and the upper element
			downBoard.setSquare(this.getSquare(zero.i+1, zero.j), zero.i, zero.j);
			downBoard.setSquare(0, zero.i+1, zero.j);
			downBoard.updateCompleteness();

			result.push(downBoard);
		}
		else { result.push(false); };

		// Left
		if (zero.j > 0) {
			var leftBoard = new Board(this.getBoard());

			// Swap 0 and the upper element
			leftBoard.setSquare(this.getSquare(zero.i, zero.j-1), zero.i, zero.j);
			leftBoard.setSquare(0, zero.i, zero.j-1);
			leftBoard.updateCompleteness();

			result.push(leftBoard);
		}
		else { result.push(false); };

		// Right
		if (zero.j < Board.BOARD_SIZE-1) {
			var rightBoard = new Board(this.getBoard());

			// Swap 0 and the upper element
			rightBoard.setSquare(this.getSquare(zero.i, zero.j+1), zero.i, zero.j);
			rightBoard.setSquare(0, zero.i, zero.j+1);
			rightBoard.updateCompleteness();

			result.push(rightBoard);
		}
		else { result.push(false); };

		return result;
	};


	// // [1] - UP leads to...?
	// this.up = function () {
	// 	var square = this.find(0);

	// 	if (square.i > 0) {
	// 		var nextBoard = new Board(this.getBoard());

	// 		// Swap 0 and the upper element
	// 		nextBoard.setSquare(this.getSquare(square.i-1, square.j), square.i, square.j);
	// 		nextBoard.setSquare(0, square.i-1, square.j);
	// 		nextBoard.updateCompleteness();

	// 		return nextBoard;
	// 	};

	// 	return false;
	// };

	// [2] - DOWN leads to...?
	// this.down = function () {
	// 	var square = this.find(0);
	// 	if (square.i < Board.BOARD_SIZE-1) {
	// 		var nextBoard = new Board(this.getBoard());

	// 		// Swap 0 and the upper element
	// 		nextBoard.setSquare(this.getSquare(square.i+1, square.j), square.i, square.j);
	// 		nextBoard.setSquare(0, square.i+1, square.j);
	// 		nextBoard.updateCompleteness();

	// 		return nextBoard;
	// 	};
	// 	return false;
	// };

	// [3] - LEFT leads to...?
	// this.left = function () {
	// 	var square = this.find(0);
	// 	if (square.j > 0) {
	// 		var nextBoard = new Board(this.getBoard());

	// 		// Swap 0 and the upper element
	// 		nextBoard.setSquare(this.getSquare(square.i, square.j-1), square.i, square.j);
	// 		nextBoard.setSquare(0, square.i, square.j-1);
	// 		nextBoard.updateCompleteness();

	// 		return nextBoard;
	// 	};
	// 	return false;
	// };

	// [4] - RIGHT leads to...?
	this.right = function () {
		var square = this.find(0);
		if (square.j < Board.BOARD_SIZE-1) {
			var nextBoard = new Board(this.getBoard());

			// Swap 0 and the upper element
			nextBoard.setSquare(this.getSquare(square.i, square.j+1), square.i, square.j);
			nextBoard.setSquare(0, square.i, square.j+1);
			nextBoard.updateCompleteness();

			return nextBoard;
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
		this.boardArray[i*Board.BOARD_SIZE + j] = value;
	};

	// [2] - Receives a data array and sets the board with it
	this.setBoard = function (squareArray) {
		var presenceList = [0, 0, 0, 0, 0, 0, 0, 0, 0];

		for (var i = 0; i < squareArray.length; i++) presenceList[squareArray[i]]++;

		for (var i = 0; i < presenceList.length; i++) {
			if (presenceList[i] !== 1) throw "Board.setBoard: Invalid input array!";
		};
			
		this.boardArray = squareArray.slice();
		this.updateCompleteness();
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
	if (squareArray.length !== Board.BOARD_LENGTH) throw "Board constructor: Wrong Size!";
	this.setBoard(squareArray);
};

// Object comparison
Board.compare = function (B1, B2) {
	if (B1.completeness < B2.completeness) return -1;
	if (B1.completeness > B2.completeness) return  1;

	return 0;
};