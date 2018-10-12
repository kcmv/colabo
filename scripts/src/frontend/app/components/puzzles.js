//if we are providing a global variables we need to get them out of use-strict-function pattern
var puzzles;

(function () { // This prevents problems when concatenating scripts that aren't strict.
'use strict';

/**
* @description
* ## Info
* This namespace contains all puzzles that are added on the top of core of CollaboFramework
* @namespace puzzles
*/
if(typeof puzzles == 'undefined') puzzles = {};

}()); // end of 'use strict';
