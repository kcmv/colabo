'use strict';

// node exportMap.js ECON-map.2016.07.15.json '57817a2163bf546e0ed290bc' '57817a2163bf546e0ed290ba'

require('../models'); // injects DB Schemas in global.db


var mongoose = require('mongoose');
var Promise = require("bluebird");
// set it either in path: (node createDemoData.js 'demo_data.json') or default
var fileName = process.argv[2] || '../../data/exportedDB.json';
var mapId = process.argv[3] || '5552c2c87ffdccd74096d0ca';
var rootNodeId = process.argv[4] || '55268521fb9a901e442172f9';

var fs = require('fs');

/* connecting */
var dbName = (global.dbConfig && global.dbConfig.name) || "KnAllEdge";
mongoose.connect('mongodb://127.0.0.1/' + dbName);
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));

var KNodeModel = mongoose.model('KNode', global.db.kNode.Schema);
var KEdgeModel = mongoose.model('kEdge', global.db.kEdge.Schema);

var mapData = null;
console.log('fileName: ' + fileName);

db.on('open', function (callback) {
	var data =
	{
		"properties": {
			"name": "TNC (Tesla - The Nature of Creativty) (DR Model)",
			"date": "2015.05.13.",
			"authors": "S. Rudan, D. Karabeg",
			"mapId": mapId,
			"rootNodeId": rootNodeId
		},
		"map": {
			"nodes": [],
			"edges": []
		}
	};

	var nodesEdgesReceived = function(nodes,edges){
		console.log("[nodesEdgesReceived] %d nodes **************** :", nodes.length);
		console.log(JSON.stringify(nodes));
		console.log("[nodesEdgesReceived] %d edges **************** :", edges.length);
		console.log(JSON.stringify(edges));
		var i;
		for(i=0; i<nodes.length; i++){
			//console.log("nodes[i]:"+nodes[i]);
			data.map.nodes.push(nodes[i]);
		}
		for(i=0; i<edges.length; i++){
			data.map.edges.push(edges[i]);
		}
		console.log("data for export: " + JSON.stringify(data));

		var dataStr = JSON.stringify(data, null, 4);
		writeToFile(fileName, dataStr);
	};

	var nodes = KNodeModel.find({ 'mapId': mapId}).exec();
	var edges = KEdgeModel.find({ 'mapId': mapId}).exec();
	Promise.join(nodes,edges, nodesEdgesReceived);

	//mongoose.connection.close();
	console.log('mapId: %s', mapId);
});

function writeToFile(fileName, data, callback){
	console.log('[writeToFile] file %s', fileName);
	fs.writeFile(fileName, data, 'utf8', function (err) {
		if (err) {
			console.log("[writeToFile] err: " + err);
			if(callback){ callback(err, null)}
			else{throw err;}
		}
		console.log("[writeToFile] saved ");
		if(callback) callback(null);
	});
}
