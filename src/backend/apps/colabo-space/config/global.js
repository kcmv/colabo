'use strict';

// this is file is imported and exported 
// to the rest of the system through the puzzle
// `@colabo-utils/config`

// the initializing part of the application
// like the apps/<app_name>/index.ts in the backend
// or apps/<app_name>/src/main.ts
// should (somehow) load it and pass it to 
// the init method of the puzzle `@colabo-utils/config`

// TODO: get params into separate property, 
// to less risk and polute the global variable
console.log("Setting up the global variable");

var path = require('path');

// expose this function to our app using module.exports
if (!global.hasOwnProperty('paths')) {
	console.log("Setting up global.paths");
	global.paths = {
		// local
		EXPERIMENTS_FOLDER: path.resolve(__dirname+"/../../../../experiments")
		// server
		// EXPERIMENTS_FOLDER: path.resolve("/var/www_support/bukvik/experiments/experiments-zns")
	};
	global.paths.DATASET_FOLDER = path.resolve(global.paths.EXPERIMENTS_FOLDER + "/data");
	global.paths.FOLDER_OUT = path.resolve(global.paths.DATASET_FOLDER + "/out");
	global.paths.FOLDER_CACHE = path.resolve(global.paths.EXPERIMENTS_FOLDER + "/cache");
}

if (!global.hasOwnProperty('dbConfig')) {
	console.log("Setting up global.dbConfig");
	global.dbConfig = {
		newConnect: true,
		dbName: "KnAllEdge",
		domain: '127.0.0.1',
		port: 27017,
		user: 'user',
		pass: 'pass'
	};
}

if (!global.hasOwnProperty('puzzles')) {
	console.log("Setting up global.puzzles");
	global.puzzles = {
		'@colabo-topiChat/b-talk': {
			saveTalkToMap: true,
			mapId: "5b96619b86f3cc8057216a03",
			iAmId: "1b96619b86f3cc8057216a05",
			nodeId: ""
		}
	};
}

module.exports = global;
