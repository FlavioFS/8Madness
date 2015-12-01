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
// This class is a data structure that manages the inner operations of a game board
function Board (squareArray) {
	// Static values
	Board.BOARD_SIZE = 3;
	Board.BOARD_LENGTH = Board.BOARD_SIZE*Board.BOARD_SIZE;
	Board.FINAL_STATE = [1, 2, 3, 4, 5, 6, 7, 8, 0];

	// Private Attributes
	var _boardArray;	// The board represented as an array
	var _completeness;	// How far from the solved board is this?
	
	// Get
	this.boardArray	 = function () { return _boardArray.slice(); };
	this.completeness = function () { return _completeness;	     };

	// Override - String Representation
	this.toString = function () {
		return (
			"|" +	_boardArray[0] + ", " + _boardArray[1] + ", " + _boardArray[2] + "\n " + 
					_boardArray[3] + ", " + _boardArray[4] + ", " + _boardArray[5] + "\n " + 
					_boardArray[6] + ", " + _boardArray[7] + ", " + _boardArray[8] + "」"
		);
	};



	// Priviledged Methods
	//// Read-only
	////// [1] - Receives a value, finds it in the board and returns the position
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

	////// [2] - Returns the element at position (i,j)
	this.square = function (i, j) {
		if ((i < 0) ||
			(j < 0) ||
			(i >= Board.BOARD_SIZE) ||
			(j >= Board.BOARD_SIZE)) {
			return false;
		}

		return _boardArray[i*Board.BOARD_SIZE + j];
	};

	////// [3] - Are these boards the same?
	this.equals = function (B2) {
		return _boardArray.equals(B2.boardArray());
	};

	////// [4] - Compares to final state
	this.finalState = function () {
		return _boardArray.equals(Board.FINAL_STATE);
	};


	////// [5] -  Generates the neighbor boards
	this.generateNeighbors = function () {
		var zero = this.find(0);
		var result = [];

		// Up
		if (zero.i > 0) {
			var upBoard = new Board(_boardArray);

			// Swap 0 and the upper element
			upBoard.setSquare(this.square(zero.i-1, zero.j), zero.i, zero.j);	// Up neighbor comes down
			upBoard.setSquare(0, zero.i-1, zero.j);								// Zero goes up
			upBoard.updateCompleteness();

			result.push(upBoard);
		}
		else { result.push(false); }	// There is no neighbor at the border

		// Down
		if (zero.i < Board.BOARD_SIZE-1) {
			var downBoard = new Board(_boardArray);

			// Swap 0 and the lower element
			downBoard.setSquare(this.square(zero.i+1, zero.j), zero.i, zero.j);	// Down neighbor comes up
			downBoard.setSquare(0, zero.i+1, zero.j);							// Zero goes down
			downBoard.updateCompleteness();

			result.push(downBoard);
		}
		else { result.push(false); }	// There is no neighbor at the border

		// Left
		if (zero.j > 0) {
			var leftBoard = new Board(_boardArray);

			// Swap 0 and the left element
			leftBoard.setSquare(this.square(zero.i, zero.j-1), zero.i, zero.j);	// Left neighbor comes right
			leftBoard.setSquare(0, zero.i, zero.j-1);							// Zero goes left
			leftBoard.updateCompleteness();

			result.push(leftBoard);
		}
		else { result.push(false); }	// There is no neighbor at the border

		// Right
		if (zero.j < Board.BOARD_SIZE-1) {
			var rightBoard = new Board(_boardArray);

			// Swap 0 and the right element
			rightBoard.setSquare(this.square(zero.i, zero.j+1), zero.i, zero.j); // Right neighbor comes left
			rightBoard.setSquare(0, zero.i, zero.j+1);							 // Zero goes right
			rightBoard.updateCompleteness();

			result.push(rightBoard);
		}
		else { result.push(false); }	// There is no neighbor at the border

		return result;
	};



	//// Write
	////// [1] - Sets the value of the square at position (i,j)
	this.setSquare = function (value, i, j) {
		if ((i < 0) ||
			(j < 0) ||
			(i >= Board.BOARD_SIZE) ||
			(j >= Board.BOARD_SIZE)) {
			throw "Board.get(i,j): Out of board!";
		}
		_boardArray[i*Board.BOARD_SIZE + j] = value;
	};

	////// [2] - Receives a data array and sets the board with it
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

	////// [3] - Distance to final state
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