'use strict';

/**
 * New map file
 */
var mongoose = require('mongoose');
//var Promise = require("bluebird");

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


var KMapModel = mongoose.model('kMap', global.db.kMap.Schema);

// module.exports = KMapModel; //then we can use it by: var User = require('./app/models/KMapModel');

/* connecting */
var dbName = (global.dbConfig && global.dbConfig.name) || "KnAllEdge";
mongoose.connect('mongodb://127.0.0.1/' + dbName);
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));

// curl -v -H "Content-Type: application/json" -X GET http://127.0.0.1:8042/kmaps/one/551bdcda1763e3f0eb749bd4
// curl -v -H "Content-Type: application/json" -X GET http://127.0.0.1:8042/kmaps/all
exports.index = function(req, res){
console.log("dbName: %s", dbName);
	console.log("[modules/kMap.js:index]");
	var found = function(err,kMaps){
		//console.log("[modules/kMap.js:index] in 'found'");
		if (err){
			throw err;
			var msg = JSON.stringify(err);
			resSendJsonProtected(res, {data: kMaps, accessId : accessId, message: msg, success: false});
		}else{
			//console.log("[modules/kMap.js:index] Data:\n%s", JSON.stringify(kMaps));
			resSendJsonProtected(res, {data: kMaps, accessId : accessId, success: true});
		}
	}
	
	var id = req.params.searchParam;
	var type = req.params.type;

	if(mockup && mockup.db && mockup.db.data){
		var datas_json = [];
  		datas_json.push({id: 1, name: "Sun"});
  		datas_json.push({id: 2, name: "Earth"});
  		datas_json.push({id: 3, name: "Pluto"});
  		datas_json.push({id: 4, name: "Venera"});
		resSendJsonProtected(res, {data: datas_json, accessId : accessId});
	}
	//TODO: remove (this is for testing)
	KMapModel.find(function (err, kmaps) {
		//console.log("all data:\n length: %d.\n", kmaps.length);
		//console.log(kmaps);
		//resSendJsonProtected(res, {data: {, accessId : accessId, success: true});
	});
	
	console.log("[modules/kMap.js:index] req.params.searchParam: %s. req.params.searchParam2: %s", req.params.searchParam, req.params.searchParam2);
	switch (type){
		case 'one': //by id:
			console.log("findById:\n id: %s.\n", id);
			KMapModel.findById(id, found);
			break;
		case 'all': //all maps
			console.log("find:\n all: \n");
			KMapModel.find({}, found);
			break;		
		case 'by-type': //by map type
			console.log("find:\n by-type: \n");
			KMapModel.find({"type": id}, found);
			break;
	}
}

// curl -v -H "Content-Type: application/json" -X POST -d '{"name":"Hello Map", "iAmId":5, "visual": {}}' http://127.0.0.1:8042/kmaps
// curl -v -H "Content-Type: application/json" -X POST -d '{"_id":"551bdcda1763e3f0eb749bd4", "name":"Hello World ID", "iAmId":5, "visual": {"isOpen": true}}' http://127.0.0.1:8042/kmaps
exports.create = function(req, res){
	console.log("[modules/kMap.js:create] req.body: %s", JSON.stringify(req.body));
	
	var data = req.body;
	
	console.log(data);
	var kmap = new KMapModel(data);

	kmap.save(function(err) {
		if (err) throw err;
		console.log("[modules/KMap.js:create] id:%s, kmap data: %s", kmap._id, JSON.stringify(kmap));
		resSendJsonProtected(res, {success: true, data: kmap, accessId : accessId});
	});				
}

// curl -v -H "Content-Type: application/json" -X PUT -d '{"name": "Hello World Pt23", "iAmId": 5, "visual": {"isOpen": false}}' http://127.0.0.1:8042/kmaps/one/55266618cce5af993fe8675f
exports.update = function(req, res){
	//console.log("[modules/KMap.js:update] req.body: %s", JSON.stringify(req.body));

	var data = req.body;
	var id = req.params.searchParam;
	
	/* this is wrong because it creates default-values populated object (including id) first and then populate it with paremeter object:
	 * var kmap = new KMapModel(req.body);
	 */
	
	console.log("[modules/KMap.js:update] id : %s", id );
	console.log("[modules/KMap.js:update] data, : %s", JSON.stringify(data));
	// console.log("[modules/KMap.js:update] kmap.toObject(), : %s", JSON.stringify(kmap.toObject());
	delete data._id;

	data.updatedAt = new Date(); //TODO: workaround for hook "schema.pre('update',...)" not working
	KMapModel.update({_id:id}, data, function (err, raw) {
		if (err) throw err;
		console.log('The raw response from Mongo was ', raw);
		resSendJsonProtected(res, {success: true, data: data, accessId : accessId});
	});
	
	//TODO: check this: multi (boolean) whether multiple documents should be updated (false)
	//TODO: fix: numberAffected vraca 0, a raw vraca undefined. pitanje je da li su ispravni parametri callback f-je
	// KMapModel.findByIdAndUpdate(id , data, { /* multi: true */ }, function (err, numberAffected, raw) {
	// 	  if (err) throw err;
	// 	  console.log('The number of updated documents was %d', numberAffected);
	// 	  console.log('The raw response from Mongo was ', raw);
	// 	  resSendJsonProtected(res, {success: true, data: data, accessId : accessId});	
	// });			
}

// curl -v -H "Content-Type: application/json" -X DELETE http://127.0.0.1:8042/kmaps/one/553fa6ed4f05fdb0311a10cb
exports.destroy = function(req, res){
	//TODO: should we destroy edges connected to this map? or is it done automatically? or error is risen?
	var type = req.params.type;
	var dataId = req.params.searchParam;
	console.log("[modules/KMap.js:destroy] dataId:%s, type:%s, req.body: %s", dataId, type, JSON.stringify(req.body));
	
	KMapModel.findByIdAndRemove(dataId, function (err) {
			if (err) throw err;
			var data = {id:dataId};
			resSendJsonProtected(res, {success: true, data: data, accessId : accessId});
		}
	);
};