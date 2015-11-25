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


	// Override
	this.toString = function () {
		return this.board.toString();
	};

	
	// Methods
	this.evaluation = function () {
		return this.cost + this.board.getCompleteness();
	};

	this.generateNeighbors = function () {
		var sideBoards = this.board.generateNeighbors();
		var neighbors = [];

		// Up node
		if (sideBoards[0] !== false) {
			var upNode = new Node(sideBoards[0]);
			upNode.setAncestorPlayed(Node.ARROWS.U);
			neighbors.push(upNode);
		};

		// Down node
		if (sideBoards[1] !== false) {
			var downNode = new Node(sideBoards[1]);
			downNode.setAncestorPlayed(Node.ARROWS.D);
			neighbors.push(downNode);
		};

		// Left node
		if (sideBoards[2] !== false) {
			var leftNode = new Node(sideBoards[2]);
			leftNode.setAncestorPlayed(Node.ARROWS.L);
			neighbors.push(leftNode);
		};

		// Right node
		if (sideBoards[3] !== false) {
			var rightNode = new Node(sideBoards[3]);
			rightNode.setAncestorPlayed(Node.ARROWS.R);
			neighbors.push(rightNode);
		};

		// Shared properties
		for (var i = 0; i < neighbors.length; i++) {
			neighbors[i].setAncestor(this);
			neighbors[i].setCost(this.cost + 1);
		};


		neighbors.sort( function (a, b) {return a.evaluation() - b.evaluation()} );
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