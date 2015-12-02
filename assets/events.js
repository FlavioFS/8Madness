//////////////////////////////////////////////////
//                    Utility                   //
//////////////////////////////////////////////////

// Updates the final state lamp
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
var keylock = false;

// Keypress detection
function keyboard (evt) {
	// Locks the keyboard when solving or animating
	if (keylock) { return; }

	evtKey = evt.which || evt.keyCode;

	var keyLeft  = 37,
		keyUp 	 = 38,
		keyRight = 39,
		keyDown  = 40,
		keyW 	 = 87,
		keyA 	 = 65,
		keyS 	 = 83,
		keyD 	 = 68,
		key1	 = 49,
		key3	 = 51;


	// Pressing Return
	// Tries to solve the puzzle
	if ((evtKey === key1) && (!keylock)) {
		if (View.solveBtnReady()) { solveAStar(); }
	}

	else if ((evtKey === key3) && (!keylock)) {
		if (View.solveBtnReady()) { solveBFS(); }
	}

	// Press WASD moves the pieces from the board
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

// Drag'n'drop
// Allows the pieces to be repositioned by click-and-drag mechanics
// The changes are applied to the view ONLY
function dragNdropSettings (argument) {
	// Setting the event listeners
	var _pieces = $(".piece");
	for (var i = 0; i < _pieces.length; i++) {
		_pieces[i].addEventListener('dragstart', dragStart, false);
		_pieces[i].addEventListener('dragend', dragEnd, false);
		_pieces[i].addEventListener('dragenter', dragEnter, false);
		_pieces[i].addEventListener('dragover' , dragOver , false);
		_pieces[i].addEventListener('dragleave', dragLeave, false);
		_pieces[i].addEventListener('drop'     , drop     , false);
	};

	// Event Handlers
	// Drag
	function dragStart (event) {
		if (keylock) {return true;};
		event.dataTransfer.setData("text/html", event.target.innerHTML);
		$(event.target).addClass("dragging");
	};

	function dragEnd (event) {
		if (keylock) {return true;};
		$(event.target).removeClass("dragging");
	};

	// Drop
	function dragEnter (event) {
		if (keylock) {return true;};
		$(event.target).addClass("dropping");
	};

	function dragOver (event) {
		if (keylock) {return true;};
		event.preventDefault();
		return false;
	};

	function dragLeave (event) {
		if (keylock) {return true;};
		$(event.target).removeClass("dropping");
	};

	function drop (event) {
		if (keylock) {return true;};

		var data = event.dataTransfer.getData('text/html');
		$(event.target).removeClass("dropping");
		var targetValue = event.target.innerHTML;
		
		// Runs only when dropping into a different piece
		if (targetValue != data)
		{
			event.dataTransfer.effectAllowed = "move";

			// Swapping squares marked with "data" and "targetValue"
			View.swap(data, targetValue);
			updateFinal(); // Updating the final state lamp

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
function solveAStar () {
	keylock = true;	// Denies the use of the keyboard and drag-and-drop
	_puzzle = new Problem ();

	// Before starting calculation, sets a message to the user and prevents more requests
	View.setSolutionAStar("8Madness is thinking. Puny humans are instructed to w8!<br>Do not touch this keyboard!<br>Maximum waiting time: 3 minutes.");
	View.setSolveBtnEnabled(false);
	View.setAnimateBtnEnabled(false);
	View.setLastAlgorithm("A*");
	
	// Waits for the view to update and starts the calculation
	setTimeout(
		function () {
			// Stopwatch measures the time required to solve the puzzle
			var _timer = new Stopwatch();
			_timer.start();
			_puzzle.solveAStar();
			_timer.stop();

			// Updates the solution details at the GUI
			View.setSolutionAStar(_puzzle.solution());
			View.setElapsedTimeAStar(_timer.getMilliseconds());
			View.setNodesExpandedAStar(_puzzle.expanded());
			updateFinal();

			if (!_puzzle.solvable()) {
				// Unsolvable: allows solution requests but not the animation
				View.setSolveBtnEnabled(true);
				View.setAnimateBtnEnabled(false);
				keylock = false;
			}
			else {
				// Solved: allows solution requests and it is also possible to animate the valid solution
				View.setSolveBtnEnabled(true);
				View.setAnimateBtnEnabled(true);
				View.setSolutionSizeAStar(_puzzle.stepCount());
				keylock = false;
			}
		},
		100
	);
}

function solveBFS () {
	keylock = true;	// Denies the use of the keyboard and drag-and-drop
	_puzzle = new Problem ();

	// Before starting calculation, sets a message to the user and prevents more requests
	View.setSolutionBFS("8Madness is thinking. Puny humans are instructed to w8!<br>Do not touch this keyboard!<br>Maximum waiting time: 4 minutes.");
	View.setSolveBtnEnabled(false);
	View.setAnimateBtnEnabled(false);
	View.setLastAlgorithm("BFS");
	
	// Waits for the view to update and starts the calculation
	setTimeout(
		function () {
			// Stopwatch measures the time required to solve the puzzle
			var _timer = new Stopwatch();
			_timer.start();
			_puzzle.solveBFS();
			_timer.stop();

			// Updates the solution details at the GUI
			View.setSolutionBFS(_puzzle.solution());
			View.setElapsedTimeBFS(_timer.getMilliseconds());
			View.setNodesExpandedBFS(_puzzle.expanded());
			updateFinal();

			if (!_puzzle.solvable()) {
				// Unsolvable: allows solution requests but not the animation
				View.setSolveBtnEnabled(true);
				View.setAnimateBtnEnabled(false);
				keylock = false;
			}
			else {
				// Solved: allows solution requests and it is also possible to animate the valid solution
				View.setSolveBtnEnabled(true);
				View.setAnimateBtnEnabled(true);
				View.setSolutionSizeBFS(_puzzle.stepCount());
				keylock = false;
			}
		},
		100
	);
}

// Animate button
function animation () {
	// Animated when there is a solution
	if (_puzzle && _puzzle.solved()) {
		// Denies the use of keyboard or drag-and-drop during the animation process
		keylock = true;
		
		var _solution = _puzzle.solution().split(" ");
		var _currentBoard = new Board( View.loadBoard() );
		var _zero = _currentBoard.find(0);


		// Highlighting and Motion - Timeout forces it to be recursive
		function highlightAndMotion (i) {

			// Highlight
			var _displayNow = _solution.slice();
			_displayNow[i] = "<span>" + _displayNow[i] + "</span>";
			_displayNow = _displayNow.join(" ");

			// Which algorithm solved this?
			var _lastAlgorithm = View.getLastAlgorithm();
			var _setSolutionFunc;
			if (_lastAlgorithm == "A*") {
				_setSolutionFunc = View.setSolutionAStar;
			}
			else if (_lastAlgorithm == "BFS") {
				_setSolutionFunc = View.setSolutionBFS;
			}
			_setSolutionFunc(_displayNow);

			// Motion
			if      (_solution[i] === View.ARROWS.U) { swapUp(_currentBoard, _zero);    }
			else if (_solution[i] === View.ARROWS.D) { swapDown(_currentBoard, _zero);  }
			else if (_solution[i] === View.ARROWS.L) { swapLeft(_currentBoard, _zero);  }
			else if (_solution[i] === View.ARROWS.R) { swapRight(_currentBoard, _zero); }

			// Recursion
			if (i < _solution.length - 1) {
				setTimeout(
					function () { highlightAndMotion(i+1); },
					500
				);
			}

			// Recusrion ends here
			else {
				_setSolutionFunc(_solution.join(" "));
				View.setAnimateBtnEnabled(false);
				updateFinal();
				keylock = false;
			}
		}

		highlightAndMotion(0);
	}
}


// Retracts/expands the instructions panel
function toggleInstructions () {
	View.iBoxToggle();
}

//////////////////////////////////////////////////
//                      Main                    //
//////////////////////////////////////////////////
// Sets up the starting state
function main () {
	View.loadBoard();
	dragNdropSettings();
};

$(document).ready(main);