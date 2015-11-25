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
	// Attributes
	var board = argBoard;
	var ancestor;
	var cost;
	var parentPlayed;

	// Set
	this.setBoard			= function (newBoard)			{this.board = newBoard;};
	this.setCost			= function (newCost)			{this.cost = newCost;};
	this.setAncestor		= function (newAncestor)		{this.ancestor = newAncestor;};
	this.setAncestorPlayed	= function (newAncestorPlayed)	{this.ancestorPlayed = newAncestorPlayed;};

	// Get
	this.getBoard			= function () {return this.board;};
	this.getAncestor		= function () {return this.ancestor;};
	this.getCost 			= function () {return this.cost;};
	this.getAncestorPlayed	= function () {return this.ancestorPlayed;};

	
	// Methods
	this.evaluation = function () {
		return this.cost + this.board.getCompleteness();
	};

	this.generateNeighbors = function () {
		var sideBoards = [
			this.board.up(),
			this.board.down(),
			this.board.left(),
			this.board.right()
		];


		var neighbors = [];

		// Up node
		if (sideBoards[0] !== false) {
			var upNode = new Node(sideBoards[0]);
			upNode.setAncestorPlayed("U");
			neighbors.push(upNode);
		};

		// Left node
		if (sideBoards[1] !== false) {
			var downNode = new Node(sideBoards[1]);
			downNode.setAncestorPlayed("D");			
			neighbors.push(downNode);
		};

		// Down node
		if (sideBoards[2] !== false) {
			var leftNode = new Node(sideBoards[2]);
			leftNode.setAncestorPlayed("L");			
			neighbors.push(leftNode);
		};

		// Right node
		if (sideBoards[3] !== false) {
			var rightNode = new Node(sideBoards[3]);
			rightNode.setAncestorPlayed("R");			
			neighbors.push(rightNode);
		};

		for (var i = 0; i < neighbors.length; i++) {
			neighbors[i].setAncestor(this);
			neighbors[i].setCost(this.cost + 1);
		};

		return neighbors.sort(Board.compare);
	};

	// Constructor
	this.setBoard(argBoard);
};

// Object comparison
Node.compare = function (N1, N2) {
	return Board.compare(N1.getBoard(), N2.getBoard());
};