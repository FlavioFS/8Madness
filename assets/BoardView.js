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
	var pieces = $(".piece");
	var squaresArray = [1, 2, 3, 4, 5, 6, 7, 8, 0];
	
	// Checks all elements
	for (var i = 0; i < pieces.length; i++) {
		var horizontalPosition = 0;
		
		// Searching for the horizontal position
		for (var x = 0; x < BoardView.COORDINATES.length; x++) {
			if (pieces[i].style.left == BoardView.COORDINATES[x])
				{ horizontalPosition = x; }			
		};

		// Checks "top" value for each element
		for (var y = 0; y < BoardView.COORDINATES.length; y++) {
			if (pieces[i].style.top  == BoardView.COORDINATES[y])
				{ squaresArray[3*y + horizontalPosition] = parseInt(pieces[i].innerHTML); };
		};
	};

	// Initial state of light
	if (squaresArray.equals([1, 2, 3, 4, 5, 6, 7, 8, 0])) {
		BoardView.setFinal(true);
	}
	else {
		BoardView.setFinal(false);
	}

	return squaresArray;
};

// [1.2] - Swaps two squares
BoardView.swap = function (Va, Vb) {
	pieces = $(".piece");
	sqrA = pieces[Va];
	sqrB = pieces[Vb];

	temp = [sqrA.style.left, sqrA.style.top];
	
	sqrA.style.left = sqrB.style.left;
	sqrA.style.top  = sqrB.style.top;
	
	sqrB.style.left = temp[0];
	sqrB.style.top  = temp[1];
};

BoardView.setFinal = function (bool) {
	var _signal = $(".signal");

	if (bool === true) {
		_signal.addClass("finished");
		document.getElementsByClassName('solveBtn')[0].disabled = true;
		document.getElementsByClassName('showBtn')[0].disabled = true;
	}
	else {
		_signal.removeClass("finished");
		document.getElementsByClassName('solveBtn')[0].disabled = false;
		document.getElementsByClassName('showBtn')[0].disabled = false;
	};
};