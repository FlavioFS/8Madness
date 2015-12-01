/* ||||||     ||    ||||||||||||    ||||||||||||    ||||      ||    ||
 * ||||||     ||       ||||||       ||||||          ||||      ||    ||
 * ||||||     ||       ||||||       ||||||          ||||      ||    ||
 * ||||||     ||       ||||||       ||||||||||||    ||||      ||    ||
 *   |||||| ||         ||||||       ||||||            ||||   ||    ||
 *   |||||| ||         ||||||       ||||||            ||||  |||   ||| 
 *     ||||||       ||||||||||||    ||||||||||||        |||||  ||||
 */

// [1]
function View () {};
View.COORDINATES = ["20px", "140px", "260px"];
View.ARROWS = {U: "\u21E7", D: "\u21E9", L: "\u21E6", R: "\u21E8"};


/*/////////////////////////////////////////
			     Read-only
/////////////////////////////////////////*/

// [1.1] - Returns the values of the board displayed in the page
View.loadBoard = function () {
	var pieces = $(".piece");
	var squaresArray = [1, 2, 3, 4, 5, 6, 7, 8, 0];
	
	// Checks all elements
	for (var i = 0; i < pieces.length; i++) {
		var horizontalPosition = 0;
		
		// Searching for the horizontal position
		for (var x = 0; x < View.COORDINATES.length; x++) {
			if (pieces[i].style.left == View.COORDINATES[x]) { horizontalPosition = x; }
		};

		// Checks "top" value for each element
		for (var y = 0; y < View.COORDINATES.length; y++) {
			if (pieces[i].style.top  == View.COORDINATES[y])
				{ squaresArray[3*y + horizontalPosition] = parseInt(pieces[i].innerHTML); };
		};
	};

	// Initial state of light
	if (squaresArray.equals(Board.FINAL_STATE)) { View.setFinal(true); }
	else { View.setFinal(false); }

	return squaresArray;
};

// [1.2] Is the solve button ready?
View.solveBtnReady = function () {
	return !document.getElementsByClassName("solveBtn")[0].disabled;
};



/*/////////////////////////////////////////
			       Write
/////////////////////////////////////////*/
// [1.3] - Swaps two squares
View.swap = function (Va, Vb) {
	pieces = $(".piece");
	sqrA = pieces[Va];
	sqrB = pieces[Vb];

	temp = [sqrA.style.left, sqrA.style.top];
	
	sqrA.style.left = sqrB.style.left;
	sqrA.style.top  = sqrB.style.top;
	
	sqrB.style.left = temp[0];
	sqrB.style.top  = temp[1];
};

// [1.4] - Sets the 'disabled' state of solveBtn
View.setSolveBtnEnabled = function (bool) {
	document.getElementsByClassName('solveBtn')[0].disabled = !bool;
	document.getElementsByClassName('solveBtn')[1].disabled = !bool;
};

// [1.5] - Sets the 'disabled' state of animateBtn
View.setAnimateBtnEnabled = function (bool) {
	document.getElementsByClassName('animateBtn')[0].disabled = !bool;
};

// [1.6] - Sets the state of the final-state light
View.setFinal = function (bool) {
	var _signal = $(".signal");

	// Final State -> Disable the buttons!
	if (bool === true) {
		_signal.addClass("finished");
		View.setSolveBtnEnabled(false);
		View.setAnimateBtnEnabled(false);
	}

	// Not Final -> Allow queries
	else {
		_signal.removeClass("finished");
		View.setSolveBtnEnabled(true);
		View.setAnimateBtnEnabled(false);
	};
};

// [1.7] - Solution div's inner text
View.setSolution = function (stringArg) {
	document.getElementsByClassName('solution')[0].innerHTML = stringArg;
};

// [1.8] - Elapsed Time
View.setElapsedTime = function (msTime) {
	document.getElementsByClassName('info')[0].innerHTML = "Elapsed Time: " + msTime + " ms";
};

// [1.9] - Nodes Expanded
View.setNodesExpanded = function (nodeCount) {
	document.getElementsByClassName('info')[1].innerHTML = "Nodes Expanded: " + nodeCount;
};

// [1.10] - Nodes Expanded
View.setSolutionSize = function (size) {
	document.getElementsByClassName('info')[2].innerHTML = "Solution Size: " + size;
};

// [1.11] - Toggles Instruction Box
View.iBoxToggle = function () {
	var _iBox = document.getElementsByClassName("iBox")[0];
	var _instructionsRight = {shown:"0px", hidden: ("-" + _iBox.offsetWidth*0.95 + "px")};

	// If it is shown, hide it
	if (_iBox.style.right === _instructionsRight.shown || _iBox.style.right === "") {
		_iBox.style.right = _instructionsRight.hidden;
	}

	// If it is hidden, show it
	else {
		_iBox.style.right = _instructionsRight.shown;	
	}
};