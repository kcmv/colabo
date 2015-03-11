(function () { // This prevents problems when concatenating scripts that aren't strict.
'use strict';

/* Configuration */
var envs = {
	"server": {
		"server": {
			"frontend": "http://litterra.info:8040/app",
			"backend": "http://litterra.info:8042",
			"parseResponse": true,
			"jsonPrefixed": ")]}',\n"
		},
	},
	"localhost": {
		"server": {
			"frontend": "http://localhost:8040/app",
			"backend": "http://localhost:8042",
			"parseResponse": true,
			"jsonPrefixed": ")]}',\n"
		},
	},
	"json": {		
		"server": {
			"frontend": "http://localhost:8040/app",
			"backend": "http://localhost:8040/app/data",
			"parseResponse": false
		}
	}
};
//var env = envs['json']; 
var env = envs.json; 

angular.module('Config', [])
	.constant("ENV", env);

}()); // end of 'use strict';