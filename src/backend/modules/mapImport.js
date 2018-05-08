'use strict';

/**
 * New map file
 */
var Promise = require("bluebird");
var fs = require('fs');

var dbService = require('./dbService');
var dbConnection = dbService.connect();

var KNodeModel = dbConnection.model('KNode', global.db.kNode.Schema);
var KEdgeModel = dbConnection.model('kEdge', global.db.kEdge.Schema);

var accessId = 0;

function loadDataFile(fileName, callback){
	console.log('[loadDataFile] loading file %s', fileName);
	fs.readFile(fileName, 'utf8', function (err, dataStr) {
		if (err) {
			console.log(err);
			if(callback) callback(err, null);
		}else{
			// console.log('[kEdge::populateDemo]parsing file:\n' + dataStr);
			var mapData = JSON.parse(dataStr);
			console.log("[loadDataFile] map name: %s", JSON.stringify(mapData.map.name));
			console.log("[loadDataFile] map mapId: %s", JSON.stringify(mapData.map._id));
			console.log("[loadDataFile] map rootNodeId: %s", JSON.stringify(mapData.map.rootNodeId));
			// console.log("[loadDataFile] mapData.map.nodes: %s", JSON.stringify(mapData.map.nodes.length));
			// console.log("[loadDataFile] mapData.map.edges: %s", JSON.stringify(mapData.map.edges.length));
			if(callback) callback(null, mapData);
		}
	});
}

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

/*
https://github.com/petkaantonov/bluebird
https://github.com/petkaantonov/bluebird/blob/master/API.md#new-promisefunctionfunction-resolve-function-reject-resolver---promise
https://github.com/petkaantonov/bluebird/blob/master/API.md#thenfunction-fulfilledhandler--function-rejectedhandler----promise
http://stackoverflow.com/questions/28000060/promised-mongo-cant-finalize-promise
*/
function populateNodeDemo(mapData){
	var entriesNo = 0;
	var finishedinserting = false;
	var errorOccured = false;
	return new Promise(function (resolve, reject) {
		//console.log('kNode populateDemo');
		var data_bulk = mapData.nodes;
		var rootNodeId = mapData.map.rootNodeId;
		var mapId = mapData.map._id;
		//console.log("typeof data_bulk:" + typeof data_bulk);
		var data_array = new Array();
		//var isRootNode = true;
		for (var datumId in data_bulk){
			var datum = data_bulk[datumId];
			// the first node in the node list will be recognized as a root node and its _id will be set to rootNodeId

//			if(isRootNode){
//				datum._id = rootNodeId;
//				isRootNode = false;
//			}

			// if mapId is missing (default state) it is set to properties.mapId
			if(!('mapId' in datum)) datum.mapId = mapId;
			// toObject() is called to avoid error 'RangeError: Maximum call stack size exceeded', caused by sending Mongoose object to MongoDb driver (invoked by 'Model.collection.insert')
			// http://stackoverflow.com/questions/24466366/mongoose-rangeerror-maximum-call-stack-size-exceeded
			// and more about this: https://github.com/Automattic/mongoose/issues/1961#event-242694964
			// "Document#toObject([options]) - Converts this document into a plain javascript object, ready for storage in MongoDB." from http://mongoosejs.com/docs/api.html#document_Document-toObject
			var knode = new KNodeModel(datum).toObject();
			//console.log("[kNode::populateDemo] datum:\n" + JSON.stringify(datum));
			//console.log("[kNode::populateDemo] knode:\n" + JSON.stringify(knode)+"\n");
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
function populateEdgeDemo(mapData){
	var entriesNo = 0;
	var finishedinserting = false;
	var errorOccured = false;
	return new Promise(function (resolve, reject) {

    var data_bulk = mapData.edges;
		var mapId = mapData.map._id;
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
			//console.log("[kEdge::populateDemo] datum:\n" + JSON.stringify(datum));
			//console.log("[kEdge::populateDemo] kedge:\n" + JSON.stringify(kedge)+"\n");
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

var KMapModel = dbConnection.model('kMap', global.db.kMap.Schema);

// curl -v -H "Content-Type: application/json" -X POST -d '{"name":"Hello Map", "iAmId":5, "visual": {}}' http://127.0.0.1:8042/kmaps
// curl -v -H "Content-Type: application/json" -X POST -d '{"_id":"551bdcda1763e3f0eb749bd4", "name":"Hello World ID", "iAmId":5, "visual": {"isOpen": true}}' http://127.0.0.1:8042/kmaps
exports.create = function(req, res){
  var result ="create called";
  // console.log("create::req:",req);
  // console.log("create::req.file:",req.file);
  // console.log('mapImport:: files no: '+ req.files.length);
  // for(var i = 0; i<req.files.length;){
  //     console.log("create::req.file:",req.files[i]);
  // }

  var file = req.files.file.path;
  console.log("file:",file);

  result="file received";

  loadDataFile(file, function(err, _mapData){
		if(err){
			throw err;
		}
		if(_mapData){
			var mapData = _mapData;
      console.log(mapData.map);

			KMapModel.findByIdAndRemove(mapData.map._id, function (err) {
				if (err) throw err;

	      var kmap = new KMapModel(mapData.map);
	      console.log('kmap',kmap);
				kmap.save(function(err) {
					if (err) throw err;
					console.log("[modules/KMap.js:create] id:%s, kmap data: %s", kmap._id, JSON.stringify(kmap));
	        console.log("[kNode.populate]");
	        KNodeModel.remove({mapId: mapData.map._id}).exec()
	        .then(function onFulfilled(result, info) {
	          //console.log("[kNode.remove()] params: result: " + result + ". info: " + JSON.stringify(info));
	          console.log("[kNode.remove()] Collection deleted. %d documents deleted: ", result);
	          //resolve();
	        }, function onRejected(err) {
	          console.log("[kNode.remove()] error on deleting collections. Error: " + err);
	          //reject();
	        })
	        .then(populateNodeDemo(mapData))
	        .then(function(data){
	          console.log('[kNode] all demo data successfully inserted');
	        });

	        KEdgeModel.remove({mapId: mapData.map._id}).exec()
	        .then(function onFulfilled(result, info) {
	          //console.log("[kEdge.remove()] params: result: " + result + ". info: " + JSON.stringify(info));
	          console.log("[kEdge.remove()] Collection deleted. %d documents deleted: ", result);
	          //resolve();
	        }, function onRejected(err) {
	          console.log("[kEdge.remove()] error on deleting collections. Error: " + err);
	          //reject();
	        })
	        .then(populateEdgeDemo(mapData))
	        .then(function(data){
	          console.log('[kEdge] all demo data successfully inserted');
	        });
				});
			});
		}
	});

  resSendJsonProtected(res, {success: true, data: result, accessId : accessId});
}
