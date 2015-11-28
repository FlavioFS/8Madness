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
	// Static variables
	Node.ARROWS = {U: "&uarr;", D: "&darr;", L: "&larr;", R: "&rarr;"};

	// Private Attributes
	var _board = argBoard;
	var _cost;
	var _ancestor;
	var _ancestorPlayed;

	// Set
	this.setBoard			= function (newBoard)			{ _board		  = newBoard;		   };
	this.setCost			= function (newCost)			{ _cost			  = newCost;		   };
	this.setAncestor		= function (newAncestor)		{ _ancestor		  = newAncestor;	   };
	this.setAncestorPlayed	= function (newAncestorPlayed)	{ _ancestorPlayed = newAncestorPlayed; };

	// Get
	this.getBoard			= function () { return _board.slice();	};
	this.getCost 			= function () { return _cost;			};
	this.getAncestor		= function () { return _ancestor;		};
	this.getAncestorPlayed	= function () { return _ancestorPlayed;	};


	// Override
	this.toString = function () {
		return _board.toString();
	};

	
	// Public Methods
	this.evaluation = function () {
		return _cost + _board.getCompleteness();
	};

	this.generateNeighbors = function () {
		var sideBoards = _board.generateNeighbors();
		var neighbors = [];

		// Up node
		if (sideBoards[0] !== false) {
			var upNode = new Node(sideBoards[0]);
			upNode._ancestorPlayed(Node.ARROWS.U);
			neighbors.push(upNode);
		};

		// Down node
		if (sideBoards[1] !== false) {
			var downNode = new Node(sideBoards[1]);
			downNode._ancestorPlayed(Node.ARROWS.D);
			neighbors.push(downNode);
		};

		// Left node
		if (sideBoards[2] !== false) {
			var leftNode = new Node(sideBoards[2]);
			leftNode._ancestorPlayed(Node.ARROWS.L);
			neighbors.push(leftNode);
		};

		// Right node
		if (sideBoards[3] !== false) {
			var rightNode = new Node(sideBoards[3]);
			rightNode._ancestorPlayed(Node.ARROWS.R);
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
