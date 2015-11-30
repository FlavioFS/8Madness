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
	Problem.MAX_ITERATIONS = 25000; // The graph has 9! states (9! = 362880).

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

		// Already solved
		if (_startingBoard.finalState()) {
			_solution = "Ø";
			_steps = 0;
			return false;
		}

		var _counting = 0;
		var _1st = _pQueue.shift();
		var _newGuys = _1st.generateNeighbors();
		var _pastStates = new Set();
		_pastStates.insert(_1st.toInt());

		sortedInsertion(_newGuys);

		while ( (!_1st.board().finalState()) && (_pQueue !== []) && (_counting < Problem.MAX_ITERATIONS) ) {
			_1st = _pQueue.shift();

			if ( !_pastStates.searchElement(_1st.toInt()).found ) {
				_pastStates.insert(_1st.toInt());
				_newGuys = _1st.generateNeighbors();
				sortedInsertion(_newGuys);
			}
			
			_counting++;

			// console.log(_1st.toInt() + " 's evalutaion = " + _1st.evaluation());
		}

		// Solution not found
		if ((_pQueue === []) || (_counting === Problem.MAX_ITERATIONS)) {
			_solved = false;
			_solvable = false;
			_solution = "How dare you trick me with an unsolvable puzzle!?";
			
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

			return true;
		}
	};
}