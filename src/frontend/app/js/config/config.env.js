(function () { // This prevents problems when concatenating scripts that aren't strict.
'use strict';

/* Configuration */
var envs = {
	// "server_prod": {
	// 	"server": {
	// 		"frontend": "http://colabo.space/prod",
	// 		"backend": "http://colabo.space:8888",
	// 		"topichat": "http://colabo.space:8060",
	// 		"parseResponse": true,
	// 		"jsonPrefixed": ")]}',\n"
	// 	},
	// },
	"server_prod": {
		"server": {
			"frontend": "http://colabo.space/prod",
			"backend": "http://api.colabo.space",
			"topichat": "http://topichat.colabo.space",
			"parseResponse": true,
			"jsonPrefixed": ")]}',\n"
		},
	},
	"server_beta": {
		"server": {
			"frontend": "http://colabo.space/beta",
			"backend": "http://api.colabo.space",
			"topichat": "http://topichat.colabo.space",
			"parseResponse": true,
			"jsonPrefixed": ")]}',\n"
		},
	},
	"localhost": {
		"server": {
			"frontend": "http://localhost:5555/app",
			//"backend": "http://localhost:5858",
			"backend": "http://localhost:8001",
			"topichat": "http://localhost:8002",
			"parseResponse": true,
			"jsonPrefixed": ")]}',\n"
		},
	},
	"forking": {
		"server": {
			"frontend": "http://_www.colabo.space:8088/app",
			"backend": "http://_api.colabo.space:8088",
			"topichat": "http://_topichat.colabo.space:8088",
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
// var env = envs.forking;
// var env = envs.server_prod;
// var env = envs.server_beta;

if(typeof window.Config === 'undefined') window.Config = {};
window.Config.ENV = env;

angular.module('Config')
	.constant("ENV", env);

}()); // end of 'use strict';
