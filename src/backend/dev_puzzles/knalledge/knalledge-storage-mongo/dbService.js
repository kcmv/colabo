var mongoose = require('mongoose');

function connect(){
  console.log("dbName: %s", global.dbConfig.dbName);
  var dbConnection;
  /* connecting */
  if(global.dbConfig.newConnect){
  	var opts = {
  		server: { auto_reconnect: true }
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
  	  dbConnection.open(global.dbConfig.domain, global.dbConfig.dbName, global.dbConfig.port, opts);
  	}

  	connectInternal();
  }else{
  	mongoose.connect('mongodb://127.0.0.1/' + global.dbConfig.dbName);
    dbConnection = mongoose.connection;
    dbConnection.on('error', console.error.bind(console, 'connection error:'));
  	// dbConnection = mongoose;
  }

  return dbConnection;
}

exports.connect = connect;
