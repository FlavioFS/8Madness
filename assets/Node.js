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
	var board;
	var parent;
	var cost;
	var parentPlayed;

	// Set
	this.setBoard		 = function (newBoard)		  {this.board = newBoard;}
	this.setParent 		 = function (newParent)		  {this.parent = newParent;}
	this.setCost		 = function (newCost)		  {this.cost = newCost;}
	this.setParentPlayed = function (newParentPlayed) {this.parentPlayed = newParentPlayed;}

	// Get
	this.getBoard  		 = function () {return this.board;}
	this.getParent 		 = function () {return this.parent;}
	this.getCost   		 = function () {return this.cost;}
	this.getParentPlayed = function () {return this.parentPlayed;}

	
	// Methods
	this.evaluation = function () {
		return this.cost + this.board.completeness();
	}

	this.generateNeighbors = function () {
		// body...
	}

	// Constructor
	this.setBoard(argBoard);
};

// Object comparison
Node.compare = function (N1, N2) {
	return Board.compare(N1.getBoard(), N2.getBoard());
};