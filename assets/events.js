//////////////////////////////////////////////////
//                    Utility                   //
//////////////////////////////////////////////////
function updateFinal () {
	if ( View.loadBoard().equals(Board.FINAL_STATE) )
		{ View.setFinal(true); }
	else
		{ View.setFinal(false); };
}


//////////////////////////////////////////////////
//                   Keyboard                   //
//////////////////////////////////////////////////
window.onkeyup = keyboard;

function keyboard (evt) {
	evt = evt || event;

	var keyLeft  = 37,
		keyUp 	 = 38,
		keyRight = 39,
		keyDown  = 40,
		keyW 	 = 87,
		keyA 	 = 65,
		keyS 	 = 83,
		keyD 	 = 68,
		keyEnter = 13;


	// Pressing Return
	// Tries to solve the puzzle
	if ((evt.keyCode === keyEnter))
		{ if (document.getElementsByClassName('solveBtn')[0].disabled === false) { solve()}; }

	else {
		var currentBoard = new Board( View.loadBoard() );
		var zero = currentBoard.find(0);
		
		// Pressing W
		// Moves a piece upwards
		if ((evt.keyCode === keyW)) {
			var neighbor = currentBoard.getSquare(zero.i+1, zero.j);

			if (neighbor != false)
				{ View.swap(0, neighbor); }
		}

		// Pressing S
		// Moves a piece downwards
		else if ((evt.keyCode === keyS)) {
			var neighbor = currentBoard.getSquare(zero.i-1, zero.j);

			if (neighbor != false)
				View.swap(0, neighbor);
		}

		// Pressing A
		// Moves a piece to the left
		else if ((evt.keyCode === keyA)) {
			var neighbor = currentBoard.getSquare(zero.i, zero.j+1);

			if (neighbor != false)
				View.swap(0, neighbor);
		}

		// Pressing D
		// Moves a piece to the right
		else if ((evt.keyCode === keyD)) {
			var neighbor = currentBoard.getSquare(zero.i, zero.j-1);

			if (neighbor != false)
				View.swap(0, neighbor);
		}
		
		updateFinal();
		//delete currentBoard;
	}
}


//////////////////////////////////////////////////
//                     Mouse                    //
//////////////////////////////////////////////////
function dragNdropSettings (argument) {
	// Drag'n'drop
	var draggable = $(".piece");
	for (var i = 0; i < draggable.length; i++) {
		draggable[i].addEventListener('dragstart', dragStart, false);
		draggable[i].addEventListener('dragend', dragEnd, false);
	};

	var dropTarget = $(".piece");
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
		var targetValue = event.target.innerHTML;
		
		// Runs only when dropping into a different piece
		if (targetValue != data)
		{
			event.dataTransfer.effectAllowed = "move";

			// Swapping squares marked with "data" and "targetValue"
			View.swap(data, targetValue);

			updateFinal();

			event.preventDefault();
			return false;
		};
		
		event.preventDefault();
		return true;
	};
};

//////////////////////////////////////////////////
//                    Buttons                   //
//////////////////////////////////////////////////
var puzzle;

// Solve Button
function solve (argument) {
	puzzle = new Problem ();
	puzzle.solve();
	var _solution = puzzle.getSolution();
	console.log(_solution);
	document.getElementsByClassName('solution')[0].innerHTML = _solution;
}

// Show Solution
function animate (argument) {
	//var solution = puzzle.getSolution();
	// ...
}


//////////////////////////////////////////////////
//                      Main                    //
//////////////////////////////////////////////////
function main () {
	View.loadBoard();
	dragNdropSettings();
};

$(document).ready(main);