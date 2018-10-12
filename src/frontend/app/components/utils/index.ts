/**
* the root namespace for the whole KnAllEdge system
* @namespace utils
*/

//if we are providing a global variables we need to get them out of use-strict-function pattern
export var utils:any;

(function () { // This prevents problems when concatenating scripts that aren't strict.
'use strict';

/**
* @description
* ## Info
* This namespace contains context logic of the utils part of the CollaboFramework
* @namespace utils
*/
if(typeof utils === 'undefined') utils = {
    Injector: null
};

}()); // end of 'use strict';
