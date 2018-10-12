//if we are providing a global variables we need to get them out of use-strict-function pattern
var brainstormings;

(function () { // This prevents problems when concatenating scripts that aren't strict.
'use strict';

/**
* @description
* ## Info
* This namespace contains brainstormings puzzle that track brainstormings happening in the CollaboFramework system
* @namespace brainstormings
*/
if(typeof puzzles.brainstormings === 'undefined')
    puzzles.brainstormings = {};

}()); // end of 'use strict';
