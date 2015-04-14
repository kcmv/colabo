'use strict';

/**
 * New node file
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


var KNodeModel = mongoose.model('KNode', global.db.kNode.Schema);

// module.exports = KNodeModel; //then we can use it by: var User = require('./app/models/KNodeModel');

/* connecting */
mongoose.connect('mongodb://127.0.0.1/KnAllEdge');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));

var populate = 
false;
//true;

db.on('open', function (callback) {
	if(populate){
		KNodeModel.remove().exec()
		.then(function (err) {
			if (err){
				console.log("[KNodeModel.remove()] error on deleting all collections. Error: " + err);
				throw err;
			}
			console.log('[kNode] all collections successfully deleted');
		})
		.then(populateDemo)
		.then(function(data){
			console.log('[kNode] all demo data successfully inserted');
		});
	}
});

/*
https://github.com/petkaantonov/bluebird
https://github.com/petkaantonov/bluebird/blob/master/API.md#new-promisefunctionfunction-resolve-function-reject-resolver---promise
https://github.com/petkaantonov/bluebird/blob/master/API.md#thenfunction-fulfilledhandler--function-rejectedhandler----promise
http://stackoverflow.com/questions/28000060/promised-mongo-cant-finalize-promise
*/
function populateDemo(){
	var entriesNo = 0;
	var finishedinserting = false;
	var errorOccured = false;
	return new Promise(function (resolve, reject) {
		//console.log('kNode populateDemo');
		var fs = require('fs');
		var fileName = '../data/demo_data.json';
		console.log('[kNode::populateDemo] loading file %s', fileName);
		fs.readFile(fileName, 'utf8', function (err, dataStr) {
			if (err) {
				return console.log(err);
			}
			//console.log('[kNode::populateDemo]parsing file:\n' + dataStr);
			var data = JSON.parse(dataStr);
			console.log("[kNode::populateDemo] dataStr.map.nodes:\n" + JSON.stringify(data.map.nodes));
			var data_bulk = data.map.nodes;
			//console.log("typeof data_bulk:" + typeof data_bulk);
			var data_array = new Array();
			for (var datumId in data_bulk){
				var datum = data_bulk[datumId];
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
			console.log("[kNode::populateDemo] data_array:\n" + JSON.stringify(data_array));
			
			KNodeModel.collection.insert(data_array, onInsert); // call to underlying MongoDb driver

			function onInsert(err, docs) {
			    if (err) {
			    	entriesNo--;
			    	console.log('[kNode::populateDemo::onInsert] err %s', err);
			    	errorOccured = true;
			    	reject();
			    } else {
			        console.info('[kNode::populateDemo::onInsert] %d NODES were successfully stored.', data_bulk.length);
			    	entriesNo -= data_bulk.length;
			        console.info('\t[kNode::populateDemo::onInsert] finishedinserting:%s, errorOccured:%s, entriesNo:%s', 
			        	finishedinserting, errorOccured, entriesNo);
			        if(finishedinserting && !errorOccured && entriesNo == 0){
				    	console.log('[kNode::populateDemo::onInsert] last insertion finished. resolving');
			        	resolve();
			        }
			    }
			}
		});
	});
}

// curl -v -H "Content-Type: application/json" -X GET http://127.0.0.1:8888/knodes/one/551bdcda1763e3f0eb749bd4
// curl -v -H "Content-Type: application/json" -X GET http://127.0.0.1:8888/knodes/in_map/552678e69ad190a642ad461c
exports.index = function(req, res){
	var found = function(err,kNodes){
		console.log("[modules/kNode.js:index] in 'found'");
		if (err){
			throw err;
			var msg = JSON.stringify(err);
			resSendJsonProtected(res, {data: kNodes, accessId : accessId, message: msg, success: false});
		}else{
			console.log("[modules/kNode.js:index] Data:\n%s", JSON.stringify(kNodes));
			resSendJsonProtected(res, {data: kNodes, accessId : accessId, success: true});
		}
	}
	
	var id = req.params.searchParam;
	if(mockup && mockup.db && mockup.db.data){
		var datas_json = [];
  		datas_json.push({id: 1, name: "Sun"});
  		datas_json.push({id: 2, name: "Earth"});
  		datas_json.push({id: 3, name: "Pluto"});
  		datas_json.push({id: 4, name: "Venera"});
		resSendJsonProtected(res, {data: datas_json, accessId : accessId});
	}
	//TODO: remove (this is for testing)
	KNodeModel.find(function (err, knodes) {
		console.log("all data:\n length: %d.\n", knodes.length);
		console.log(knodes);
		//resSendJsonProtected(res, {data: {, accessId : accessId, success: true});
	});
	
	console.log("[modules/kNode.js:index] req.params.searchParam: %s. req.params.searchParam2: %s", req.params.searchParam, req.params.searchParam2);
	switch (req.params.type){
		case 'one': //by id:
			console.log("findById:\n id: %s.\n", id);
			KNodeModel.findById(id, found);
			break;
		case 'in_map': //all nodes in specific map
			console.log("findById:\n mapId: %s.\n", id);
			KNodeModel.find({ 'mapId': id}, found);
			break;
	}
}

// curl -v -H "Content-Type: application/json" -X POST -d '{"name":"Hello World Pl", "iAmId":5, "visual": {"isOpen": true}}' http://127.0.0.1:8888/knodes
// curl -v -H "Content-Type: application/json" -X POST -d '{"_id":"551bdcda1763e3f0eb749bd4", "name":"Hello World ID", "iAmId":5, "visual": {"isOpen": true}}' http://127.0.0.1:8888/knodes
exports.create = function(req, res){
	console.log("[modules/kNode.js:create] req.body: %s", JSON.stringify(req.body));
	
	var data = req.body;
	
	console.log(data);
	var knode = new KNodeModel(data);

	knode.save(function(err) {
		if (err) throw err;
		console.log("[modules/KNode.js:create] id:%s, knode data: %s", knode._id, JSON.stringify(knode));
		resSendJsonProtected(res, {success: true, data: knode, accessId : accessId});
	});				
}

// curl -v -H "Content-Type: application/json" -X PUT -d '{"name": "Hello World Pt23", "iAmId": 5, "visual": {"isOpen": false}}' http://127.0.0.1:8888/knodes/one/55266618cce5af993fe8675f
exports.update = function(req, res){
	//console.log("[modules/KNode.js:update] req.body: %s", JSON.stringify(req.body));

	var data = req.body;
	var id = req.params.searchParam;
	
	/* this is wrong because it creates default-values populated object (including id) first and then populate it with paremeter object:
	 * var knode = new KNodeModel(req.body);
	 */
	
	console.log("[modules/KNode.js:update] id : %s", id );
	console.log("[modules/KNode.js:update] data, : %s", JSON.stringify(data));
	// console.log("[modules/KNode.js:update] knode.toObject(), : %s", JSON.stringify(knode.toObject());
	delete data._id;
	//TODO: check this: multi (boolean) whether multiple documents should be updated (false)
	//TODO: fix: numberAffected vraca 0, a raw vraca undefined. pitanje je da li su ispravni parametri callback f-je
	KNodeModel.findByIdAndUpdate(id , data, { /* multi: true */ }, function (err, numberAffected, raw) {
		  if (err) throw err;
		  console.log('The number of updated documents was %d', numberAffected);
		  console.log('The raw response from Mongo was ', raw);
		  resSendJsonProtected(res, {success: true, data: data, accessId : accessId});	
	});			
}

// curl -v -H "Content-Type: application/json" -X DELETE http://127.0.0.1:8888/knodes/one/551bdcda1763e3f0eb749bd4
exports.destroy = function(req, res){
	//TODO: should we destroy edges connected to this node? or is it done automatically? or error is risen?
	var type = req.params.type;
	var dataId = req.params.searchParam;
	console.log("[modules/KNode.js:destroy] dataId:%s, type:%s, req.body: %s", dataId, type, JSON.stringify(req.body));
	
	KNodeModel.findByIdAndRemove(dataId, function (err) {
			if (err) throw err;
			var data = {id:dataId};
			resSendJsonProtected(res, {success: true, data: data, accessId : accessId});
		}
	);
};