//if we are providing a global variables we need to get them out of use-strict-function pattern
var knalledge;

(function () { // This prevents problems when concatenating scripts that aren't strict.
'use strict';

// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/getPrototypeOf
// pollyfil for missing Object.getPrototypeOf
// http://stackoverflow.com/questions/7662147/how-to-access-object-prototype-in-javascript
if(!Object.getPrototypeOf) {
	if( ({}).__proto__ === Object.prototype && ([]).__proto__ === Array.prototype ) {
		Object.getPrototypeOf = function getPrototypeOf(object) {
			return object.__proto__;
		};
	} else {
		Object.getPrototypeOf=function getPrototypeOf(object) {
			// May break if the constructor has been changed or removed
			return object.constructor ? object.constructor.prototype : void 0;
		};
	}
}

knalledge = {};

}()); // end of 'use strict';