process.chdir(__dirname);

// import * as express from "express";

let config = require('./config/global');
let async = require('async');
let express = require('express');
let resource = require('express-resource');
let fs = require('fs');
let http = require('http');
let https = require('https');
let flash = require('connect-flash');

let puzzleKnalledgeStorageMongo = require('@colabo-knalledge/b-knalledge-storage-mongo');

// let db = require('./models');

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


// TopiChat
import {TopiChat} from '@colabo-topiChat/b-core';
var topiChat = new TopiChat(app, 'Colabo.Space', portTC);

// import {TopiChatKnAllEdge} from '@colabo-topiChat/b-knalledge';
// var topiChatKnAllEdge = new TopiChatKnAllEdge(topiChat);

import {TopiChatTalk} from '@colabo-topiChat/b-talk';
var topiChatTalk = new TopiChatTalk(topiChat);

import {ColaboFlowTopiChat} from '@colabo-flow/b-topiChat';
var colaboFlowTopiChat = new ColaboFlowTopiChat(topiChat);

topiChat.connect();

// var bodyParser = require('body-parser');

app.configure(function () {
    app.use(express.logger());
    app.use(express.cookieParser()); // cookie parser is used before the session
    // multer and body-parser resolution
    // https://github.com/expressjs/multer/issues/251
    // app.use(express.bodyParser());
    // app.use(bodyParser.json());
    app.use(express.json());
    app.use(express.urlencoded());
    console.log("process.argv: %s", JSON.stringify(process.argv));
    app.set('port', portHttp);

    // this is enough
    app.use(supportCrossOriginScript);
    // so no need for this
    // app.options('/iam/users', supportCrossOriginScript);

    app.use(app.router);
});
/* Knalledge Maps */

import {KnAllEdgeCoreRegister} from '@colabo-knalledge/b-knalledge-core';
KnAllEdgeCoreRegister(app);

// var puzzleKnalledgeSearch = require('@colabo-knalledge/b-knalledge-search')(app);
import * as PuzzleKnalledgeSearch from '@colabo-knalledge/b-knalledge-search';
PuzzleKnalledgeSearch.initialize(app);


/* RIMA */
// var whatAmIs = app.resource('whatAmIs', require('./modules/whatAmI'), { id: 'type?/:searchParam?' });
// var whoAmIs = app.resource('whoAmIs', require('./modules/whoAmI'), { id: 'type?/:searchParam?' });
// var howAmIs = app.resource('howAmIs', require('./modules/howAmI'), { id: 'type?/:searchParam?' });

/* AAA */
var aaa = app.resource('aaa', require('@colabo-rima/rima-connect/aaa'), { id: 'type?/:searchParam?/:searchParam2?' });

/* GENERAL */
// var syncing = app.resource('syncing', require('./modules/syncing'), { id: 'type?/:searchParam?/:searchParam2?' });
// var dbAudits = app.resource('dbAudits', require('./modules/dbAudit'), { id: 'type?/:searchParam?' });
// var session = app.resource('session', require('./modules/session'), { id: 'type?/:searchParam?' });

// var mapImport = app.resource('mapImport', require('./modules/mapImport'), { id: 'type?/:searchParam?' });

import * as PuzzleMediaUpload from '@colabo-media/media-upload';
PuzzleMediaUpload.initialize(app);

// var smsapi = app.resource('smsapi', require('./modules/smsapi_old_JS')); //JS
// var smsapi = app.resource('smsapi', require('./modules/smsapi')); //TS

http.createServer(app).listen(app.get('port'), function () {
    console.log("Listening on " + app.get('port'));
});