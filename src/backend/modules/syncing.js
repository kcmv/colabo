'use strict';

/**
 * New map file
 */
var mongoose = require('mongoose');
var Promise = require("bluebird");

var mockup = {fb: {authenticate: false}, db: {data:false}};
var accessId = 0;

function resSendJsonProtected(res, data){
	// http://tobyho.com/2011/01/28/checking-types-in-javascript/	
	if(data !== null && typeof data === 'object'){ // http://stackoverflow.com/questions/8511281/check-if-a-variable-is-an-object-in-javascript
		res.set('Content-Type', 'application/json');
		// JSON Vulnerability Protection
		// http://haacked.com/archive/2008/11/20/anatomy-of-a-subtle-json-vulnerability.aspx/
		// https://docs.angularjs.org/api/ng/service/$http#description_security-considerations_cross-site-request-forgery-protection
		res.send(")]}',\n" + JSON.stringify(data));
	}else if(typeof data === 'string'){ // http://stackoverflow.com/questions/4059147/check-if-a-variable-is-a-string
		res.send(data);
	}else{
		res.send(data);
	}
};


//var SyncingModel = mongoose.model('Syncing', global.db.Syncing.Schema);
var KNodeModel = mongoose.model('KNode', global.db.kNode.Schema);
var KEdgeModel = mongoose.model('kEdge', global.db.kEdge.Schema);

// module.exports = SyncingModel; //then we can use it by: var User = require('./app/models/SyncingModel');

/* connecting */
mongoose.connect('mongodb://127.0.0.1/KnAllEdge');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));

// curl -v -H "Content-Type: application/json" -X GET http://127.0.0.1:8042/syncing/one/551bdcda1763e3f0eb749bd4
// curl -v -H "Content-Type: application/json" -X GET http://127.0.0.1:8042/syncing/all
exports.index = function(req, res){
	console.log("[modules/Syncing.js:index]");
	var found = function(err,syncing){
		//console.log("[modules/Syncing.js:index] in 'found'");
		if (err){
			throw err;
			var msg = JSON.stringify(err);
			resSendJsonProtected(res, {data: syncing, accessId : accessId, message: msg, success: false});
		}else{
			//console.log("[modules/Syncing.js:index] Data:\n%s", JSON.stringify(syncing));
			resSendJsonProtected(res, {data: syncing, accessId : accessId, success: true});
		}
	}
	
	var mapId = req.params.searchParam;
	var time = new Date(req.params.searchParam2);
	var type = req.params.type;
	
	console.log("[modules/Syncing.js:index] req.params.searchParam: %s. req.params.searchParam2: %s", req.params.searchParam, req.params.searchParam2);
	switch (type){
		case 'in_map_after': //:
			console.log("Syncing::get changes for map '%s', after timestamp: %s", mapId, time);

			var nodesEdgesReceived = function(nodes,edges){
				var changes = {last_change:time, nodes:[],edges:[]};
				console.log("[nodesEdgesReceived] %d nodes and %d edges :", nodes.length, edges.length);
				//console.log(JSON.stringify(nodes));
				//console.log(JSON.stringify(edges));
				var i;
				for(i=0; i<nodes.length; i++){
					//console.log("nodes[i]:"+nodes[i]);
					changes.nodes.push(nodes[i]);
					// console.log("nodes[i].updatedAt instanceof Date:"+ (nodes[i].updatedAt instanceof Date));
					if(nodes[i].updatedAt > changes.last_change){ //mongoose returns here JavaScript Date object so we can compare it regularly (note: in MongoDb dates are stored as ISODate object but mongoose takes care of conversions)
						// console.log("nodes[i].updatedAt [%s] > changes.last_change [%s]", nodes[i].updatedAt, changes.last_change);
						changes.last_change = nodes[i].updatedAt;
					}
				}
				for(i=0; i<edges.length; i++){
					changes.edges.push(edges[i]);
					// console.log("edges[i].updatedAt instanceof Date:"+ (edges[i].updatedAt instanceof Date));
					if(edges[i].updatedAt > changes.last_change){
						changes.last_change = edges[i].updatedAt;
					}
				}
				// console.log("changes: " + JSON.stringify(changes));
				
				resSendJsonProtected(res, {data: changes, accessId : accessId, success: true});
			};

			var nodes = KNodeModel.findInMapAfterTime(mapId, time).exec();
			var edges = KEdgeModel.findInMapAfterTime(mapId, time).exec();
			Promise.join(nodes,edges, nodesEdgesReceived);

		break;
	}
}

// curl -v -H "Content-Type: application/json" -X POST -d '{"name":"Hello Map", "iAmId":5, "visual": {}}' http://127.0.0.1:8042/syncing
// curl -v -H "Content-Type: application/json" -X POST -d '{"_id":"551bdcda1763e3f0eb749bd4", "name":"Hello World ID", "iAmId":5, "visual": {"isOpen": true}}' http://127.0.0.1:8042/syncing
// exports.create = function(req, res){
// 	console.log("[modules/Syncing.js:create] req.body: %s", JSON.stringify(req.body));
	
// 	var data = req.body;
	
// 	console.log(data);
// 	var syncing = new SyncingModel(data);

// 	Syncing.save(function(err) {
// 		if (err) throw err;
// 		console.log("[modules/Syncing.js:create] id:%s, kmap data: %s", syncing._id, JSON.stringify(syncing));
// 		resSendJsonProtected(res, {success: true, data: syncing, accessId : accessId});
// 	});				
// }

// curl -v -H "Content-Type: application/json" -X PUT -d '{"name": "Hello World Pt23", "iAmId": 5, "visual": {"isOpen": false}}' http://127.0.0.1:8042/syncing/one/55266618cce5af993fe8675f
// exports.update = function(req, res){
// 	//console.log("[modules/syncing.js:update] req.body: %s", JSON.stringify(req.body));

// 	var data = req.body;
// 	var id = req.params.searchParam;
	
// 	/* this is wrong because it creates default-values populated object (including id) first and then populate it with paremeter object:
// 	 * var syncing = new SyncingModel(req.body);
// 	 */
	
// 	console.log("[modules/syncing.js:update] id : %s", id );
// 	console.log("[modules/syncing.js:update] data, : %s", JSON.stringify(data));
// 	// console.log("[modules/syncing.js:update] syncing.toObject(), : %s", JSON.stringify(syncing.toObject());
// 	delete data._id;
// 	//TODO: check this: multi (boolean) whether multiple documents should be updated (false)
// 	//TODO: fix: numberAffected vraca 0, a raw vraca undefined. pitanje je da li su ispravni parametri callback f-je
// 	SyncingModel.findByIdAndUpdate(id , data, { /* multi: true */ }, function (err, numberAffected, raw) {
// 		  if (err) throw err;
// 		  console.log('The number of updated documents was %d', numberAffected);
// 		  console.log('The raw response from Mongo was ', raw);
// 		  resSendJsonProtected(res, {success: true, data: data, accessId : accessId});	
// 	});			
// }

// curl -v -H "Content-Type: application/json" -X DELETE http://127.0.0.1:8042/syncing/one/553fa6ed4f05fdb0311a10cb
// exports.destroy = function(req, res){
// 	//TODO: should we destroy edges connected to this map? or is it done automatically? or error is risen?
// 	var type = req.params.type;
// 	var dataId = req.params.searchParam;
// 	console.log("[modules/Syncing.js:destroy] dataId:%s, type:%s, req.body: %s", dataId, type, JSON.stringify(req.body));
	
// 	SyncingModel.findByIdAndRemove(dataId, function (err) {
// 			if (err) throw err;
// 			var data = {id:dataId};
// 			resSendJsonProtected(res, {success: true, data: data, accessId : accessId});
// 		}
// 	);
// };