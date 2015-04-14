'use strict';

var mongoose = require('mongoose');

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

var kEdgeModel = mongoose.model('kEdge', global.db.kEdge.Schema);

// module.exports = kEdgeModel; //then we can use it by: var User = require('./app/models/kEdgeModel');

/* connecting */
mongoose.connect('mongodb://localhost/KnAllEdge');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));

var populate = 
	//false;
	true;
db.on('open', function (callback) {
	if(populate){
		kEdgeModel.remove().exec()
		.then(function (err) {
			if (err){throw err;}
			console.log('[kEdge] all collections successfully deleted');
		})
		.then(populateDemo)
		.then(function(data){
			console.log('[kEdge] all demo data successfully inserted');
		});
	}
});

function populateDemo(){
	//console.log('kNode populateDemo');
	var fs = require('fs');
	var fileName = '../data/demo_data.json';
	console.log('[kEdge::populateDemo]loading file %s', fileName);
	fs.readFile(fileName, 'utf8', function (err, dataStr) {
		if (err) {
			return console.log(err);
		}
		//console.log('[kEdge::populateDemo]parsing file:\n' + dataStr);
		var data = JSON.parse(dataStr);
		console.log("[kEdge::populateDemo]dataStr.map.nodes:\n" + JSON.stringify(data.map.edges));
		var data_bulk = data.map.edges;
		//console.log("typeof data_bulk:" + typeof data_bulk);
		var data_array = new Array();
		for (var datumId in data_bulk){
			var datum = data_bulk[datumId];
			// toObject() is called to avoid error 'RangeError: Maximum call stack size exceeded', caused by sending Mongoose object to MongoDb driver (invoked by 'Model.collection.insert')
			// http://stackoverflow.com/questions/24466366/mongoose-rangeerror-maximum-call-stack-size-exceeded
			// and more about this: https://github.com/Automattic/mongoose/issues/1961#event-242694964
			// "Document#toObject([options]) - Converts this document into a plain javascript object, ready for storage in MongoDB." from http://mongoosejs.com/docs/api.html#document_Document-toObject
			var kEdge = new kEdgeModel(datum).toObject();
			console.log("[kEdge::populateDemo]datum:\n" + JSON.stringify(datum));
			console.log("[kEdge::populateDemo]kEdge:\n" + JSON.stringify(kEdge)+"\n");
			data_array.push(kEdge);
		}
		console.log("[kEdge::populateDemo]data_array:\n" + JSON.stringify(data_array));
		
		kEdgeModel.collection.insert(data_array, onInsert); // call to underlying MongoDb driver

		function onInsert(err, docs) {
		    if (err) {
		    	console.log('[kEdge::populateDemo]err %s', err);
		    } else {
		        console.info('[kEdge::populateDemo]%d EDGES were successfully stored.', data_bulk.length);
		    }
		}
	});
}

// curl -v -H "Content-Type: application/json" -X GET http://127.0.0.1:8888/kedges/one/5524344b498be1070ccca4f6
// curl -v -H "Content-Type: application/json" -X GET http://127.0.0.1:8888/kedges/one/5524344b498be1070ccca4f6
// curl -v -H "Content-Type: application/json" -X GET http://127.0.0.1:8888/kedges/one/5524344b498be1070ccca4f6
//curl -v -H "Content-Type: application/json" -X GET http://127.0.0.1:8888/kedges/between/551b4366fd64e5552ed19364/551bb2c68f6e4cfc35654f37
exports.index = function(req, res){
	var found = function(err,kEdges){
		console.log("[modules/kEdge.js:index] in found; req.params.type: %s: ", req.params.type);
		console.log("kEdges:"+kEdges);
		if (err){
			throw err;
			var msg = JSON.stringify(err);
			resSendJsonProtected(res, {data: kEdges, accessId : accessId, message: msg, success: false});
		}else{
			resSendJsonProtected(res, {data: kEdges, accessId : accessId, success: true});
		}
	}
	
	console.log("[modules/kEdge.js:index] req.params.searchParam: %s. req.params.searchParam2: %s", req.params.searchParam, req.params.searchParam2);
	if(mockup && mockup.db && mockup.db.data){
		var datas_json = [];
		//TODO: change data here:
  		datas_json.push({id: 1, name: "Sun"});
  		datas_json.push({id: 2, name: "Earth"});
  		datas_json.push({id: 3, name: "Pluto"});
  		datas_json.push({id: 4, name: "Venera"});
		resSendJsonProtected(res, {data: datas_json, accessId : accessId});
	}
	
	//TODO: remove (testing)
	kEdgeModel.find(function (err, kEdges) {
		console.log(kEdges);
		//resSendJsonProtected(res, {data: {, accessId : accessId, success: true});
	});
	
	switch (req.params.type){
		case 'one': //by edge id:
			kEdgeModel.findById(req.params.searchParam, found);
			break;
		case 'between':  //all edges between specific nodes:
			kEdgeModel.find( { $and:[ {'sourceId':req.params.searchParam}, {'targetId':req.params.searchParam2}]}, found);
			break;
		case 'connected': //all edges connected to knode.id
			kEdgeModel.find( { $or:[ {'sourceId':req.params.searchParam}, {'targetId':req.params.searchParam}]},found);
			break;
		case 'in_map': //all edges in specific map
			kEdgeModel.find({ 'mapId': req.params.searchParam}, found);
			break;
	}
}

// curl -v -H "Content-Type: application/json" -X POST -d '{"name":"Hello Edge", "iAmId":5, "type":"contains", "sourceId":"551b4366fd64e5552ed19364", "targetId": "551bb2c68f6e4cfc35654f37", "ideaId":0}' http://127.0.0.1:8888/kedges
// curl -v -H "Content-Type: application/json" -X POST -d '{"name":"Hello Edge 3", "iAmId":6, "type":"contains", "ideaId":0}' http://127.0.0.1:8888/kedges
exports.create = function(req, res){
	console.log("[modules/kEdge.js:create] req.body: %s", JSON.stringify(req.body));
	
	var data = req.body;
	
	var kEdge = new kEdgeModel(data);
	//TODO: Should we force existence of node ids?
	if(data.sourceId){
		kEdge.sourceId = mongoose.Types.ObjectId(data.sourceId);
	}
	if(data.targetId){
		kEdge.targetId = mongoose.Types.ObjectId(data.targetId);
	}

	kEdge.save(function(err) {
		if (err) throw err;
		console.log("[modules/kEdge.js:create] data (id:%s) created data: %s", kEdge.id, JSON.stringify(kEdge));
		resSendJsonProtected(res, {success: true, data: kEdge, accessId : accessId});
	});				
}

//curl -v -H "Content-Type: application/json" -X PUT -d '{"name": "Hello World E1"}' http://127.0.0.1:8888/kedges/one/551bb2c68f6e4cfc35654f37
//curl -v -H "Content-Type: application/json" -X PUT -d '{"mapId": "552678e69ad190a642ad461c", "sourceId": "55268521fb9a901e442172f9", "targetId": "5526855ac4f4db29446bd183"}' http://127.0.0.1:8888/kedges/one/552475525034f70c166bf89c
exports.update = function(req, res){
	//console.log("[modules/KNode.js:update] req.body: %s", JSON.stringify(req.body));

	var data = req.body;
	var id = req.params.searchParam;
	
	console.log("[modules/KNode.js:update] id : %s", id );
	console.log("[modules/KNode.js:update] data, : %s", JSON.stringify(data));
	
	delete data._id;
	//TODO: check this: multi (boolean) whether multiple documents should be updated (false)
	//TODO: fix: numberAffected vraca 0, a raw vraca undefined. pitanje je da li su ispravni parametri callback f-je
	kEdgeModel.findByIdAndUpdate(id , data, { /* multi: true */ }, function (err, numberAffected, raw) {
		  if (err) throw err;
		  console.log('The number of updated documents was %d', numberAffected);
		  console.log('The raw response from Mongo was ', raw);
		  resSendJsonProtected(res, {success: true, data: data, accessId : accessId});	
	});			
}

exports.destroy = function(req, res){
	var type = req.params.type;
	var dataId = req.params.searchParam;
	console.log("[modules/kEdge.js:destroy] dataId:%s, type:%s, req.body: %s", dataId, type, JSON.stringify(req.body));
	
	kEdgeModel.findByIdAndRemove(dataId, function (err) {
			if (err) throw err;
			var data = {id:dataId};
			resSendJsonProtected(res, {success: true, data: data, accessId : accessId});
		}
	);
};