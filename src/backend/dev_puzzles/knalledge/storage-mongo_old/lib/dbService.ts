const MODULE_NAME:string = "@colabo-knalledge/b-storage-mongo";

var mongoose = require('mongoose');
declare let global:any;

import {GetProperty} from '@colabo-utils/i-config';

export function DBConnect(){
	let dbConfig = GetProperty('dbConfig');
  console.log("[%s] dbName: %s", MODULE_NAME, dbConfig.dbName);
  var dbConnection;
  /* connecting */
  if(dbConfig.newConnect){
  	var opts = {
			server: { useMongoClient: true, auto_reconnect: true }
  		// , user: 'username', pass: 'mypassword'
  	};
  	dbConnection = mongoose.createConnection();
  	dbConnection.on('error', function (err) {
  	  if (err){ // couldn't connect
  			console.error("dbConnection DB error: ", err);
  		  // hack the driver to allow re-opening after initial network error
  		  dbConnection.close();

  			// retry if desired
  		  connectInternal();
  		}
  	});

  	function connectInternal () {
			// dbConnection.open(dbConfig.domain, dbConfig.dbName, dbConfig.port, opts);
			let dbUrl: string = 'mongodb://' + dbConfig.domain + ':' + dbConfig.port + '/' + dbConfig.dbName;
			console.log("[%s] Connecting to the url: %s", MODULE_NAME, dbUrl);
			dbConnection.openUri(dbUrl);
  	}

  	connectInternal();
  }else{
  	mongoose.connect('mongodb://127.0.0.1/' + dbConfig.dbName);
    dbConnection = mongoose.connection;
    dbConnection.on('error', console.error.bind(console, 'connection error:'));
  	// dbConnection = mongoose;
  }

  return dbConnection;
}