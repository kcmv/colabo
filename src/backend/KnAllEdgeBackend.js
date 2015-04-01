process.chdir(__dirname);

var config = require('./config/global')
  ,	async   = require('async')
  , express = require('express')
  , resource = require('express-resource')
  , fs      = require('fs')
  , http    = require('http')
  , https   = require('https')
  , flash 	 = require('connect-flash');
 
console.log("[KnAllEdgeBackend.js:index] config.paths: %s", JSON.stringify(config.paths));
console.log("[KnAllEdgeBackend.js:index] config.mockups: %s", JSON.stringify(config.mockups));
console.log("[KnAllEdgeBackend.js:index] config.services: %s", JSON.stringify(config.services));

// function supportCrossOriginScript(req, res, next) {
// 	res.header("Access-Control-Allow-Headers", "Content-Type");
// 	// res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
// 	res.header("Access-Control-Allow-Methods", "POST, GET, OPTIONS, DELETE, PUT, HEAD");
// 	res.header("Allow", "POST, GET, OPTIONS, DELETE, PUT, HEAD");
// 	// res.header("Access-Control-Max-Age","1728000");
	
// 	// res.header("Access-Control-Allow-Origin", "*");
// 	// http://stackoverflow.com/questions/15026016/set-cookie-in-http-header-is-ignored-with-angularjs
// 	var origin = req.headers.origin; // "api.transpoetika.org";
// 	console.log("Access-Control-Allow-Origin: %s", origin);
// 	//var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
// 	// console.log("Access-Control-Allow-Origin: %s", ip);
// 	console.log("Access-Control-Allow-Origin: %s", origin);
// 	res.header('Access-Control-Allow-Origin', origin);
// 	res.header('Access-Control-Allow-Credentials', true);
	
// 	console.log("[supportCrossOriginScript] setting up headers");

//     res.status(200);
//     next();
// }

var app = express();

app.configure(function(){
    app.use(express.bodyParser());
    app.use(express.logger());
	app.use(express.cookieParser()); // cookie parser is used before the session
	app.set('port', process.env.PORT || 8080);

	// this is enough
	//app.use(supportCrossOriginScript);
	// so no need for this
	// app.options('/iam/users', supportCrossOriginScript);

    app.use(app.router);
});

var knodes = app.resource('knodes', require('./modules/kNode'), {id: 'type?/:searchParam?'});

http.createServer(app).listen(app.get('port'), function() {
	console.log("Listening on " + app.get('port'));
});