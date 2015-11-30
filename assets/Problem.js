/* ||||||     ||||    ||||||||||||    ||||||||||      ||||||||||||    ||||||
 * ||||||||  || ||    ||||    ||||    ||||||    ||    ||||||          ||||||
 * |||||| ||||  ||    ||||    ||||    ||||||    ||    ||||||          ||||||
 * ||||||  ||   ||    ||||    ||||    ||||||    ||    ||||||||||||    ||||||
 * ||||||       ||    ||||    ||||    ||||||    ||    ||||||          ||||||
 * ||||||       ||    ||||    ||||    ||||||    ||    ||||||          ||||||
 * ||||||       ||    ||||||||||||    ||||||||||      ||||||||||||    ||||||||||||
 */
 
/* ===============================================================================
                          Class Definition: "Problem"
=============================================================================== */
// Defines a main board and uses a tree to solve the game
function Problem () {
	// Static Variables
	Problem.MAX_ITERATIONS = 362880; // The graph has 9! states (9! = 362880).

	// Accessible Atributes
	var _solved = false;
	var _solvable = true;
	var _solution = "";
	var _steps = 0;
	
	// Hidden Attributes
	var _startingBoard = new Board(View.loadBoard());
	var _root = new Node(_startingBoard);
	_root.setCost(0);
	var _pQueue = [_root];
	

	// Get
	this.solved    = function () { return _solved;			 };
	this.solvable  = function () { return _solvable;		 };
	this.solution  = function () { return _solution.slice(); };
	this.stepCount = function () { return _steps;			 };

	// Private Methods
	//// Insert a sorted list in the queue and maintains the sort property
	function sortedInsertion (insertingThis) {
		// Empty list
		if (_pQueue.length === 0) {
			for (var k = 0; k < insertingThis.length; k++) {
				_pQueue.push(insertingThis[k]);
			}
			return;
		}

		// Not empty
		var j = 0;
		for (var i = 0; i < insertingThis.length; i++) {

			// Finds where it should be...
			while ((j < _pQueue.length) && (insertingThis[i].evaluation() > _pQueue[j].evaluation()))
				{ j++; }

			// ...and insert it.
			if ((j < _pQueue.length) && ( !insertingThis[i].board().equals(_pQueue[j].board()) )) {
				_pQueue.splice(j, 0, insertingThis[i]);
			}
			
			// When it is the last one (the biggest)
			else if (j === _pQueue.length) {
				_pQueue.push(insertingThis[i]);
			}
		}
	}


	// Priviledged Methods
	this.solve = function () {
		// View.setSolution("8Madness is thinking. Puny humans are instructed to w8!");

		// // Starting calculation - preventing more requests
		// View.setSolveBtnEnabled(false);
		// View.setAnimateBtnEnabled(false);

		// Already solved
		if (_startingBoard.finalState()) {
			_solution = "Ø";
			_steps = 0;
			// solveBtn.disabled = false;
			return false;
		}

		var counting = 0;
		var _1st = _pQueue.shift();
		var newGuys = _1st.generateNeighbors();
		sortedInsertion(newGuys);

		while ( (!_1st.board().finalState()) && (_pQueue !== []) && (counting < Problem.MAX_ITERATIONS) ) {
			_1st = _pQueue.shift();
			newGuys = _1st.generateNeighbors();
			counting++;
			sortedInsertion(newGuys);
		}

		console.log( "counting: " + counting );
		// Solution not found
		if ((_pQueue === []) || (counting === Problem.MAX_ITERATIONS)) {
			_solved = false;
			_solvable = false;
			_solution = "How dare you tricking me with an unsolvable puzzle!?";
			
			// Finishing calculation - allowing more requests and giving feedback
			// setTimeout(
			// 	function () {
			// 		View.setSolution("How dare you tricking me with an unsolvable puzzle!?");

			// 		// Starting calculation - preventing more requests
			// 		View.setSolveBtnEnabled(true);
			// 		View.setAnimateBtnEnabled(false);
			// 	},
			// 	1
			// );

			// document.getElementsByClassName('solveBtn')[0].disabled = false;
			// View.setSolveBtnEnabled(true);
			// View.setAnimateBtnEnabled(false);

			return false;
		}

		// Solution found
		else{
			_solved = true;
			_steps = _1st.cost;

			var _goingUp = _1st;
			_steps = 0;
			while (_goingUp != _root) {
				_solution += " " + _goingUp.ancestorPlayed();
				_goingUp = _goingUp.ancestor();
				_steps++;
			}

			_solution = _solution.split(" ").reverse().join(" ");

			// View.setSolveBtnEnabled(true);
			// View.setAnimateBtnEnabled(true);

			// Finishing calculation - allowing more requests and giving feedback
			// setTimeout(
			// 	function () {
			// 		View.setSolution(_solution);

			// 		// Starting calculation - preventing more requests
			// 		View.setSolveBtnEnabled(true);
			// 		View.setAnimateBtnEnabled(true);
			// 	},
			// 	1
			// );

			return true;
		}
	};
}