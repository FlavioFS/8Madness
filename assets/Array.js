// Overriding "equals" method

// Is it coded already?
if (Array.prototype.equals)
	console.warn("Overriding existing Array.prototype.equals.");

Array.prototype.equals = function(argArray) {
	// Invalid cases
	if (!argArray) {return false;};
	if (argArray.length != this.length) {return false;};

	for (var i = 0; i < this.length; i++) {

		// Nested Arrays
		if (this[i] instanceof Array && argArray[i] instanceof Array) {
			if (!this.i.equals(argArray.i)) {
				return false;
			};
		}
		else if (this[i] != argArray[i]) {
			 return false;
		};
	};

	return true;
};

Object.defineProperty(Array.prototype, "equals", {enumerable:false});