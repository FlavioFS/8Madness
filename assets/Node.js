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
	var _boardObj;			// A board object
	var _cost;				// The amount of movements required to reach this state
	var _ancestor;			// The node that generated this node
	var _ancestorPlayed;	// Which move the parent node used to generate this node

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


	// Override - String Representation
	this.toString = function () {
		return _boardObj.toString();
	};

	
	// Priviledged Methods
	this.evaluation = function () {
		return _cost + _boardObj.completeness();
	};

	// Returns a SORTED (by evaluation) array of 2~4 Nodes containing the neighbors
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

		// Sorting the neighbors by evaluation
		neighbors.sort( function (a, b) { return a.evaluation() - b.evaluation(); } );
		return neighbors;
	};


	// Compact representation of a node
	this.toInt = function () {
		var _strValue = "";
		var _boardArray = _boardObj.boardArray();

		for (var i = 0; i < _boardArray.length; i++) {
			_strValue += _boardArray[i];
		}

		return parseInt(_strValue, 10);
	};


	// Constructor
	this.setBoard(argBoard);
};