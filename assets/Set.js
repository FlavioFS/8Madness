// A data structure that allows UNIQUE instances of INTEGERS to be stored
function Set () {
	
	// Private attributes
	var _elements = [1, 4, 8, 11, 23, 100];



	// Priviledged Methods
	//// Get Methods
	this.elements = function () { return _elements.slice();     };
	this.size     = function () { return _elements.length; };

	//// Read-only
	////// Searches for an elements and returns a pair {found (boolean), position(int)}
	////// When the element is not found, the position return is where it should be (the correct spot to insert)
	this.searchElement = function (argElement) {

		/* 1. The set is empty;
		 * 2. The element queried comes before the first one;
		 * 3. The element queried if the last one;
		 * 4. The element queried comes after the last one;
		 */ 
		if (_elements.length == 0) { return {found: false, position: i}; }
		if (argElement  < _elements[0])                    { return {found: false,  position: 0}; }
		if (argElement == _elements[_elements.length - 1]) { return {found: true,   position: _elements.length - 1}; }
		if (argElement  > _elements[_elements.length - 1]) { return {found: false,  position: _elements.length    }; }

		// Remaining cases through recursive binary search
		function searchRecursion (_first, _last) {
			// The median point
			var i = Math.floor( (_first + _last)/2 );

			// Found
			if (_elements[i] == argElement) { return {found:  true, position: i  }; }

			// The search interval is unitary
			if (_first == _last) 			{ return {found: false, position: i+1}; }
			
			// Not found and may be at left
			if (argElement < _elements[i]) {
				var j = Math.floor( (_first + i)/2 );					// The median point

				if (j == i) { return {found: false, position: i+1}; }	// Not found at all
				return searchRecursion(_first, i);						// May be at left
			}

			// Not found and may be at right
			if (_elements[i] < argElement) {
				var j = Math.floor( (i + _last)/2 );					// The median point

				if (j == i) { return {found: false, position: i+1}; };	// Not found at all
				return searchRecursion(i, _last);						// May be at right
			}
		}

		// Starts the recursive search
		return searchRecursion(0, _elements.length - 1);
	};


	//// Write
	////// Inserts an element at its sorted position, if the element is not already in this set
	this.insert = function (newElement) {
		// Searches for the element
		var _search = this.searchElement(newElement);

		// When the element is not found, inserts it at the correct spot
		if (!_search.found) {
			if (_search.position == _elements.length)
				{ _elements.push(newElement); }
			else
				{ _elements.splice(_search.position, 0, newElement); }

			return true;
		}

		return false;
	};
}