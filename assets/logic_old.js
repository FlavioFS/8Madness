/* ===============================================================================
                                      Main
=============================================================================== */
function main () {
	loadBoard();
	dragNdrop();
}

/* ===============================================================================
                                      View
=============================================================================== */
function loadBoard () {
	var input = document.getElementsByClassName("piece");
	
	for (var i = 0; i < input.length; i++) {
		board[Math.floor(i/3)][i%3] = input[i].innerHTML;
	}
}

// Moves the piece marked with "value" to the specified position
function move (value, i, j) {
	console.log("Inside move");
	console.log("move(" + value + "," + i + "," + j + ")");

	targetPiece = document.getElementById("p" + value);
	targetPiece.style.left = board_squares[j];
	targetPiece.style.top = board_squares[i];

	console.log(targetPiece.innerHTML);
}

/* ===============================================================================
                                   Drag'n'drop
=============================================================================== */
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
		// console.log("target.innerHTML == " +  targetValue);
		// console.log("data == " +  data);
		if (targetValue != data)
		{
			event.dataTransfer.effectAllowed = "move";

			// Swapping values
			swap(data, targetValue);

			event.preventDefault();
			return false;
		}
		
		event.preventDefault();
		return true;
	};



}

/* ===============================================================================
                                  Game Mechanics
=============================================================================== */
function findPiece (value) {
	//var pieceList = document.getElementById("board").children;
	var over = false;
	var i = 0, j = 0;

	i = -1;
	while (!over) {
		i++;
		if (i == 3) throw "Not found";

		j = -1;
		while ((!over) && (j < 2)) {
			j++;
			if (board[i][j] == value) {
				over = true;
			}
			console.log("(" + i + "," + j + "): " + board[i][j] + " == " + value + "?");
		}	
	}

	return {x:i, y:j};
}

function swap (Va, Vb) {
	var pA = findPiece(Va),
		pB = findPiece(Vb);

	// Swap pieces in the model
	var temp = board[pA.x][pA.y];
	board[pA.x][pA.y] = board[pB.x][pB.y];
	board[pB.x][pB.y] = temp;

	// Swap pieces in the view (updates the view)
	// "Bring here the piece with this value"
	move(board[pA.x][pA.y], pA.x, pA.y);
	move(board[pB.x][pB.y], pB.x, pB.y);

	console.log(board);
}

// Game Over?
// Return: Boolean
function gameover () {
	var solved_board =	[
							[1,2,3],
							[4,5,6],
							[7,8,0]
				 		];

	// Is there an unmatching piece?
	for (var i = 0; i < board.length; i++) {
		for (var j = 0; j < board.length; j++) {
			if (board[i][j] != solved_board[i][j]) {
				return false;
			};
		};
	};

	return true;
};

$(document).ready(main);