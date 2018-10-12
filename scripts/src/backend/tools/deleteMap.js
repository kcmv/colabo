'use strict';

require('../models'); // injects DB Schemas in global.db


var mongoose = require('mongoose');
var Promise = require("bluebird");
var mapId = process.argv[3] || '5763bf5d6144c31603a5a1b0';
//var rootNodeId = process.argv[4] || '55268521fb9a901e442172f9';

var fs = require('fs');

/* connecting */
var dbName = (global.dbConfig && global.dbConfig.name) || "KnAllEdge";
mongoose.connect('mongodb://127.0.0.1/' + dbName);
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));

var KNodeModel = mongoose.model('KNode', global.db.kNode.Schema);
var KEdgeModel = mongoose.model('kEdge', global.db.kEdge.Schema);
var KMapModel = mongoose.model('kMap', global.db.kMap.Schema);

db.on('open', function (callback) {
	var nodesEdgesDeleted = function(errN, errE){

		var mapDeleted = function(err){
				console.log("[mapDeleted] finished");
				//console.log("[mapDeleted] err: ", err);
				mongoose.disconnect();
		}

		console.log("[nodesEdgesDeleted] finished");
		console.log("[nodesEdgesDeleted] nodes deleted: ", errN, 'edges deleted:', errE);
		//deleting the map
		var map = KMapModel.remove({ '_id': mapId}).exec().then(mapDeleted);
	};

	//deleting map's content (nodes + edge)
	var nodes = KNodeModel.remove({ 'mapId': mapId}).exec();
	var edges = KEdgeModel.remove({ 'mapId': mapId}).exec();
	Promise.join(nodes,edges, nodesEdgesDeleted);

	//mongoose.connection.close();
	console.log('mapId: %s', mapId);
});
