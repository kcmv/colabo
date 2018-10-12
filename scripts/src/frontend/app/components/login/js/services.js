(function () { // This prevents problems when concatenating scripts that aren't strict.
'use strict';
//this function is strict...

var removeJsonProtected = function(ENV, jsonStr){
	if(ENV.server.jsonPrefixed && jsonStr.indexOf(ENV.server.jsonPrefixed) === 0){
		jsonStr = jsonStr.substring(ENV.server.jsonPrefixed.length);
	}
	return jsonStr;
};

var loginServices = angular.module('loginServices', ['ngResource', 'Config']);

/**
* 	provider 'WhoAmIService'
*/

loginServices.provider('LoginService', {
	// privateData: "privatno",
	$get: ['$q', 'ENV',
	function($q, ENV) {
		var provider = {
			config: {
			},

			init: function(){
			}
		};
		provider.init();
		return provider;
	}]
});

}()); // end of 'use strict';