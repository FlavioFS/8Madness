/* ||||||     ||||    ||||||||||||    ||||||||||      ||||||||||||    ||||||
 * ||||||||  || ||    ||||    ||||    ||||||    ||    ||||||          ||||||
 * |||||| ||||  ||    ||||    ||||    ||||||    ||    ||||||          ||||||
 * ||||||  ||   ||    ||||    ||||    ||||||    ||    ||||||||||||    ||||||
 * ||||||       ||    ||||    ||||    ||||||    ||    ||||||          ||||||
 * ||||||       ||    ||||    ||||    ||||||    ||    ||||||          ||||||
 * ||||||       ||    ||||||||||||    ||||||||||      ||||||||||||    ||||||||||||
 */
/* ===============================================================================
                          Class Definition: "Node"
=============================================================================== */
// Defines the tree structure
function Node (argBoard) {

	// Private Attributes
	var _boardObj;
	var _cost;
	var _ancestor;
	var _ancestorPlayed;

	// Set
	this.setBoard			= function (newBoard)			{ _boardObj		  = newBoard;		   };
	this.setCost			= function (newCost)			{ _cost			  = newCost;		   };
	this.setAncestor		= function (newAncestor)		{ _ancestor		  = newAncestor;	   };
	this.setAncestorPlayed	= function (newAncestorPlayed)	{ _ancestorPlayed = newAncestorPlayed; };

	// Get
	this.board			= function () { return _boardObj;		};
	this.cost 			= function () { return _cost;			};
	this.ancestor		= function () { return _ancestor;		};
	this.ancestorPlayed	= function () { return _ancestorPlayed;	};


	// Override
	this.toString = function () {
		return _boardObj.toString();
	};

	
	// Priviledged Methods
	this.evaluation = function () {
		return _cost + _boardObj.completeness();
	};

	this.generateNeighbors = function () {
		var sideBoards = _boardObj.generateNeighbors();
		var neighbors = [];

		/* >>>>>>>>> IMPORTANT <<<<<<<<<
		 *		In this model the 0 square is moving,
		 * but in the game mechanics, the key press
		 * moves the 0 in the opposite direction.
		 * Therefore, the arrows must be inverted below.
		 */
		// Up node
		if (sideBoards[0] !== false) {
			var upNode = new Node(sideBoards[0]);
			upNode.setAncestorPlayed(View.ARROWS.D);
			neighbors.push(upNode);
		};

		// Down node
		if (sideBoards[1] !== false) {
			var downNode = new Node(sideBoards[1]);
			downNode.setAncestorPlayed(View.ARROWS.U);
			neighbors.push(downNode);
		};

		// Left node
		if (sideBoards[2] !== false) {
			var leftNode = new Node(sideBoards[2]);
			leftNode.setAncestorPlayed(View.ARROWS.R);
			neighbors.push(leftNode);
		};

		// Right node
		if (sideBoards[3] !== false) {
			var rightNode = new Node(sideBoards[3]);
			rightNode.setAncestorPlayed(View.ARROWS.L);
			neighbors.push(rightNode);
		};

		// Shared properties
		for (var i = 0; i < neighbors.length; i++) {
			neighbors[i].setAncestor(this);
			neighbors[i].setCost(_cost + 1);
		};


		neighbors.sort( function (a, b) { return a.evaluation() - b.evaluation(); } );
		return neighbors;
	};


	// Constructor
	this.setBoard(argBoard);
};

// Object comparison
// Node.compare = function (N1, N2) {
// 	if (N1.evaluation() < N2.evaluation()) return -1;
// 	if (N1.evaluation() > N2.evaluation()) return  1;

// 	return 0;
// };
