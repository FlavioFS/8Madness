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
	Problem.MAX_THEORETICAL = 362880;		// The graph has 9! states (9! = 362880).
	Problem.MAX_ITERATIONS = 128000;		// Too much for A*
	Problem.MAX_ITERATIONS_LIGHT = 9000;	// When the starting board is close to the solution

	// Accessible Atributes
	var _solved = false;	// The puzzle was solved?
	var _solvable = true;	// The puzzle is solvable?
	var _solution = "";		// This is the solution (when there is one)
	var _steps = 0;			// What is the size of the solution?
	var _expanded = 0;		// How many nodes this algorithm has expanded?
	
	// Hidden Attributes
	var _startingBoard = new Board(View.loadBoard());	// The queried board
	var _root = new Node(_startingBoard);				// The first node, created from the queried board
	_root.setCost(0);									// Initial cost is zero
	var _pQueue = [_root];								// The priority (evaluation-ordered) queue of Nodes to expand
	

	// Get
	this.solved    = function () { return _solved;			 };
	this.solvable  = function () { return _solvable;		 };
	this.solution  = function () { return _solution.slice(); };
	this.stepCount = function () { return _steps;			 };
	this.expanded  = function () { return _expanded;		 };

	// -------------------- A* --------------------
	//// Private
	////// Inserts a sorted list in the priority queue and maintains the sorting property
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

			// ...and inserts it.
			if ((j < _pQueue.length) && ( !insertingThis[i].board().equals(_pQueue[j].board()) )) {
				_pQueue.splice(j, 0, insertingThis[i]);
			}
			
			// When it is the last one (the biggest), push it to the end
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

		// Not solved yet
		_expanded = 1;								// At the beginning, 1 Node is expanded: the root
		var _1st = _pQueue.shift();					// Pops a node
		var _newGuys = _1st.generateNeighbors();	// Generate its neighbors
		var _pastStates = new Set();				// A set to save the visited nodes to prevent re-visiting
		_pastStates.insert(_1st.toInt());
		sortedInsertionAStar(_newGuys);				// Merges the neighbors with the queue without unsorting
		var _maxExpansions;							// Won't expand more than this amount of nodes. Unnecessary.


		// A simple case (close to the solution)
		if (_root.evaluation() < 9) { _maxExpansions = Problem.MAX_ITERATIONS_LIGHT; }

		// A not so simple case (more steps required)
		else { _maxExpansions = Problem.MAX_ITERATIONS; }

		/* Stops when:
		 * 	1. Finds the solution;
		 * 	2. The queue is empty (searched the whole graph and there is no solution)!
		 * 	3. Searched enough to know that there is no solution and it is just wasting time.
		 */
		while ( (!_1st.board().finalState()) && (_pQueue !== []) && (_expanded < _maxExpansions) ) {
			// Pops a Node
			_1st = _pQueue.shift();

			// This guy is a new Node!
			if ( !_pastStates.searchElement(_1st.toInt()).found ) {
				_pastStates.insert(_1st.toInt());		// Now, it is not new anymore
				_newGuys = _1st.generateNeighbors();	// Generates its neighbors

				// Search and remove the neighbors that are repeated nodes
				for (var i = 0; i < _newGuys.length; i++) {
					if ( _pastStates.searchElement(_newGuys[i].toInt()).found ) {
						_newGuys.splice(i, 1);
					}
				}

				// If there is still some new node among the neighbors, merge with the queue
				if (_newGuys.length > 0)
					{ sortedInsertionAStar(_newGuys); }
			}
			
			// One more Node expanded
			_expanded++;

		}

		// Solution not found: the queue is over or the limit was reached
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

			// Generates the solution by climbing the ancestors tree
			var _goingUp = _1st;
			_steps = 0;
			while (_goingUp != _root) {
				_solution += " " + _goingUp.ancestorPlayed();
				_goingUp = _goingUp.ancestor();
				_steps++;
			}

			// By climbing the tree, the solution obtained is inverted
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

		// Not solved yet
		_expanded = 0;								// At the beginning, 1 Node is expanded: the root
		var _1st = _pQueue.shift();					// Pops a node
		var _newGuys = _1st.generateNeighbors();	// Generate its neighbors
		var _pastStates = new Set();				// A set to save the visited nodes to prevent re-visiting
		_pastStates.insert(_1st.toInt());			

		sortedInsertionBFS(_newGuys);				// Merges the neighbors with the queue without unsorting

		/* Stops when:
		 * 	1. Finds the solution;
		 * 	2. The queue is empty (searched the whole graph and there is no solution)!
		 * 	3. Searched enough to know that there is no solution and it is just wasting time.
		 * 	P.S. BFS is not good, so it always uses the theoretical limit.
		 */
		while ( (!_1st.board().finalState()) && (_pQueue !== []) && (_expanded < Problem.MAX_THEORETICAL) ) {
			// Pops a Node
			_1st = _pQueue.shift();

			// This guy is a new Node!
			if ( !_pastStates.searchElement(_1st.toInt()).found ) {
				_pastStates.insert(_1st.toInt());		// Now, it is not new anymore
				_newGuys = _1st.generateNeighbors();	// Generates its neighbors

				// Search and remove the neighbors that are repeated nodes
				for (var i = 0; i < _newGuys.length; i++) {
					if ( _pastStates.searchElement(_newGuys[i].toInt()).found ) {
						_newGuys.splice(i, 1);
					}
				}

				// If there is still some new node among the neighbors, merge with the queue
				if (_newGuys.length > 0)
					{ sortedInsertionBFS(_newGuys); }
			}
			
			// One more Node expanded
			_expanded++;
		}

		// Solution not found: the queue is over or the limit was reached
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

			// Generates the solution by climbing the ancestors tree
			var _goingUp = _1st;
			_steps = 0;
			while (_goingUp != _root) {
				_solution += " " + _goingUp.ancestorPlayed();
				_goingUp = _goingUp.ancestor();
				_steps++;
			}

			// By climbing the tree, the solution obtained is inverted
			_solution = _solution.split(" ").reverse().join(" ");

			return true;
		}
	};
}