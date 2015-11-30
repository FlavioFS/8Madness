function Set () {
	
	// Private attributes
	var _elements = [1, 4, 8, 11, 23, 100];

	// Priviledged Methods
	
	//// Get Methods
	this.elements = function () { return _elements.slice();     };
	this.size     = function () { return _elements.length; };

	//// Read-only
	this.searchElement = function (argElement) {
		if (_elements.length == 0) { return {found: false, position: i}; }
		if (argElement  < _elements[0])                    { return {found: false,  position: 0}; }
		if (argElement == _elements[_elements.length - 1]) { return {found: true,   position: _elements.length - 1}; }
		if (argElement  > _elements[_elements.length - 1]) { return {found: false,  position: _elements.length    }; }

		function searchRecursion (_first, _last) {
			var i = Math.floor( (_first + _last)/2 );

			// Found
			if (_elements[i] == argElement) { return {found:  true, position: i  }; }
			if (_first == _last) 			{ return {found: false, position: i+1}; }
			
			// Not found and may be at left
			if (argElement < _elements[i]) {
				var j = Math.floor( (_first + i)/2 );

				if (j == i) { return {found: false, position: i+1}; }	// Not found at all
				return searchRecursion(_first, i);						// May be at left
			}

			// Not found and may be at right
			if (_elements[i] < argElement) {
				var j = Math.floor( (i + _last)/2 );

				if (j == i) { return {found: false, position: i+1}; };	// Not found at all
				return searchRecursion(i, _last);						// May be at right
			}
		}

		return searchRecursion(0, _elements.length - 1);
	};

	//// Write
	this.insert = function (newElement) {
		var _search = this.searchElement(newElement);

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