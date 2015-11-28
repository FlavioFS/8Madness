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
	var _solution = " ";
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
		var j = 0;
		for (var i = 0; i < insertingThis.length; i++) {
			
			// Empty list
			if (_pQueue.length === 0) {
				for (var k = 0; k < insertingThis.length; k++) {
					_pQueue.push(insertingThis[k]);
				}
				return;
			}

			// Finds where it should be...
			// console.log("insertingThis, _pQueue");
			// console.log(insertingThis);
			// console.log(_pQueue);
			if (_pQueue[j] === undefined) {
					console.log("insertingThis, _pQueue");
					console.log(insertingThis);
					console.log(_pQueue);
					console.log(j);
			}
			while ((insertingThis[i].evaluation() > _pQueue[j].evaluation()) && (j < _pQueue.length)) {
				if (_pQueue[j] === undefined) {
					console.log(_pQueue);
					console.log(j);
				}
				j++;
			}

			// ...and insert it.
			if ((j < _pQueue.length - 1) && ( !insertingThis[i].getBoard().equals(_pQueue[j].getBoard()) )) { _pQueue.splice(j, 0, insertingThis[i]); }
			else if (j === _pQueue.length) { _pQueue.push(insertingThis[i]); }
		}
	}


	// Public Methods
	this.solve = function () {
		var _startingBoard = new Board(View.loadBoard());
		var _root = new Node(this.startingBoard);
		_root.setCost(0);
		var _pQueue = [_root];

		var solveBtn = $(".solveBtn")[0];
		// solveBtn.disabled = true;

		// Already solved
		console.log("start:\n" + _startingBoard);
		if (_startingBoard.finalState()) {
			_solution = "Ø";
			_steps = 0;
			// solveBtn.disabled = false;
			return false;
		}

		console.log("_pQueue (1st)");
		console.log(_pQueue);

		var counting = 0;
		var _1st = _pQueue.shift();

		console.log("_root");
		//console.log(_1st.getBoard());
		console.log(_root);

		console.log("_1st");
		//console.log(_1st.getBoard());
		console.log(_1st);

		var newGuys = _1st.generateNeighbors();
		sortedInsertion(newGuys);
		while ( (!_1st.getBoard().finalState()) && (_pQueue !== []) && (counting < Problem.MAX_ITERATIONS) ) {
			console.log("_pQueue");
			console.log(_pQueue);

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
			_steps = 1;
			_solution += " " + _1st.getAncestorPlayed();
			while (_goingUp.getAncestor()) {
				_solution += " " + _goingUp.getAncestorPlayed();
				_goingUp = _goingUp.getAncestor();
				_steps++;
			}

			return true;
		}
		
		// solveBtn.disabled = false;
	};
}