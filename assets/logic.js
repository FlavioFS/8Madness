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
			}
		}

		throw "Board.find(value): Not Found!";
	}

	// [2] - Receives the matrix-position and returns the value
	this.getSquare = function (i, j) {
		if ((i < 0) ||
			(j < 0) ||
			(i >= Board.BOARD_SIZE) ||
			(j >= Board.BOARD_SIZE)) {
			throw "Board.get(i,j): Out of board!";
		}

		return board[i*Board.BOARD_SIZE + j];
	}

	// [3] - Receives the linear position and returns the value
	this.get = function (k) {
		if ((i < 0) || (k >= Board.BOARD_LENGTH)) throw "Board.get(k): Out of board!";

		return board[k];
	}

	// [4] - Are these boards the same?
	this.equal = function (B2) {
		for (var k = 0; k < Board.BOARD_SIZE; k++) {
			if (board[k] != B2.get(k)) return false;
		}
		return true;
	}

	// [5] - Compares to final state
	this.final = function () {
		for (var k = 0; k < Board.BOARD_SIZE; k++) {
			if (board[k] != Board.FINAL_STATE[k]) return false;
		}
		return true;
	}


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
		board[(i-1)*Board.BOARD_SIZE + j-1] = value;
	}

	// [2] - Receives a data array and sets the board with it
	this.setBoard = function (pieceArray) {
		var presenceList = [0, 0, 0, 0, 0, 0, 0, 0, 0];

		for (var i = 0; i < pieceArray.length; i++) presenceList[pieceArray]++;

		for (var i = 0; i < presenceList.length; i++) {
			if (presenceList[i] != 1) throw "Board.setBoard: Invalid input array!";
		}
			
		board = pieceArray;
	}

	// [3] - Receives two values, finds their squares and SWAPS them
	this.swap = function (Va, Vb) {
		var _A = this.find(Va);
		var _B = this.find(Vb);

		this.setSquare(Vb, _A.i, _A.j);
		this.setSquare(Va, _B.i, _B.j);
	}

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
		}

		this.completeness = manhattanDist;
	}

	// Constructor
	if (pieceArray.length != Board.BOARD_LENGTH) throw "Board constructor: Wrong Size!";
	board = pieceArray;
	this.updateCompleteness();
}

// Object comparison
Board.compare = function (B1, B2) {
	if (B1.completeness < B2.completeness) return -1;
	if (B1.completeness > B2.completeness) return  1;

	return 0;
}



/* ===============================================================================
                          Class Definition: "Node"
=============================================================================== */
// Defines the tree structure
function Node (argBoard) {
	// Attributes
	var board;
	var parent;
	var cost;

	// Set
	this.setBoard  = function (newBoard)  {this.board = newBoard;}
	this.setParent = function (newParent) {this.parent = newParent;}
	this.setCost   = function (newCost)   {this.cost = newCost;}

	// Get
	this.getBoard  = function () {return this.board;}
	this.getParent = function () {return this.parent;}
	this.getCost   = function () {return this.cost;}

	
	// Methods
	this.evaluation = function () {
		return this.cost + this.board.completeness();
	}

	// Constructor
	this.setBoard(argBoard);
}



/* ===============================================================================
                          Class Definition: "Game"
=============================================================================== */
// Defines a main board and uses a tree to solve the game
function GameModel () {
	// body...
}


/* ||||||     ||    ||||||||||||    ||||||||||||    ||||      ||    ||
 * ||||||     ||       ||||||       ||||||          ||||      ||    ||
 * ||||||     ||       ||||||       ||||||          ||||      ||    ||
 * ||||||     ||       ||||||       ||||||||||||    ||||      ||    ||
 *   |||||| ||         ||||||       ||||||            ||||   ||    ||
 *   |||||| ||         ||||||       ||||||            ||||  |||   ||| 
 *     ||||||       ||||||||||||    ||||||||||||        |||||  ||||
 */

// [1]
function BoardView () {};
BoardView.COORDINATES = ["20px", "140px", "260px"];

// [1.1] - Returns the values of the board displayed in the page
BoardView.loadBoard = function () {
	var pieces = document.getElementsByClassName("piece");
	var squaresArray = [1, 2, 3, 4, 5, 6, 7, 8, 0];
	
	// Checks all elements
	for (var i = 0; i < pieces.length; i++) {
		var horizontalPosition = 0;
		
		// Searching for the horizontal position
		for (var x = 0; x < BoardView.COORDINATES.length; x++) {
			if (pieces[i].style.left == BoardView.COORDINATES[x])
				{ horizontalPosition = x; }			
		}

		// Checks "top" value for each element
		for (var y = 0; y < BoardView.COORDINATES.length; y++) {
			if (pieces[i].style.top  == BoardView.COORDINATES[y])
				{ squaresArray[3*y + horizontalPosition] = parseInt(pieces[i].innerHTML); }
		}
	}
	return squaresArray;
}

// [1.2] - Swaps two squares
BoardView.swap = function (Va, Vb) {
	sqrA = document.getElementById("p" + Va);
	sqrB = document.getElementById("p" + Vb);

	temp = [sqrA.style.left, sqrA.style.top];
	
	sqrA.style.left = sqrB.style.left;
	sqrA.style.top  = sqrB.style.top;
	
	sqrB.style.left = temp[0];
	sqrB.style.top  = temp[1];
}

// [2] - Drag'n'drop
function dragNdropSettings () {
	var draggable = document.getElementsByClassName("piece");
	for (var i = 0; i < draggable.length; i++) {
		draggable[i].addEventListener('dragstart', dragStart, false);
		draggable[i].addEventListener('dragend', dragEnd, false);
	};

	var dropTarget = document.getElementsByClassName("piece");
	for (var i = 0; i < dropTarget.length; i++) {
		dropTarget[i].addEventListener('dragenter', dragEnter, false);
		dropTarget[i].addEventListener('dragover' , dragOver , false);
		dropTarget[i].addEventListener('dragleave', dragLeave, false);
		dropTarget[i].addEventListener('drop'     , drop     , false);
	};

	// Event Handlers
	// Drag
	function dragStart (event) {
		event.dataTransfer.setData("text/html", event.target.innerHTML);
		$(event.target).addClass("dragging");
	};

	function dragEnd (event) {
		$(event.target).removeClass("dragging");
	};

	// Drop
	function dragEnter (event) {
		$(event.target).addClass("dropping");
	};

	function dragOver (event) {
		event.preventDefault();
		return false;
	};

	function dragLeave (event) {
		$(event.target).removeClass("dropping");
	};

	function drop (event) {
		var data = event.dataTransfer.getData('text/html');
		$(event.target).removeClass("dropping");
		event.dataTransfer.effectAllowed = "move";

		// Swapping values
		var b = event.target.innerHTML;
		swap(data, b);

		event.preventDefault();
		return false;
	};

	function drop (event) {
		var data = event.dataTransfer.getData('text/html');
		$(event.target).removeClass("dropping");
		var targetValue = event.target.innerHTML;
		
		// Runs only when dropping into a different piece
		if (targetValue != data)
		{
			event.dataTransfer.effectAllowed = "move";

			// Swapping squares marked with "data" and "targetValue"
			BoardView.swap(data, targetValue);

			event.preventDefault();
			return false;
		}
		
		event.preventDefault();
		return true;
	};
}


/* ||||||||||||    ||||||||||||    ||||||   ||    ||||||||||    ||||||||||||     ||||||||||||    ||||||
 * ||||||          ||||    ||||    |||||||| ||    ||||||||||    ||||||    |||    ||||    ||||    ||||||
 * ||||||          ||||    ||||    |||||||| ||       ||||       ||||||    |||    ||||    ||||    ||||||
 * ||||||          ||||    ||||    |||||||||||       ||||       ||||||||||||     ||||    ||||    ||||||
 * ||||||          ||||    ||||    |||||| ||||       ||||       ||||||   ||      ||||    ||||    ||||||
 * ||||||          ||||    ||||    |||||| ||||       ||||       ||||||    ||     ||||    ||||    ||||||
 * ||||||||||||    ||||||||||||    ||||||   ||       ||||       ||||||     ||    ||||||||||||    ||||||||||||
 */
/* ===============================================================================
                                      Main
=============================================================================== */
function main () {
	var startingBoard = new Board(BoardView.loadBoard());
	var root = new Node(startingBoard);

	dragNdropSettings();

	//root.solve();
	
}

$(document).ready(main);