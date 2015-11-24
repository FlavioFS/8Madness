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
	
	// Methods
	/*/////////////////////////////////////////
				     Read-only
	/////////////////////////////////////////*/
	// [1] - Receives the value, finds it and returns the position
	this.find = function (value) {
		for (var k = 0; k < Board.BOARD_LENGTH; k++) {
			if (this.board[k] == value) {
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

		return this.board[i*Board.BOARD_SIZE + j];
	};

	// [3] - Receives the linear position and returns the value
	this.get = function (k) {
		if ((i < 0) || (k >= Board.BOARD_LENGTH)) throw "Board.get(k): Out of board!";

		return this.board[k];
	};

	// [4] - Compares two boards
	this.equal = function (B2) {
		for (var k = 0; k < Board.BOARD_SIZE; k++) {
			if (this.board[k] != B2.get(k)) return false;
		};
		return true;
	};

	// [5] - Compares to final state
	this.final = function () {
		for (var k = 0; k < Board.BOARD_SIZE; k++) {
			if (this.board[k] != Board.FINAL_STATE[k]) return false;
		};
		return true;
	};

	// [6] - Distance to final state
	this.completeness = function () {
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

		return manhattanDist;
	};


	/*/////////////////////////////////////////
				       Write
	/////////////////////////////////////////*/
	// [1] - Sets the value of a square
	this.setSquare = function (value, i, j) {
		this.board[(i-1)*Board.BOARD_SIZE + j-1] = value;
	};

	this.setBoard = function (pieceArray) {
		this.board = pieceArray;
	};

	// [2] - Receives two values, finds their squares and SWAPS them
	this.swap = function (Va, Vb) {
		var _A = this.find(Va);
		var _B = this.find(Vb);

		this.setSquare(Vb, _A.i, _A.j);
		this.setSquare(Va, _B.i, _B.j);
	};

	// Constructor
	console.log(typeof(pieceArray));
	if (pieceArray.length != Board.BOARD_LENGTH) throw "Board constructor: Wrong Size!";
	board = pieceArray;
};



/* ===============================================================================
                          Class Definition: "Node"
=============================================================================== */
// Defines the tree structure
function Node (argBoard) {
	// Attributes
	var board;
	var parent;

	// Methods
	this.setBoard = function (newBoard) {
		this.board = newBoard;
	}

	this.setParent = function (newParent) {
		this.parent = newParent;
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

// [1.1] - Returns the values of the board displayed in the page
BoardView.loadBoard = function () {
	var input = document.getElementsByClassName("piece");
	var squaresArray = [1, 2, 3, 4, 5, 6, 7, 8, 0];
	
	for (var i = 0; i < input.length; i++) {
		squaresArray[i] = parseInt(input[i].innerHTML);
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
function dragNdrop () {
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
	var test = BoardView.loadBoard();
	console.log(test);
	var startingBoard = new Board(test);
	var root = new Node(startingBoard);

	dragNdrop();
}

$(document).ready(main);