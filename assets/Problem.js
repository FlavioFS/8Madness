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
	Problem.MAX_ITERATIONS = 200;

	// Accessible Atributes
	var _solved = false;
	var _solution = "";
	var _steps = 0;
	
	// Hidden Attributes
	var _startingBoard = new Board(View.loadBoard());
	var _root = new Node(_startingBoard);
	_root.setCost(0);
	var _pQueue = [_root];
	

	// Get
	this.solved    = function () { return _solved;			 };
	this.solution  = function () { return _solution.slice(); };
	this.stepCount = function () { return _steps;			 };

	// Private Methods
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
			
			else if (j === _pQueue.length) {
				_pQueue.push(insertingThis[i]);
			}
		}
	}


	// Priviledged Methods
	this.solve = function () {

		var solveBtn = $(".solveBtn")[0];
		// solveBtn.disabled = true;

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
			
			console.log("--------------" + counting + "--------------")
			for (var i = 0; i < _pQueue.length; i++) {
				console.log(_pQueue[i] + " ....... " + _pQueue[i].evaluation());
			}

			_1st = _pQueue.shift();
			newGuys = _1st.generateNeighbors();
			counting++;
			sortedInsertion(newGuys);
		}

		// When the whole graph
		if ((_pQueue === []) || (counting === Problem.MAX_ITERATIONS)) {
			_solved = false;
			_solvable = false;
			return false;
		}
		else{
			_solved = true;
			_steps = _1st.cost;

			var _goingUp = _1st;
			_steps = 0;
			//_solution += " " + _1st.ancestorPlayed();
			while (_goingUp != _root) {
				_solution += " " + _goingUp.ancestorPlayed();
				_goingUp = _goingUp.ancestor();
				_steps++;
			}

			_solution = _solution.split(" ").reverse().join(" ");

			return true;
		}
		
		// solveBtn.disabled = false;
	};
}