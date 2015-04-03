'use strict';

/**
 * New node file
 */
var mongoose = require('mongoose');


var mockup = {fb: {authenticate: false}, db: {data:false}};
var accessId = 0;
var LIMIT_NO = 25;

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

var kEdgeModel = mongoose.model('kEdge', kEdgeSchema);

// module.exports = kEdgeModel; //then we can use it by: var User = require('./app/models/kEdgeModel');

/* connecting */
mongoose.connect('mongodb://localhost/KnAllEdge');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));

/*
userSchema.pre('save', function(next) {
	  // get the current date
	  var currentDate = new Date();
	  
	  // change the updated_at field to current date
	  this.updated_at = currentDate;

	  // if created_at doesn't exist, add to that field
	  if (!this.created_at)
	    this.created_at = currentDate;

	  next();
	});
*/



exports.index = function(req, res){
	if(mockup && mockup.db && mockup.db.data){
		var datas_json = [];
		//TODO: change data here:
  		datas_json.push({id: 1, name: "Sun"});
  		datas_json.push({id: 2, name: "Earth"});
  		datas_json.push({id: 3, name: "Pluto"});
  		datas_json.push({id: 4, name: "Venera"});
		resSendJsonProtected(res, {data: datas_json, accessId : accessId});
	}
	
	//TODO: add selector for 2 options:
	
	//by connected nodes:
	kEdgeModel.find( { $and:[ {'sourceId':sourceId}, {'targetId':targetId}]}, function(err,kEdges){
		if (err){
			throw err;
			var msg = JSON.stringify(err);
			resSendJsonProtected(res, {data: kEdges, accessId : accessId, message: msg, success: false});
		}else{
			resSendJsonProtected(res, {data: kEdges, accessId : accessId, success: true});
		};

	});

	//by id:
	kEdgeModel.findById(req.params.searchParam, function (err, kEdge) {
		if (err){
			throw err;
			var msg = JSON.stringify(err);
			resSendJsonProtected(res, {data: kEdge, accessId : accessId, message: msg, success: false});
		}else{
			resSendJsonProtected(res, {data: kEdge, accessId : accessId, success: true});
		};
	});
}

exports.create = function(req, res){
	console.log("[modules/kEdge.js:create] req.body: %s", JSON.stringify(req.body));
	
	var data = req.body;
	
	var kEdge = new kEdgeModel(data);

	kEdge.save(function(err) {
		if (err) throw err;
		console.log("[modules/kEdge.js:create] data (id:%d) created: %s", data.id, JSON.stringify(data));
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