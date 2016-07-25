//if we are providing a global variables we need to get them out of use-strict-function pattern
var sessions;

(function () { // This prevents problems when concatenating scripts that aren't strict.
'use strict';

/**
* @description
* ## Info
* This namespace contains sessions puzzle that track sessions happening in the CollaboFramework system
* @namespace sessions
*/
if(typeof puzzles.sessions === 'undefined')
    puzzles.sessions = {};

}()); // end of 'use strict';
