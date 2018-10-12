(function () { // This prevents problems when concatenating scripts that aren't strict.
'use strict';
//this function is strict...

/**
* the namespace for the Request component
* It supports sending requests from CF clients to moderators
* @namespace request
*/

// THE WHOLE FILE IS NECESSARY FOR NG1 to create a placeholder for NG1 module
var requestServices = angular.module('requestServices', ['ngResource', 'Config']);

}()); // end of 'use strict';
