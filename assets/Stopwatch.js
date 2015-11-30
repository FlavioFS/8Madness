// A class for time measuring
function Stopwatch(){
  // Private Attributes
  var _start, _end;

  // Priviledged Methods
  this.start = function () { _start = new Date(); };
  this.stop  = function () { _end   = new Date(); };

  this.clear = function () {
    _start = null;
    _end = null;
  }

  //// Get Methods
  this.getMilliseconds = function(){
    if (!_end) { return 0; }
    return Math.round((_end.getTime() - _start.getTime()));
  };

  this.getSeconds = function() { return this.getMilliseconds() / 1000;};
  this.getMinutes = function() { return this.getSeconds() / 60;       };
  this.getHours   = function() { return this.getSeconds() / 60 / 60;  };
  this.getDays    = function() { return this.getHours() / 24;         };
}