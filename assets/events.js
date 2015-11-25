//////////////////////////////////////////////////
//                    Utility                   //
//////////////////////////////////////////////////
function updateFinal () {
	if (BoardView.loadBoard().equals(Board.FINAL_STATE))
		{ BoardView.setFinal(true); }
	else
		{ BoardView.setFinal(false); };
}


//////////////////////////////////////////////////
//                    Buttons                   //
//////////////////////////////////////////////////
// Solve Button
function solve (argument) {
}

// Show Solution
function animate (argument) {
	// body...
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
		keyD 	 = 68;

	var currentBoard = new Board(BoardView.loadBoard());
	var zero = currentBoard.find(0);

	// Pressing Up
	console.log(evt.keyCode);
	if ((evt.keyCode === keyUp) || (evt.keyCode === keyW)) {	
		var neighbor = currentBoard.getSquare(zero.i+1, zero.j);

		if (neighbor != false)
			BoardView.swap(0, neighbor);
	}

	// Pressing Down
	else if ((evt.keyCode === keyDown) || (evt.keyCode === keyS)) {
		var neighbor = currentBoard.getSquare(zero.i-1, zero.j);

		if (neighbor != false)
			BoardView.swap(0, neighbor);
	}

	// Pressing left
	else if ((evt.keyCode === keyLeft) || (evt.keyCode === keyA)) {
		var neighbor = currentBoard.getSquare(zero.i, zero.j+1);

		if (neighbor != false)
			BoardView.swap(0, neighbor);
	}

	// Pressing Right
	else if ((evt.keyCode === keyRight) || (evt.keyCode === keyD)) {
		var neighbor = currentBoard.getSquare(zero.i, zero.j-1);

		if (neighbor != false)
			BoardView.swap(0, neighbor);
	}

	updateFinal();
}


//////////////////////////////////////////////////
//                     Mouse                    //
//////////////////////////////////////////////////
// Drag'n'drop
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
	var targetValue = event.target.innerHTML;
	
	// Runs only when dropping into a different piece
	if (targetValue != data)
	{
		event.dataTransfer.effectAllowed = "move";

		// Swapping squares marked with "data" and "targetValue"
		BoardView.swap(data, targetValue);

		updateFinal();

		event.preventDefault();
		return false;
	};
	
	event.preventDefault();
	return true;
};