'use strict';

require('../models'); // injects DB Schemas in global.db

var mongoose = require('mongoose');
var Promise = require("bluebird");
// set it either in path: (node createDemoData.js 'demo_data.json') or default
var fileName = process.argv[2] || '../../data/demo_data.json';
var fs = require('fs');

/* connecting */
mongoose.connect('mongodb://127.0.0.1/KnAllEdge');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));

var KNodeModel = mongoose.model('KNode', global.db.kNode.Schema);
var KEdgeModel = mongoose.model('kEdge', global.db.kEdge.Schema);

var mapData = null;

db.on('open', function (callback) {
	writeToFile(fileName, function(err, _mapData){
		if(_mapData){
			mapData = _mapData;
			console.log("[kNode.populate]");
			KNodeModel.remove({mapId: mapData.properties.mapId}).exec()
			.then(function onFulfilled(result, info) {
				//console.log("[kNode.remove()] params: result: " + result + ". info: " + JSON.stringify(info));
				console.log("[kNode.remove()] Collection deleted. %d documents deleted: ", result);
				//resolve();
			}, function onRejected(err) {
				console.log("[kNode.remove()] error on deleting collections. Error: " + err);
				//reject();
			})
			.then(populateNodeDemo)
			.then(function(data){
				console.log('[kNode] all demo data successfully inserted');
			});
			
			KEdgeModel.remove({mapId: mapData.properties.mapId}).exec()
			.then(function onFulfilled(result, info) {
				//console.log("[kEdge.remove()] params: result: " + result + ". info: " + JSON.stringify(info));
				console.log("[kEdge.remove()] Collection deleted. %d documents deleted: ", result);
				//resolve();
			}, function onRejected(err) {
				console.log("[kEdge.remove()] error on deleting collections. Error: " + err);
				//reject();
			})
			.then(populateEdgeDemo)
			.then(function(data){
				console.log('[kEdge] all demo data successfully inserted');
			});
		}
	});
	
	//mongoose.connection.close();
});

function writeToFile(fileName, data, callback){
	console.log('[writeToFile] loading file %s', fileName);
	fs.writeFile(filename, data, callback)
	fs.readFile(fileName, 'utf8', function (err, dataStr) {
		if (err) {
			console.log(err);
			if(callback) callback(err, null);
		}else{
			// console.log('[kEdge::populateDemo]parsing file:\n' + dataStr);
			var mapData = JSON.parse(dataStr);
			console.log("[writeToFile] map name: %s", JSON.stringify(mapData.properties.name));
			console.log("[writeToFile] map mapId: %s", JSON.stringify(mapData.properties.mapId));
			console.log("[writeToFile] map rootNodeId: %s", JSON.stringify(mapData.properties.rootNodeId));
			console.log("[writeToFile] mapData.map.nodes: %s", JSON.stringify(mapData.map.nodes.length));
			console.log("[writeToFile] mapData.map.edges: %s", JSON.stringify(mapData.map.edges.length));
			if(callback) callback(null, mapData);			
		}
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