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
	// Atributes
	var solved = false;
	var solution = " ";
	
	var startingBoard = new Board(BoardView.loadBoard());
	var root = new Node(startingBoard);
	root.setCost(0);
	var pQueue = [root];
	var steps = 0;

	// Get
	this.getSolved   = function () { return solved; };
	this.getSolution = function () { return solution.slice(); };
	this.getSteps	 = function () { return steps; };

	// Private Methods
	function sortedInsertion (insertingThis) {
		var j = 0;
		for (var i = 0; i < insertingThis.length; i++) {
			
			// Empty list
			if (pQueue.length === 0) {
				for (var k = 0; k < insertingThis.length; k++) {
					pQueue.push(insertingThis[k]);
				}
				return;
			}

			// Finds where it should be...
			console.log("insertingThis, pQueue");
			console.log(insertingThis);
			console.log(pQueue);
			while ((insertingThis[i].evaluation() > pQueue[j].evaluation()) && (j < pQueue.length)) {
				console.log(pQueue);
				console.log(j);
				j++;
			}

			// ...and insert it.
			if ((j < pQueue.length - 1) && ( !insertingThis[i].getBoard().equals(pQueue[j].getBoard()) )) { pQueue.splice(j, 0, insertingThis[i]); }
			else if (j === pQueue.length) { pQueue.push(insertingThis[i]); }
		}
	}

	// Methods
	this.solve = function () {
		var solveBtn = $(".solveBtn")[0];
		// solveBtn.disabled = true;

		// Already solved
		console.log("start:\n" + startingBoard);
		if (startingBoard.finalState()) {
			solution = "Ø";
			this.steps = 0;
			return false;
		}

		console.log("pQueue (1st)");
		console.log(pQueue);
		var _1st = pQueue.shift();
		var newGuys = _1st.generateNeighbors();
		sortedInsertion(newGuys);
		while ( !_1st.getBoard().finalState() ) {
			console.log("pQueue");
			console.log(pQueue);

			_1st = pQueue.shift();
			newGuys = _1st.generateNeighbors();
			sortedInsertion(newGuys);
		};

		this.solved = true;
		this.steps = _1st.getCost();

		var _goingUp = _1st;
		steps = 1;
		solution += " " + _1st.getAncestorPlayed();
		while (_goingUp.getAncestor()) {
			solution += " " + _goingUp.getAncestorPlayed();
			_goingUp = _goingUp.getAncestor();
			steps++;
		};

		// solveBtn.disabled = false;
		return true;		
	};
};