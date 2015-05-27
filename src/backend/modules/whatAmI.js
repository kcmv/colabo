'use strict';

/**
 * New whatAmI file
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


var WhatAmIModel = mongoose.model('WhatAmI', global.db.whatAmI.Schema);

// module.exports = WhatAmIModel; //then we can use it by: var User = require('./app/models/WhatAmIModel');

/* connecting */
var dbName = (global.dbConfig && global.dbConfig.name) || "KnAllEdge";
mongoose.connect('mongodb://127.0.0.1/' + dbName);
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));

// curl -v -H "Content-Type: application/json" -X GET http://127.0.0.1:8888/whatAmIs/one/5544aedea7592efb3e3c561d
// curl -v -H "Content-Type: application/json" -X GET http://127.0.0.1:8888/whatAmIs/in_map/552678e69ad190a642ad461c
exports.index = function(req, res){
	var found = function(err,whatAmIs){
		console.log("[modules/whatAmI.js:index] in 'found'");
		if (err){
			throw err;
			var msg = JSON.stringify(err);
			resSendJsonProtected(res, {data: whatAmIs, accessId : accessId, message: msg, success: false});
		}else{
			//console.log("[modules/whatAmI.js:index] Data:\n%s", JSON.stringify(whatAmIs));
			resSendJsonProtected(res, {data: whatAmIs, accessId : accessId, success: true});
		}
	}
	
	var id = req.params.searchParam;
	var id2 = req.params.searchParam2;
	if(mockup && mockup.db && mockup.db.data){
		var datas_json = [];
  		// datas_json.push({id: 1, name: "Sun"});
  		// datas_json.push({id: 2, name: "Earth"});
  		// datas_json.push({id: 3, name: "Pluto"});
  		// datas_json.push({id: 4, name: "Venera"});
		resSendJsonProtected(res, {data: datas_json, accessId : accessId});
	}
	//TODO: remove (this is for testing)
	// WhatAmIModel.find(function (err, whatAmIs) {
	// 	console.log("all data:\n length: %d.\n", whatAmIs.length);
	// 	console.log(whatAmIs);
	// 	//resSendJsonProtected(res, {data: {, accessId : accessId, success: true});
	// });
	
	console.log("[modules/whatAmI.js:index] req.params.searchParam: %s. req.params.searchParam2: %s", req.params.searchParam, req.params.searchParam2);
	switch (req.params.type){
		case 'one': //by id:
			console.log("one:\n id: %s.\n", id);
			WhatAmIModel.findById(id, found);
			break;
		case 'in_list': //by list of ids:
			console.log("in_list:\n list: %s.\n", req.params.searchParam);
			var ids = JSON.parse(id);
			console.log("in_list:\n ids: %s.\n", ids);
			WhatAmIModel.find( {'_id': { $in:ids}}, found);
			break;
		case 'all':
			console.log("all:");
			WhatAmIModel.find(found);
			break;
		case 'name': //by id:
			console.log("name:\n list: %s.\n", req.params.searchParam);
			WhatAmIModel.findByName(id, found);
			break;
		case 'name-contains': //by id:
			console.log("name-contains:\n list: %s.\n", req.params.searchParam);
			WhatAmIModel.findByNameContaining(id, found);

			break;
		// case 'in_map': //all whatAmIs in specific map
		// 	console.log("find:\n mapId: %s.\n", id);
		// 	WhatAmIModel.find({ 'mapId': id}, found);
		// 	break;
		// case 'in_map_of_type': //all whatAmIs of particular type in specific map
		// 	console.log("find: mapId: %s, type: %s", id, id2);
		// 	WhatAmIModel.find({ $and: [{ mapId: id}, { type: id2}] }, found);
		// 	break;
	}
}

// curl -v -H "Content-Type: application/json" -X POST -d '{"name":"IT"}' http://127.0.0.1:8888/whatAmIs
// curl -v -H "Content-Type: application/json" -X POST -d '{"_id":"551bdcda1763e3f0eb749bd4", "name":"Hello World ID", "iAmId":5, "visual": {"isOpen": true}}' http://127.0.0.1:8888/whatAmIs
exports.create = function(req, res){
	console.log("[modules/whatAmI.js:create] req.body: %s", JSON.stringify(req.body));
	
	var data = req.body;
	
	console.log(data);
	var whatAmI = new WhatAmIModel(data);

	whatAmI.save(function(err) {
		if (err) throw err;
		console.log("[modules/WhatAmI.js:create] id:%s, whatAmI data: %s", whatAmI._id, JSON.stringify(whatAmI));
		resSendJsonProtected(res, {success: true, data: whatAmI, accessId : accessId});
	});				
}

// curl -v -H "Content-Type: application/json" -X PUT -d '{"name": "Hello World Pt23", "iAmId": 5, "visual": {"isOpen": false}}' http://127.0.0.1:8888/whatAmIs/one/55266618cce5af993fe8675f
exports.update = function(req, res){
	//console.log("[modules/WhatAmI.js:update] req.body: %s", JSON.stringify(req.body));

	var data = req.body;
	var id = req.params.searchParam;
	
	/* this is wrong because it creates default-values populated object (including id) first and then populate it with paremeter object:
	 * var whatAmI = new WhatAmIModel(req.body);
	 */
	
	console.log("[modules/WhatAmI.js:update] id : %s", id );
	console.log("[modules/WhatAmI.js:update] data, : %s", JSON.stringify(data));
	// console.log("[modules/WhatAmI.js:update] whatAmI.toObject(), : %s", JSON.stringify(whatAmI.toObject());
	delete data._id;

	data.updatedAt = new Date(); //TODO: workaround for hook "schema.pre('update',...)" not working
	WhatAmIModel.update({_id:id}, data, function (err, raw) {
		if (err) throw err;
		console.log('The raw response from Mongo was ', raw);
		resSendJsonProtected(res, {success: true, data: data, accessId : accessId});
	});
	
	//TODO: check this: multi (boolean) whether multiple documents should be updated (false)
	//TODO: fix: numberAffected vraca 0, a raw vraca undefined. pitanje je da li su ispravni parametri callback f-je
	// WhatAmIModel.findByIdAndUpdate(id , data, { /* multi: true */ }, function (err, numberAffected, raw) {
	// 	  if (err) throw err;
	// 	  console.log('The number of updated documents was %d', numberAffected);
	// 	  console.log('The raw response from Mongo was ', raw);
	// 	  resSendJsonProtected(res, {success: true, data: data, accessId : accessId});	
	// });			
}

// curl -v -H "Content-Type: application/json" -X DELETE http://127.0.0.1:8888/whatAmIs/one/551bdcda1763e3f0eb749bd4
exports.destroy = function(req, res){
	//TODO: should we destroy edges connected to this whatAmI? or is it done automatically? or error is risen?
	var type = req.params.type;
	var dataId = req.params.searchParam;
	console.log("[modules/WhatAmI.js:destroy] dataId:%s, type:%s, req.body: %s", dataId, type, JSON.stringify(req.body));

	switch (type){
		case 'one':
			WhatAmIModel.findByIdAndRemove(dataId, function (err) {
					if (err) throw err;
					var data = {id:dataId};
					resSendJsonProtected(res, {success: true, data: data, accessId : accessId});
				}
			);
			break;
		// case 'in-map': //all whatAmIs connected to whatAmI.id
		// 	console.log("[modules/whatAmI.js:destroy] deleting whatAmIs in map %s", dataId);
		// 	WhatAmIModel.remove({'mapId': dataId}, function (err) {
		// 		if (err){
		// 			console.log("[modules/whatAmI.js:destroy] error:" + err);
		// 			throw err;
		// 		}
		// 		var data = {id:dataId};
		// 		console.log("[modules/whatAmI.js:destroy] data:" + JSON.stringify(data));
		// 		resSendJsonProtected(res, {success: true, data: data, accessId : accessId});
		// 	});
		// 	break;
	}
};