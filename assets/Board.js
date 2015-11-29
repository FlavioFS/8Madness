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

	// Private Attributes
	var _boardArray;
	var _completeness;
	
	// Get
	this.boardArray	 = function () { return _boardArray.slice(); };
	this.completeness = function () { return _completeness;	     };

	this.toString = function () {
		return (
			"|" +  _boardArray[0] + ", " + _boardArray[1] + ", " + _boardArray[2] + "\n " + 
					_boardArray[3] + ", " + _boardArray[4] + ", " + _boardArray[5] + "\n " + 
					_boardArray[6] + ", " + _boardArray[7] + ", " + _boardArray[8] + "」"
		);
	};



	// Priviledged Methods

	/*/////////////////////////////////////////
				     Read-only
	/////////////////////////////////////////*/
	// [1] - Receives the value, finds it and returns the position
	this.find = function (value) {
		for (var k = 0; k < Board.BOARD_LENGTH; k++) {
			if (_boardArray[k] === value) {
				var remainder = k % Board.BOARD_SIZE;
				var	quotient  = (k - remainder) / Board.BOARD_SIZE;

				return {i:quotient, j:remainder};
			}
		}

		throw "Board.find(value): Not Found!";
	};

	// [2] - Receives the matrix-position and returns the value
	this.square = function (i, j) {
		if ((i < 0) ||
			(j < 0) ||
			(i >= Board.BOARD_SIZE) ||
			(j >= Board.BOARD_SIZE)) {
			return false;
		}

		return _boardArray[i*Board.BOARD_SIZE + j];
	};

	// [3] - Receives the linear position and returns the value
	// this.get = function (k) {
	// 	if ((i < 0) || (k >= Board.BOARD_LENGTH)) { throw "Board.get(k): Out of board!"; }

	// 	return _boardArray[k];
	// };

	// [4] - Are these boards the same?
	this.equals = function (B2) {
		return _boardArray.equals(B2.boardArray());
	};

	// [5] - Compares to final state
	this.finalState = function () {
		return _boardArray.equals(Board.FINAL_STATE);
	};


	///////// VALID MOVES /////////
	this.generateNeighbors = function () {
		var zero = this.find(0);
		var result = [];

		// Up
		if (zero.i > 0) {
			var upBoard = new Board(_boardArray);

			// Swap 0 and the upper element
			upBoard.setSquare(this.square(zero.i-1, zero.j), zero.i, zero.j);
			upBoard.setSquare(0, zero.i-1, zero.j);
			upBoard.updateCompleteness();

			result.push(upBoard);
		}
		else { result.push(false); }

		// Down
		if (zero.i < Board.BOARD_SIZE-1) {
			var downBoard = new Board(_boardArray);

			// Swap 0 and the upper element
			downBoard.setSquare(this.square(zero.i+1, zero.j), zero.i, zero.j);
			downBoard.setSquare(0, zero.i+1, zero.j);
			downBoard.updateCompleteness();

			result.push(downBoard);
		}
		else { result.push(false); }

		// Left
		if (zero.j > 0) {
			var leftBoard = new Board(_boardArray);

			// Swap 0 and the upper element
			leftBoard.setSquare(this.square(zero.i, zero.j-1), zero.i, zero.j);
			leftBoard.setSquare(0, zero.i, zero.j-1);
			leftBoard.updateCompleteness();

			result.push(leftBoard);
		}
		else { result.push(false); }

		// Right
		if (zero.j < Board.BOARD_SIZE-1) {
			var rightBoard = new Board(_boardArray);

			// Swap 0 and the upper element
			rightBoard.setSquare(this.square(zero.i, zero.j+1), zero.i, zero.j);
			rightBoard.setSquare(0, zero.i, zero.j+1);
			rightBoard.updateCompleteness();

			result.push(rightBoard);
		}
		else { result.push(false); }

		return result;
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
		}
		_boardArray[i*Board.BOARD_SIZE + j] = value;
	};

	// [2] - Receives a data array and sets the board with it
	this.setBoard = function (squareArray) {
		// Wrong size
		if (squareArray.length !== Board.BOARD_LENGTH) { throw "Board constructor: Wrong Size!"; }

		var presenceList = [0, 0, 0, 0, 0, 0, 0, 0, 0];

		for (var i = 0; i < squareArray.length; i++) { presenceList[squareArray[i]]++; }

		// Correct size, wrong elements
		for (var i = 0; i < presenceList.length; i++) {
			if (presenceList[i] !== 1) { throw "Board.setBoard: Invalid input array!"; }
		}
		
		// Everything is fine
		_boardArray = squareArray.slice();
		this.updateCompleteness();
	};

	// [3] - Receives two values, finds their squares and SWAPS them
	// this.swap = function (Va, Vb) {
	// 	var _A = this.find(Va);
	// 	var _B = this.find(Vb);

	// 	this.setSquare(Vb, _A.i, _A.j);
	// 	this.setSquare(Va, _B.i, _B.j);
	// };

	// [4] - Distance to final state
	this.updateCompleteness = function () {
		var manhattanDist = 0;
		
		// Zero stays in the last square
		var square = this.find(0);
		manhattanDist += Math.abs( 4 - square.i - square.j);

		// And here, the others...
		for (var k = 1; k < Board.BOARD_LENGTH-1; k++) {
			square = this.find(k);
			var remainder = (k-1) % Board.BOARD_SIZE;
			var quotient = (k-1 - remainder) / Board.BOARD_SIZE;
			manhattanDist += Math.abs( remainder + quotient - square.i - square.j);
		}

		_completeness = manhattanDist;
	};

	// Constructor
	this.setBoard(squareArray);
};
// Object comparison
// Board.compare = function (B1, B2) {
// 	if (B1.completeness < B2.completeness) return -1;
// 	if (B1.completeness > B2.completeness) return  1;

// 	return 0;
// };


	// // [1] - UP leads to...?
	// this.up = function () {
	// 	var square = this.find(0);

	// 	if (square.i > 0) {
	// 		var nextBoard = new Board(this.getBoard());

	// 		// Swap 0 and the upper element
	// 		nextBoard.setSquare(this.square(square.i-1, square.j), square.i, square.j);
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
	// 		nextBoard.setSquare(this.square(square.i+1, square.j), square.i, square.j);
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
	// 		nextBoard.setSquare(this.square(square.i, square.j-1), square.i, square.j);
	// 		nextBoard.setSquare(0, square.i, square.j-1);
	// 		nextBoard.updateCompleteness();

	// 		return nextBoard;
	// 	};
	// 	return false;
	// };

	// [4] - RIGHT leads to...?
	// this.right = function () {
	// 	var square = this.find(0);
	// 	if (square.j < Board.BOARD_SIZE-1) {
	// 		var nextBoard = new Board(this.getBoard());

	// 		// Swap 0 and the upper element
	// 		nextBoard.setSquare(this.square(square.i, square.j+1), square.i, square.j);
	// 		nextBoard.setSquare(0, square.i, square.j+1);
	// 		nextBoard.updateCompleteness();

	// 		return nextBoard;
	// 	};
	// 	return false;
	// };