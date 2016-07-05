//if we are providing a global variables we need to get them out of use-strict-function pattern
var changes;

(function () { // This prevents problems when concatenating scripts that aren't strict.
'use strict';

/**
* @description
* ## Info
* This namespace contains changes puzzle that track changes happening in the CollaboFramework system
* @namespace changes
*/
if(typeof puzzles.changes === 'undefined') 
    puzzles.changes = {};

}()); // end of 'use strict';
