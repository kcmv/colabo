process.chdir(__dirname);

var config = require('./config/global'),
    async = require('async'),
    express = require('express'),
    resource = require('express-resource'),
    fs = require('fs'),
    http = require('http'),
    https = require('https'),
    flash = require('connect-flash'),

    puzzleKnalledgeStorageMongo = require('@colabo-knalledge/b-storage-mongo/models'),

    db = require('./models'),
    TopiChat = require('./modules/topiChat'),
    TopiChatKnAllEdge = require('./modules/topiChat-knalledge');

console.log("[KnAllEdgeBackend.js:index] config.paths: %s", JSON.stringify(config.paths));
console.log("[KnAllEdgeBackend.js:index] config.mockups: %s", JSON.stringify(config.mockups));
console.log("[KnAllEdgeBackend.js:index] config.services: %s", JSON.stringify(config.services));

function supportCrossOriginScript(req, res, next) {
    res.header("Access-Control-Allow-Headers", "Content-Type");

    // res.header("Access-Control-Allow-Headers", "Origin");
    // res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    // res.header("Access-Control-Allow-Methods","POST, OPTIONS");
    res.header("Access-Control-Allow-Methods", "POST, GET, OPTIONS, DELETE, PUT, HEAD");
    res.header("Allow", "POST, GET, OPTIONS, DELETE, PUT, HEAD");
    // res.header("Access-Control-Max-Age","1728000");

    // res.header("Access-Control-Allow-Origin", "*");
    // http://stackoverflow.com/questions/15026016/set-cookie-in-http-header-is-ignored-with-angularjs
    var origin = req.headers.origin; // "litterra.info"; // "litterra.info:8088"; //req.headers.origin;

    //console.log("Access-Control-Allow-Origin: %s", origin);

    //var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    // console.log("Access-Control-Allow-Origin: %s", ip);

    //console.log("Access-Control-Allow-Origin: %s", origin);

    res.header('Access-Control-Allow-Origin', origin);
    res.header('Access-Control-Allow-Credentials', true);

    //console.log("[supportCrossOriginScript] setting up headers");

    res.status(200);
    next();
}

var portHttp = process.argv[2] || process.env.PORT || 8888;
var portTC = process.argv[3] || process.env.PORT_TC || 8060;

var app = express();
var topiChat = new TopiChat(app, 'CollaboScience', portTC);
var topiChatKnAllEdge = new TopiChatKnAllEdge(topiChat);

topiChat.connect();

var bodyParser = require('body-parser');

app.configure(function() {
    app.use(express.bodyParser());
    app.use(express.logger());
    app.use(express.cookieParser()); // cookie parser is used before the session
    app.use(bodyParser.json());
    console.log("process.argv: %s", JSON.stringify(process.argv));
    app.set('port', portHttp);

    // this is enough
    app.use(supportCrossOriginScript);
    // so no need for this
    // app.options('/iam/users', supportCrossOriginScript);

    app.use(app.router);
});
/* Knalledge Maps */
var puzzleKnalledgeCore = require('@colabo-knalledge/b-core')(app);
var puzzleKnalledgeSearch = require('@colabo-knalledge/b-search')(app);

/* RIMA */
var whatAmIs = app.resource('whatAmIs', require('./modules/whatAmI'), { id: 'type?/:searchParam?' });
var whoAmIs = app.resource('whoAmIs', require('./modules/whoAmI'), { id: 'type?/:searchParam?' });
var howAmIs = app.resource('howAmIs', require('./modules/howAmI'), { id: 'type?/:searchParam?' });

/* AAA */
var aaa = app.resource('aaa', require('@colabo-rima/b-aaa/aaa'), { id: 'type?/:searchParam?/:searchParam2?' });

/* GENERAL */
var syncing = app.resource('syncing', require('./modules/syncing'), { id: 'type?/:searchParam?/:searchParam2?' });
var dbAudits = app.resource('dbAudits', require('./modules/dbAudit'), { id: 'type?/:searchParam?' });
var session = app.resource('session', require('./modules/session'), { id: 'type?/:searchParam?' });

var session = app.resource('mapImport', require('./modules/mapImport'), { id: 'type?/:searchParam?' });

var upload = app.resource('upload', require('@colabo-media/b-upload/upload'), { id: 'type?/:searchParam?' });

// var smsapi = app.resource('smsapi', require('./modules/smsapi_old_JS')); //JS
var smsapi = app.resource('smsapi', require('./modules/smsapi')); //TS

http.createServer(app).listen(app.get('port'), function() {
    console.log("Listening on " + app.get('port'));
});