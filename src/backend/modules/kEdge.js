'use strict';

/**
 * New node file
 */
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

//TODO - this is NOT called for update!!!??!! Just for SAVE:
global.db.kEdge.Schema.pre('save', function(next) {
	console.log("[modules/kEdge.js:pre/save]");
	  // get the current date
	  var currentDate = new Date();
	  
	  // change the updated_at field to current date
	  this.updated_at = currentDate;

	  // if created_at doesn't exist, add to that field
	  if (!this.created_at)
	    this.created_at = currentDate;

	  next();
	});



// curl -v -H "Content-Type: application/json" -X GET http://127.0.0.1:8888/kedges/one/5524344b498be1070ccca4f6
// curl -v -H "Content-Type: application/json" -X GET http://127.0.0.1:8888/kedges/one/5524344b498be1070ccca4f6
// curl -v -H "Content-Type: application/json" -X GET http://127.0.0.1:8888/kedges/one/5524344b498be1070ccca4f6
//curl -v -H "Content-Type: application/json" -X GET http://127.0.0.1:8888/kedges/between/551b4366fd64e5552ed19364/551bb2c68f6e4cfc35654f37
exports.index = function(req, res){
	var found = function(err,kEdges){
		console.log("[modules/kEdge.js:index] in 'found'");
		if (err){
			throw err;
			var msg = JSON.stringify(err);
			resSendJsonProtected(res, {data: kEdges, accessId : accessId, message: msg, success: false});
		}else{
			resSendJsonProtected(res, {data: kEdges, accessId : accessId, success: true});
		}
	}
	
	console.log("[modules/kEdge.js:index] req.body: %s", req.params.searchParam);
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
	
	switch (req.params.type){ //TODO: is parameter name correct?
		case 'one': //by edge id:
			kEdgeModel.findById(req.params.searchParam, found);
			break;
		case 'between':  //all edges between specific nodes:
			kEdgeModel.find( { $and:[ {'sourceId':req.params.searchParam}, {'targetId':req.params.searchParam2}]}, found);
			break;
		case 'connected': //all edges connected to knode.id
			kEdgeModel.find( { $or:[ {'sourceId':req.params.searchParam}, {'targetId':req.params.searchParam}]},found);
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
		console.log("[modules/kEdge.js:create] data (id:%d) created: %s", kEdge.id, JSON.stringify(kEdge));
		resSendJsonProtected(res, {success: true, data: data, accessId : accessId});
	});				
}

exports.update = function(req, res){
	console.log("[modules/kEdge.js:update] req.body: %s", JSON.stringify(req.body));

	var data = req.body;
	
	var kEdge = new kEdgeModel(kEdgeJSON);
	//TODO: check this: multi (boolean) whether multiple documents should be updated (false)
	kEdgeModel.findByIdAndUpdate(kEdge._id , kEdge, { multi: true }, function (err, numberAffected, raw) {
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