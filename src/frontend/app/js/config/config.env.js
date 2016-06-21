(function () { // This prevents problems when concatenating scripts that aren't strict.
'use strict';

/* Configuration */
var envs = {
	"server": {
		"server": {
			"frontend": "http://knalledge.org/app",
			"backend": "http://knalledge.org:8888",
			"topichat": "http://knalledge.org:8060",
			"parseResponse": true,
			"jsonPrefixed": ")]}',\n"
		},
	},
	"localhost": {
		"server": {
			"frontend": "http://localhost:8410/app",
			//"backend": "http://localhost:5858",
			"backend": "http://localhost:8888",
			"topichat": "http://localhost:8060",
			"parseResponse": true,
			"jsonPrefixed": ")]}',\n"
		},
	},
	"json": {
		"server": {
			"frontend": "http://localhost:8410/app",
			"backend": "http://localhost:8410/app/data",
			"topichat": "http://localhost:8060",
			"parseResponse": false
		}
	}
};

// var env = envs.json;
var env = envs.localhost;
// var env = envs.server;

if(typeof window.Config === 'undefined') window.Config = {};
window.Config.ENV = env;

angular.module('Config')
	.constant("ENV", env);

}()); // end of 'use strict';
