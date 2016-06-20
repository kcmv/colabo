'use strict';

require('../models'); // injects DB Schemas in global.db

var mongoose = require('mongoose');
var Promise = require("bluebird");
// set it either in path: (node createDemoData.js 'demo_data.json') or default
var mapNewName = process.argv[2] || 'mapDuplicated';
var mapId = process.argv[3] || '576451306144c31603a5a1b8';
//var rootNodeId = process.argv[4] || '55268521fb9a901e442172f9';

/* connecting */
var dbName = (global.dbConfig && global.dbConfig.name) || "KnAllEdge";
mongoose.connect('mongodb://127.0.0.1/' + dbName);
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));

var KNodeModel = mongoose.model('KNode', global.db.kNode.Schema);
var KEdgeModel = mongoose.model('kEdge', global.db.kEdge.Schema);
var KMapModel = mongoose.model('kMap', global.db.kMap.Schema);

var mapData = {
		"map": null,
		"nodes": [],
		"edges": []
	};;
console.log('mapNewName: ' + mapNewName);

var finish = function(){
	mongoose.disconnect();
	//exit();
}


db.on('open', function (callback) {
	var found = function(err,kMap){
		var mapSaved = function(err, mapFromServer) {
			/*
			var nodesEdgesReceived = function(nodes,edges){
				console.log("[nodesEdgesReceived] %d nodes **************** :", nodes.length);
				console.log(JSON.stringify(nodes));
				console.log("[nodesEdgesReceived] %d edges **************** :", edges.length);
				console.log(JSON.stringify(edges));
				mapData.nodes = nodes;
				mapData.edges = edges;
				var i;
				for(i=0; i<nodes.length; i++){
					//console.log("nodes[i]:"+nodes[i]);
					nodes[i].mapId = map._id;
				}
				for(i=0; i<edges.length; i++){
					edges[i].mapId = map._id;
				}
				console.log("map to duplicate: " + JSON.stringify(mapData));

				var dataStr = JSON.stringify(mapData, null, 4);
				mongoose.disconnect();
			}
			*/

			console.log("[mapSaved] mapFromServer:",mapFromServer);
			var nodes = KNodeModel.find({ 'mapId': mapId}).exec();
			var edges = KEdgeModel.find({ 'mapId': mapId}).exec();
			Promise.join(nodes,edges, nodesEdgesReceived);
		}
		if (err) throw err;
		if(kMap === null){
			console.log('No map found');
		}else{
			console.log('found:map:'+JSON.stringify(kMap));
			var oldMap = kMap.toObject();
			delete oldMap['_id'];
			//console.log('oldMap has _id:', oldMap.hasOwnProperty('_id'));

			//console.log('oldMap:', oldMap);
			mapData.map = new KMapModel(oldMap);
			mapData.map.name = mapNewName;
			//delete mapData.map['_id'];
			console.log('mapData.map for saving:',mapData.map);
			//console.log('mapSaved:',mapSaved);
			mapData.map.save(function(err) {
			//KMapModel.create(mapData.map, function(err) {
				if (err) throw err;
				console.log('saved');
			});
		}
		finish();
	}
	console.log('opened:mapId:'+mapId);
	console.log('findById:',mapId);
	KMapModel.findById(mapId, found);
});
