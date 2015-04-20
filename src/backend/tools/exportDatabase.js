'use strict';

require('../models'); // injects DB Schemas in global.db


var mongoose = require('mongoose');
var Promise = require("bluebird");
// set it either in path: (node createDemoData.js 'demo_data.json') or default
var fileName = process.argv[2] || '../../data/exportedDB.json';
var mapId = process.argv[3] || '552678e69ad190a642ad461c';
var rootNodeId = process.argv[4] || '55268521fb9a901e442172f9';

var fs = require('fs');

/* connecting */
mongoose.connect('mongodb://127.0.0.1/KnAllEdge');
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
			"date": "2015.03.22.",
			"authors": "S. Rudan, D. Karabeg",
			"mapId": mapId,
			"rootNodeId": rootNodeId
		},
		"map": {
			"nodes": [],
			"edges": []
		}
	};
	var nodes;
	var edges;
	
	var nodesEdgesReceived = function(nodes,edges){
		console.log("[nodesEdgesReceived] nodes: " + JSON.stringify(nodes));
		console.log("[nodesEdgesReceived] edges: " + JSON.stringify(edges));
		var i;
		for(i=0; i<nodes.length; i++){
			//console.log("nodes[i]:"+nodes[i]);
			data.map.nodes.push(nodes[i]);
		}
		for(i=0; i<edges.length; i++){
			data.map.edges.push(edges[i]);
		}
		console.log("data for export: " + JSON.stringify(data));
		
		var dataStr = JSON.stringify(data);
		writeToFile(fileName, dataStr);
	};
	
	nodes = KNodeModel.find({ 'mapId': mapId}).exec();
	edges = KEdgeModel.find({ 'mapId': mapId}).exec();
	var allArrray = [nodes, edges];
	//Promise.all(allArrray).then(nodesEdgesReceived);
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

/*
https://github.com/petkaantonov/bluebird
https://github.com/petkaantonov/bluebird/blob/master/API.md#new-promisefunctionfunction-resolve-function-reject-resolver---promise
https://github.com/petkaantonov/bluebird/blob/master/API.md#thenfunction-fulfilledhandler--function-rejectedhandler----promise
http://stackoverflow.com/questions/28000060/promised-mongo-cant-finalize-promise
*/
function populateNodeDemo(){
	var entriesNo = 0;
	var finishedinserting = false;
	var errorOccured = false;
	return new Promise(function (resolve, reject) {
		//console.log('kNode populateDemo');
		var data_bulk = mapData.map.nodes;
		var rootNodeId = mapData.properties.rootNodeId;
		var mapId = mapData.properties.mapId;
		//console.log("typeof data_bulk:" + typeof data_bulk);
		var data_array = new Array();
		var isRootNode = true;
		for (var datumId in data_bulk){
			var datum = data_bulk[datumId];
			// the first node in the node list will be recognized as a root node and its _id will be set to rootNodeId
			if(isRootNode){
				datum._id = rootNodeId;
				isRootNode = false;
			}
			// if mapId is missing (default state) it is set to properties.mapId
			if(!('mapId' in datum)) datum.mapId = mapId;
			// toObject() is called to avoid error 'RangeError: Maximum call stack size exceeded', caused by sending Mongoose object to MongoDb driver (invoked by 'Model.collection.insert')
			// http://stackoverflow.com/questions/24466366/mongoose-rangeerror-maximum-call-stack-size-exceeded
			// and more about this: https://github.com/Automattic/mongoose/issues/1961#event-242694964
			// "Document#toObject([options]) - Converts this document into a plain javascript object, ready for storage in MongoDB." from http://mongoosejs.com/docs/api.html#document_Document-toObject
			var knode = new KNodeModel(datum).toObject();
			console.log("[kNode::populateDemo] datum:\n" + JSON.stringify(datum));
			console.log("[kNode::populateDemo] knode:\n" + JSON.stringify(knode)+"\n");
			data_array.push(knode);
			entriesNo++;
			console.log("[kNode::populateDemo] adding new node to insertion array. entriesNo: %d", entriesNo);
		}
		finishedinserting = true;
		// console.log("[kNode::populateDemo] data_array:\n" + JSON.stringify(data_array));
		
		//resolve();
		KNodeModel.collection.insert(data_array, onInsert); // call to underlying MongoDb driver

		function onInsert(err, docs) {
		    if (err) {
		    	entriesNo--;
		    	console.log('[kNode::populateDemo::onInsert] err %s', err);
		    	errorOccured = true;
		    	reject();
		    } else {
		        console.info('[kNode::populateDemo::onInsert] %d NODES were successfully stored.', docs.length);
		        console.log("kNode::populateDemo::docs: %s", JSON.stringify(docs));
		    	entriesNo -= docs.length;
		        console.info('\t[kNode::populateDemo::onInsert] finishedinserting:%s, errorOccured:%s, entriesNo:%s', 
		        	finishedinserting, errorOccured, entriesNo);
		        if(finishedinserting && !errorOccured && entriesNo == 0){
			    	console.log('[kNode::populateDemo::onInsert] last insertion finished. resolving');
		        	resolve();
		        }
		    }
		}
	});
}

/*
https://github.com/petkaantonov/bluebird
https://github.com/petkaantonov/bluebird/blob/master/API.md#new-promisefunctionfunction-resolve-function-reject-resolver---promise
http://stackoverflow.com/questions/28000060/promised-mongo-cant-finalize-promise
*/
function populateEdgeDemo(){
	var entriesNo = 0;
	var finishedinserting = false;
	var errorOccured = false;
	return new Promise(function (resolve, reject) {
		var data_bulk = mapData.map.edges;
		var mapId = mapData.properties.mapId;
		//console.log("typeof data_bulk:" + typeof data_bulk);
		var data_array = new Array();
		for (var datumId in data_bulk){
			var datum = data_bulk[datumId];
			// if mapId is missing (default state) it is set to properties.mapId
			if(!('mapId' in datum)) datum.mapId = mapId;
			// toObject() is called to avoid error 'RangeError: Maximum call stack size exceeded', caused by sending Mongoose object to MongoDb driver (invoked by 'Model.collection.insert')
			// http://stackoverflow.com/questions/24466366/mongoose-rangeerror-maximum-call-stack-size-exceeded
			// and more about this: https://github.com/Automattic/mongoose/issues/1961#event-242694964
			// "Document#toObject([options]) - Converts this document into a plain javascript object, ready for storage in MongoDB." from http://mongoosejs.com/docs/api.html#document_Document-toObject
			var kedge = new KEdgeModel(datum).toObject();
			console.log("[kEdge::populateDemo] datum:\n" + JSON.stringify(datum));
			console.log("[kEdge::populateDemo] kedge:\n" + JSON.stringify(kedge)+"\n");
			data_array.push(kedge);
			entriesNo++;
			console.log("[kEdge::populateDemo] adding new edge to insertion array. entriesNo: %d", entriesNo);
		}
		finishedinserting = true;
		// console.log("[kEdge::populateDemo] data_array:\n" + JSON.stringify(data_array));
		
		KEdgeModel.collection.insert(data_array, onInsert); // call to underlying MongoDb driver

		function onInsert(err, docs) {
		    if (err) {
		    	entriesNo--;
		    	console.log('[kEdge::populateDemo::onInsert] err %s', err);
		    	errorOccured = true;
		    	reject();
		    } else {
		        console.info('[kEdge::populateDemo::onInsert] %d EDGES were successfully stored.', docs.length);
		        console.log("kEdge::populateDemo::docs: %s", JSON.stringify(docs));
		    	entriesNo -= docs.length;
		        console.info('\t[kEdge::populateDemo::onInsert] finishedinserting:%s, errorOccured:%s, entriesNo:%s', 
		        	finishedinserting, errorOccured, entriesNo);
		        if(finishedinserting && !errorOccured && entriesNo == 0){
			    	console.log('[kEdge::populateDemo::onInsert] last insertion finished. resolving');
		        	resolve();
		        }
		    }
		}
	});
}