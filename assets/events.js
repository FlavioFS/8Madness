//////////////////////////////////////////////////
//                    Utility                   //
//////////////////////////////////////////////////
function updateFinal () {
	if ( View.loadBoard().equals(Board.FINAL_STATE) )
		{ View.setFinal(true); }
	else
		{ View.setFinal(false); };
}

// Moves THE ZERO downwards, and his neighbor upwards
function swapUp (currentBoard, zero) {
	var neighbor = currentBoard.square(zero.i+1, zero.j);

	if (neighbor != false) {
		View.swap(0, neighbor);

		currentBoard.setSquare(currentBoard.square(zero.i+1, zero.j), zero.i, zero.j);
		currentBoard.setSquare(0, zero.i+1, zero.j);
		currentBoard.updateCompleteness();

		zero.i += 1;
	}
}

// Moves THE ZERO upwards, and his neighbor downwards
function swapDown (currentBoard, zero) {
	var neighbor = currentBoard.square(zero.i-1, zero.j);

	if (neighbor != false) {
		View.swap(0, neighbor);

		currentBoard.setSquare(currentBoard.square(zero.i-1, zero.j), zero.i, zero.j);
		currentBoard.setSquare(0, zero.i-1, zero.j);
		currentBoard.updateCompleteness();

		zero.i -= 1;
	}
}

// Moves THE ZERO right, and his neighbor to the left
function swapLeft (currentBoard, zero) {
	var neighbor = currentBoard.square(zero.i, zero.j+1);

	if (neighbor != false) {
		View.swap(0, neighbor);

		currentBoard.setSquare(currentBoard.square(zero.i, zero.j+1), zero.i, zero.j);
		currentBoard.setSquare(0, zero.i, zero.j+1);
		currentBoard.updateCompleteness();

		zero.j += 1;
	}
}

// Moves THE ZERO left, and his neighbor to the right
function swapRight (currentBoard, zero) {
	var neighbor = currentBoard.square(zero.i, zero.j-1);

	if (neighbor != false) {
		View.swap(0, neighbor);

		currentBoard.setSquare(currentBoard.square(zero.i, zero.j-1), zero.i, zero.j);
		currentBoard.setSquare(0, zero.i, zero.j-1);
		currentBoard.updateCompleteness();

		zero.j -= 1;
	}
}


//////////////////////////////////////////////////
//                   Keyboard                   //
//////////////////////////////////////////////////
window.onkeyup = keyboard;

// Keypress detection
function keyboard (evt) {
	evtKey = evt.which || evt.keyCode;

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
	if ((evtKey === keyEnter)) {
		if (View.solveBtnReady()) { solve(); }
	}

	// Pressing WASD
	else {
		var _currentBoard = new Board( View.loadBoard() );
		var _zero = _currentBoard.find(0);
		
		// Swap functions defined at the top of this file (utility funcions)
		if      ((evtKey === keyW)) { swapUp(_currentBoard, _zero);    }
		else if ((evtKey === keyA)) { swapLeft(_currentBoard, _zero);  }
		else if ((evtKey === keyS)) { swapDown(_currentBoard, _zero);  }
		else if ((evtKey === keyD)) { swapRight(_currentBoard, _zero); }		
		
		updateFinal();
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
var _puzzle;

// Solve Button
function solve () {
	_puzzle = new Problem ();

	var _timer = new Stopwatch();
	_timer.start();
	_puzzle.solve();
	_timer.stop();

	console.log(_timer.getMilliseconds());

	View.setSolution(_puzzle.solution());
}

// Animate button
function animation () {
	if (_puzzle && _puzzle.solved()) {
		var _solution = _puzzle.solution().split(" ");
		var _currentBoard = new Board( View.loadBoard() );
		var _zero = _currentBoard.find(0);


		// Highlighting and Motion - Timeout forces it to be recursive
		function highlightAndMotion (i) {
			// Highlight
			var _displayNow = _solution.slice();
			_displayNow[i] = "<span>" + _displayNow[i] + "</span>";
			_displayNow = _displayNow.join(" ");

			View.setSolution(_displayNow);

			// Motion
			if      (_solution[i] === View.ARROWS.U) { swapUp(_currentBoard, _zero);    }
			else if (_solution[i] === View.ARROWS.D) { swapDown(_currentBoard, _zero);  }
			else if (_solution[i] === View.ARROWS.L) { swapLeft(_currentBoard, _zero);  }
			else if (_solution[i] === View.ARROWS.R) { swapRight(_currentBoard, _zero); }

			// Recursion
			if (i < _solution.length - 1) {
				setTimeout(
					function () { highlightAndMotion(i+1); },
					1000
				);
			}
			else {
				View.setSolution(_solution.join(" "));
				View.setAnimateBtnEnabled(false);
				updateFinal();
			}
		}

		highlightAndMotion(0);
	}
}


//////////////////////////////////////////////////
//                      Main                    //
//////////////////////////////////////////////////
function main () {
	View.loadBoard();
	dragNdropSettings();
};

$(document).ready(main);