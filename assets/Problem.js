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
	// The graph has 9! states (9! = 362880).
	Problem.MAX_THEORETICAL = 362880;
	Problem.MAX_ITERATIONS = 128000;
	Problem.MAX_ITERATIONS_LIGHT = 9000;

	// Accessible Atributes
	var _solved = false;
	var _solvable = true;
	var _solution = "";
	var _steps = 0;
	var _expanded = 0;
	
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
	this.expanded  = function () { return _expanded;		 };

	// -------------------- A* --------------------
	//// Private
	////// Insert a sorted list in the queue and maintains the sort property
	function sortedInsertionAStar (insertingThis) {
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

	//// Priviledged
	this.solveAStar = function () {
		// Already solved
		if (_startingBoard.finalState()) {
			_solution = "Ø";
			_steps = 0;
			return false;
		}

		_expanded = 0;
		var _1st = _pQueue.shift();
		var _newGuys = _1st.generateNeighbors();
		var _pastStates = new Set();
		_pastStates.insert(_1st.toInt());

		sortedInsertionAStar(_newGuys);

		var _maxExpansions;
		if (_root.evaluation() < 9) { _maxExpansions = Problem.MAX_ITERATIONS_LIGHT; }
		else { _maxExpansions = Problem.MAX_ITERATIONS; }

		while ( (!_1st.board().finalState()) && (_pQueue !== []) && (_expanded < _maxExpansions) ) {
			_1st = _pQueue.shift();

			if ( !_pastStates.searchElement(_1st.toInt()).found ) {
				_pastStates.insert(_1st.toInt());
				_newGuys = _1st.generateNeighbors();

				// Search and remove the neighbors that are already in the set of past states
				for (var i = 0; i < _newGuys.length; i++) {
					if ( _pastStates.searchElement(_newGuys[i].toInt()).found ) {
						_newGuys.splice(i, 1);
					}
				}

				if (_newGuys.length > 0)
					{ sortedInsertionAStar(_newGuys); }
			}
			
			_expanded++;

			// console.log(_1st.toInt() + " 's evalutaion = " + _1st.evaluation());
		}

		// Solution not found
		if ((_pQueue === []) || (_expanded === _maxExpansions)) {
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

	// -------------------- BFS --------------------
	//// Private
	function sortedInsertionBFS (insertingThis) {
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
			while ((j < _pQueue.length) && (insertingThis[i].cost() > _pQueue[j].cost()))
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

	//// Priviledged
	this.solveBFS = function () {
		// Already solved
		if (_startingBoard.finalState()) {
			_solution = "Ø";
			_steps = 0;
			return false;
		}

		_expanded = 0;
		var _1st = _pQueue.shift();
		var _newGuys = _1st.generateNeighbors();
		var _pastStates = new Set();
		_pastStates.insert(_1st.toInt());

		sortedInsertionBFS(_newGuys);

		while ( (!_1st.board().finalState()) && (_pQueue !== []) && (_expanded < Problem.MAX_THEORETICAL) ) {
			_1st = _pQueue.shift();

			if ( !_pastStates.searchElement(_1st.toInt()).found ) {
				_pastStates.insert(_1st.toInt());
				_newGuys = _1st.generateNeighbors();

				// Search and remove the neighbors that are already in the set of past states
				for (var i = 0; i < _newGuys.length; i++) {
					if ( _pastStates.searchElement(_newGuys[i].toInt()).found ) {
						_newGuys.splice(i, 1);
					}
				}

				if (_newGuys.length > 0)
					{ sortedInsertionBFS(_newGuys); }
			}
			
			_expanded++;
		}

		// Solution not found
		if ((_pQueue === []) || (_expanded === Problem.MAX_THEORETICAL)) {
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