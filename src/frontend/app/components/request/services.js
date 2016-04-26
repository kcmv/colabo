(function () { // This prevents problems when concatenating scripts that aren't strict.
'use strict';
//this function is strict...

// THE WHOLE FILE IS NECESSARY FOR NG1 to create a placeholder for NG1 module
var requestServices = angular.module('requestServices', ['ngResource', 'Config']);

}()); // end of 'use strict';
