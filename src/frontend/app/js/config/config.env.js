(function () { // This prevents problems when concatenating scripts that aren't strict.
'use strict';

/* Configuration */
var envs = {
	"server": {
		"server": {
			"frontend": "http://headsware.com/mcm/McMap/app",
			"backend": "http://headsware.com/mcm/McMap/app/data",
			"parseResponse": true,
			"jsonPrefixed": ")]}',\n"
		},
	},
	"localhost": {
		"server": {
			"frontend": "http://localhost:8410/app",
			"backend": "http://localhost:8888",
			"parseResponse": true,
			"jsonPrefixed": ")]}',\n"
		},
	},
	"json": {		
		"server": {
			"frontend": "http://localhost:8410/app",
			"backend": "http://localhost:8410/app/data",
			"parseResponse": false
		}
	}
};

// var env = envs.json;
var env = envs.localhost;
// var env = envs.server;

angular.module('Config')
	.constant("ENV", env);

}()); // end of 'use strict';