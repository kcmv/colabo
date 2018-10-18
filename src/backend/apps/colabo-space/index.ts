const MODULE_NAME:string = "@colabo-apps/b-colabo-space";

let chalk = require('chalk');
let coLaboSpaceText = chalk.red.bold("Co")+chalk.blue.bold("Lab")+chalk.green.bold("o.space");
console.log(coLaboSpaceText + " is starting ...")

process.chdir(__dirname);

// import * as express from "express";

let configFile:any = require('./config/global');
let globalSet:any = configFile.globalSet;
console.log("[Colabo.Space:index] globalSet.paths: %s", JSON.stringify(globalSet.paths));
let config = require('@colabo-utils/i-config');
config.init(globalSet);

let async = require('async');
let express = require('express');
let resource = require('express-resource');
let fs = require('fs');
let http = require('http');
let https = require('https');

let puzzleKnalledgeStorageMongo = require('@colabo-knalledge/b-storage-mongo');

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

var app = express();

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

    app.use(supportCrossOriginScript);
    app.use(app.router);
});

/* Knalledge Maps */

import {KnAllEdgeCoreRegister} from '@colabo-knalledge/b-core';
KnAllEdgeCoreRegister(app);

// var puzzleKnalledgeSearch = require('@colabo-knalledge/b-search')(app);
import * as PuzzleKnalledgeSearch from '@colabo-knalledge/b-search';
PuzzleKnalledgeSearch.initialize(app);


/* RIMA */
// var whatAmIs = app.resource('whatAmIs', require('./modules/whatAmI'), { id: 'type?/:searchParam?' });
// var whoAmIs = app.resource('whoAmIs', require('./modules/whoAmI'), { id: 'type?/:searchParam?' });
// var howAmIs = app.resource('howAmIs', require('./modules/howAmI'), { id: 'type?/:searchParam?' });

/* AAA */
var aaa = app.resource('aaa', require('@colabo-rima/b-aaa/aaa'), { id: 'type?/:searchParam?/:searchParam2?' });

/* GENERAL */
// var syncing = app.resource('syncing', require('./modules/syncing'), { id: 'type?/:searchParam?/:searchParam2?' });
// var dbAudits = app.resource('dbAudits', require('./modules/dbAudit'), { id: 'type?/:searchParam?' });
// var session = app.resource('session', require('./modules/session'), { id: 'type?/:searchParam?' });

// var mapImport = app.resource('mapImport', require('./modules/mapImport'), { id: 'type?/:searchParam?' });

import * as PuzzleMediaUpload from '@colabo-media/b-upload';
PuzzleMediaUpload.initialize(app);

// var smsapi = app.resource('smsapi', require('./modules/smsapi_old_JS')); //JS
// var smsapi = app.resource('smsapi', require('./modules/smsapi')); //TS

// TopiChat
import {TopiChat} from '@colabo-topichat/b-core';
var topiChat = new TopiChat('Colabo.Space');

// import {TopiChatKnAllEdge} from '@colabo-topichat/b-knalledge';
// var topiChatKnAllEdge = new TopiChatKnAllEdge(topiChat);

import {TopiChatTalk} from '@colabo-topichat/b-talk';
var topiChatTalk = new TopiChatTalk(topiChat);

import {ColaboFlowTopiChat} from '@colabo-flow/b-topichat';
var colaboFlowTopiChat = new ColaboFlowTopiChat(topiChat);

let server = http.createServer(app).listen(app.get('port'), function () {
    console.log("Listening on " + app.get('port'));
});

topiChat.connect(server);
console.log(coLaboSpaceText + " started ...")
