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


var KMapModel = mongoose.model('kMap', global.db.kMap.Schema);

// module.exports = KMapModel; //then we can use it by: var User = require('./app/models/KMapModel');

/* connecting */
var dbName = (global.dbConfig && global.dbConfig.name) || "KnAllEdge";
mongoose.connect('mongodb://127.0.0.1/' + dbName);
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));

// curl -v -H "Content-Type: application/json" -X GET http://127.0.0.1:8042/kmaps/one/551bdcda1763e3f0eb749bd4
// curl -v -H "Content-Type: application/json" -X GET http://127.0.0.1:8042/kmaps/all
exports.index = function(req, res){
console.log("dbName: %s", dbName);
	console.log("[modules/kMap.js:index]");
	var found = function(err,kMaps){
		//console.log("[modules/kMap.js:index] in 'found'");
		if (err){
			throw err;
			var msg = JSON.stringify(err);
			resSendJsonProtected(res, {data: kMaps, accessId : accessId, message: msg, success: false});
		}else{
			//console.log("[modules/kMap.js:index] Data:\n%s", JSON.stringify(kMaps));
			resSendJsonProtected(res, {data: kMaps, accessId : accessId, success: true});
		}
	}

	var id = req.params.searchParam;
	var type = req.params.type;

	if(mockup && mockup.db && mockup.db.data){
		var datas_json = [];
  		datas_json.push({id: 1, name: "Sun"});
  		datas_json.push({id: 2, name: "Earth"});
  		datas_json.push({id: 3, name: "Pluto"});
  		datas_json.push({id: 4, name: "Venera"});
		resSendJsonProtected(res, {data: datas_json, accessId : accessId});
	}
	//TODO: remove (this is for testing)
	KMapModel.find(function (err, kmaps) {
		//console.log("all data:\n length: %d.\n", kmaps.length);
		//console.log(kmaps);
		//resSendJsonProtected(res, {data: {, accessId : accessId, success: true});
	});

	console.log("[modules/kMap.js:index] req.params.searchParam: %s. req.params.searchParam2: %s", req.params.searchParam, req.params.searchParam2);
	switch (type){
		case 'one': //by id:
			console.log("findById:\n id: %s.\n", id);
			KMapModel.findById(id, found);
			break;
		case 'all': //all maps
			console.log("find:\n all: \n");
			KMapModel.find({}, found);
			break;
		case 'by-type': //by map type
			console.log("find:\n by-type: \n");
			KMapModel.find({"type": id}, found);
			break;
	}
}

// curl -v -H "Content-Type: application/json" -X POST -d '{"name":"Hello Map", "iAmId":5, "visual": {}}' http://127.0.0.1:8042/kmaps
// curl -v -H "Content-Type: application/json" -X POST -d '{"_id":"551bdcda1763e3f0eb749bd4", "name":"Hello World ID", "iAmId":5, "visual": {"isOpen": true}}' http://127.0.0.1:8042/kmaps
exports.create = function(req, res){

	var data = req.body;

	console.log("[modules/kMap.js:create] req.body: %s", JSON.stringify(data));

	var finished = function(){
		resSendJsonProtected(res, {success: true, data: kmap, accessId : accessId});
	}

	var kmap = new KMapModel(data);
	kmap.save(function(err) {
		if (err) throw err;
		console.log("[modules/KMap.js:create] id:%s, kmap data: %s", kmap._id, JSON.stringify(kmap));
		finished();
	});
}

// curl -v -H "Content-Type: application/json" -X PUT -d '{"name": "Hello World Pt23", "iAmId": 5, "visual": {"isOpen": false}}' http://127.0.0.1:8042/kmaps/one/55266618cce5af993fe8675f
exports.update = function(req, res){
	//console.log("[modules/KMap.js:update] req.body: %s", JSON.stringify(req.body));

	var data = req.body;
	var id = req.params.searchParam;
	var type = req.params.type;
	var kmap = {};
	//var type = data.hasOwnProperty('type') ?  data.type : 'one';
	//var type = 'type' in data ? data.type : 'one';

	console.log("[modules/kMap.js:update] type:%s, data: %s", type, JSON.stringify(data));

	var finished = function(){
		resSendJsonProtected(res, {success: true, data: kmap, accessId : accessId});
	}

	switch (type) {
		case 'one':
			console.log("[modules/KMap.js:index/one]");

			/* this is wrong because it creates default-values populated object (including id) first and then populate it with paremeter object:
			 * var kmap = new KMapModel(req.body);
			 */

			console.log("[modules/KMap.js:update] id : %s", id );
			console.log("[modules/KMap.js:update] data, : %s", JSON.stringify(data));
			// console.log("[modules/KMap.js:update] kmap.toObject(), : %s", JSON.stringify(kmap.toObject());
			delete data._id;

			data.updatedAt = new Date(); //TODO: workaround for hook "schema.pre('update',...)" not working
			KMapModel.update({_id:id}, data, function (err, raw) {
				if (err) throw err;
				console.log('The raw response from Mongo was ', raw);
				data._id = id;
				finished();
			});

			//TODO: check this: multi (boolean) whether multiple documents should be updated (false)
			//TODO: fix: numberAffected vraca 0, a raw vraca undefined. pitanje je da li su ispravni parametri callback f-je
			// KMapModel.findByIdAndUpdate(id , data, { /* multi: true */ }, function (err, numberAffected, raw) {
			// 	  if (err) throw err;
			// 	  console.log('The number of updated documents was %d', numberAffected);
			// 	  console.log('The raw response from Mongo was ', raw);
			// 	  resSendJsonProtected(res, {success: true, data: data, accessId : accessId});
			// });
		break;
		case 'duplicate':
			var found = function(err,kMap){
				var mapSaved = function(err, mapFromServer) {
					var nodesEdgesReceived = function(nodes,edges){
						console.log("[nodesEdgesReceived] %d nodes **************** :", nodes.length);
						console.log(JSON.stringify(nodes));
						console.log("[nodesEdgesReceived] %d edges **************** :", edges.length);
						console.log(JSON.stringify(edges));

						//TODO: !! make a new copy of nodes and edges and then change them and push to array

						// mapData.nodes = nodes;
						// mapData.edges = edges;
						// var i;
						// for(i=0; i<nodes.length; i++){
						// 	//console.log("nodes[i]:"+nodes[i]);
						// 	nodes[i].mapId = map._id;
						// }
						// for(i=0; i<edges.length; i++){
						// 	edges[i].mapId = map._id;
						// }
						// console.log("map to duplicate: " + JSON.stringify(mapData));
						//
						// var dataStr = JSON.stringify(mapData, null, 4);

						finished();
					}

					if (err) throw err;
					console.log("[mapSaved] mapFromServer:",mapFromServer);
					var nodes = KNodeModel.find({ 'mapId': id}).exec();
					var edges = KEdgeModel.find({ 'mapId': id}).exec();
					Promise.join(nodes,edges, nodesEdgesReceived);
				}
				if (err) throw err;
				if(kMap === null){
					//TODO: return status not found
					console.log('No map found');
				}else{
					console.log('found:map:',kMap);
					var oldMap = kMap.toObject();
					delete oldMap['_id'];
					//console.log('oldMap has _id:', oldMap.hasOwnProperty('_id'));

					//console.log('oldMap:', oldMap);
					mapData.map = new KMapModel(oldMap);
					mapData.map.name = newMapName;

					//TODO: map has ID before adding?! because of  new KMapModel?!
					//TODO: fix rootNodeId, createdAt(?)

					//delete mapData.map['_id'];
					console.log('mapData.map for saving:',mapData.map);
					//console.log('mapSaved:',mapSaved);
					mapData.map.save(mapSaved);
				}
			}

			var KEdgeModel = mongoose.model('kEdge', global.db.kEdge.Schema);
			var KNodeModel = mongoose.model('kNode', global.db.kNode.Schema);

			var mapData = {
				"map": null,
				"nodes": [],
				"edges": []
			};;

			var newMapName = req.body.newMapName;
			console.log("[modules/KMap.js:update/duplicate] mapId:%s, newMapName:%s", id, newMapName);

			KMapModel.findById(id, found);
			//finished();
		break;
	}
}

// curl -v -H "Content-Type: application/json" -X DELETE http://127.0.0.1:8042/kmaps/one/553fa6ed4f05fdb0311a10cb
/**
 * IMPORTANT - this method only deletes map but not its nodes and edges
 * @param  {[type]} req [description]
 * @param  {[type]} res [description]
 * @return {[type]}     [description]
 */
exports.destroy = function(req, res){
	var type = req.params.type;
	var dataId = req.params.searchParam;
	console.log("[modules/KMap.js:destroy] dataId:%s, type:%s, req.body: %s", dataId, type, JSON.stringify(req.body));

	KMapModel.findByIdAndRemove(dataId, function (err) {
			if (err) throw err;
			var data = {id:dataId};

			var finished = function(){
				resSendJsonProtected(res, {success: true, data: data, accessId : accessId});
			}

			var deleteMapAndContent = function(mapId){
				var nodesEdgesDeleted = function(errN, errE){
					console.log("[nodesEdgesDeleted] finished");
					console.log("[nodesEdgesDeleted] nodes deleted: ", errN, 'edges deleted:', errE);
					finished();
				};

				console.log("[deleteMapAndContent]");
				//deleting map's content (nodes + edge)

				var KEdgeModel = mongoose.model('kEdge', global.db.kEdge.Schema);
				console.log('KEdgeModel:',KEdgeModel);
				var KNodeModel = mongoose.model('kNode', global.db.kNode.Schema);
				console.log('KNodeModel:',KNodeModel);

				var nodes = KNodeModel.remove({ 'mapId': mapId}).exec();
				var edges = KEdgeModel.remove({ 'mapId': mapId}).exec();
				Promise.join(nodes,edges, nodesEdgesDeleted);

				console.log('mapId: %s', mapId);
			};

			switch (type) {
				case 'one':
					finished();
				break;
				case 'map-and-content':
					deleteMapAndContent(dataId);
				break;
				default:

			}
		}
	);
};
