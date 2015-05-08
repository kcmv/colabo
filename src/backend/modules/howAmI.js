'use strict';

/**
 * New howAmI file
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


var HowAmIModel = mongoose.model('HowAmI', global.db.howAmI.Schema);

// module.exports = HowAmIModel; //then we can use it by: var User = require('./app/models/HowAmIModel');

/* connecting */
mongoose.connect('mongodb://127.0.0.1/KnAllEdge');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));

// curl -v -H "Content-Type: application/json" -X GET http://127.0.0.1:8888/howAmIs/one/5544aedea7592efb3e3c561d
// curl -v -H "Content-Type: application/json" -X GET http://127.0.0.1:8888/howAmIs/in_map/552678e69ad190a642ad461c
exports.index = function(req, res){
	var found = function(err,howAmIs){
		console.log("[modules/howAmI.js:index] in 'found'");
		if (err){
			throw err;
			var msg = JSON.stringify(err);
			resSendJsonProtected(res, {data: howAmIs, accessId : accessId, message: msg, success: false});
		}else{
			//console.log("[modules/howAmI.js:index] Data:\n%s", JSON.stringify(howAmIs));
			resSendJsonProtected(res, {data: howAmIs, accessId : accessId, success: true});
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
	// HowAmIModel.find(function (err, howAmIs) {
	// 	console.log("all data:\n length: %d.\n", howAmIs.length);
	// 	console.log(howAmIs);
	// 	//resSendJsonProtected(res, {data: {, accessId : accessId, success: true});
	// });
	
	console.log("[modules/howAmI.js:index] req.params.searchParam: %s. req.params.searchParam2: %s", req.params.searchParam, req.params.searchParam2);
	switch (req.params.type){
		case 'one': //by id:
			console.log("findById:\n id: %s.\n", id);
			HowAmIModel.findById(id, found);
			break;
		case 'who_am_i': //by id:
			console.log("in_list:\n list: %s.\n", req.params.searchParam);
			HowAmIModel.find({whoAmI:id}, found);
			break;
		// case 'in_map': //all howAmIs in specific map
		// 	console.log("find:\n mapId: %s.\n", id);
		// 	HowAmIModel.find({ 'mapId': id}, found);
		// 	break;
		// case 'in_map_of_type': //all howAmIs of particular type in specific map
		// 	console.log("find: mapId: %s, type: %s", id, id2);
		// 	HowAmIModel.find({ $and: [{ mapId: id}, { type: id2}] }, found);
		// 	break;
	}
}

// curl -v -H "Content-Type: application/json" -X POST -d '{"whoAmI":"55268521fb9a901e442172f9", "whatAmI": "554c067c423f0e7d451d2ea4", "how": "like"}' http://127.0.0.1:8888/howAmIs
// curl -v -H "Content-Type: application/json" -X POST -d '{"whoAmI":"5548fee2e59efb4e0bbb8478", "whatAmI": "554c068e423f0e7d451d2ea5", "how": "like"}' http://127.0.0.1:8888/howAmIs
// curl -v -H "Content-Type: application/json" -X POST -d '{"_id":"551bdcda1763e3f0eb749bd4", "name":"Hello World ID", "iAmId":5, "visual": {"isOpen": true}}' http://127.0.0.1:8888/howAmIs
exports.create = function(req, res){
	console.log("[modules/howAmI.js:create] req.body: %s", JSON.stringify(req.body));
	
	var data = req.body;
	
	console.log(data);
	var howAmI = new HowAmIModel(data);

	howAmI.save(function(err) {
		if (err) throw err;
		console.log("[modules/HowAmI.js:create] id:%s, howAmI data: %s", howAmI._id, JSON.stringify(howAmI));
		resSendJsonProtected(res, {success: true, data: howAmI, accessId : accessId});
	});				
}

// curl -v -H "Content-Type: application/json" -X PUT -d '{"name": "Hello World Pt23", "iAmId": 5, "visual": {"isOpen": false}}' http://127.0.0.1:8888/howAmIs/one/55266618cce5af993fe8675f
exports.update = function(req, res){
	//console.log("[modules/HowAmI.js:update] req.body: %s", JSON.stringify(req.body));

	var data = req.body;
	var id = req.params.searchParam;
	
	/* this is wrong because it creates default-values populated object (including id) first and then populate it with paremeter object:
	 * var howAmI = new HowAmIModel(req.body);
	 */
	
	console.log("[modules/HowAmI.js:update] id : %s", id );
	console.log("[modules/HowAmI.js:update] data, : %s", JSON.stringify(data));
	// console.log("[modules/HowAmI.js:update] howAmI.toObject(), : %s", JSON.stringify(howAmI.toObject());
	delete data._id;
	//TODO: check this: multi (boolean) whether multiple documents should be updated (false)
	//TODO: fix: numberAffected vraca 0, a raw vraca undefined. pitanje je da li su ispravni parametri callback f-je
	HowAmIModel.findByIdAndUpdate(id , data, { /* multi: true */ }, function (err, numberAffected, raw) {
		  if (err) throw err;
		  console.log('The number of updated documents was %d', numberAffected);
		  console.log('The raw response from Mongo was ', raw);
		  resSendJsonProtected(res, {success: true, data: data, accessId : accessId});	
	});			
}

// curl -v -H "Content-Type: application/json" -X DELETE http://127.0.0.1:8888/howAmIs/one/551bdcda1763e3f0eb749bd4
exports.destroy = function(req, res){
	//TODO: should we destroy edges connected to this howAmI? or is it done automatically? or error is risen?
	var type = req.params.type;
	var dataId = req.params.searchParam;
	console.log("[modules/HowAmI.js:destroy] dataId:%s, type:%s, req.body: %s", dataId, type, JSON.stringify(req.body));

	switch (type){
		case 'one':
			HowAmIModel.findByIdAndRemove(dataId, function (err) {
					if (err) throw err;
					var data = {id:dataId};
					resSendJsonProtected(res, {success: true, data: data, accessId : accessId});
				}
			);
			break;
		// case 'in-map': //all howAmIs connected to howAmI.id
		// 	console.log("[modules/howAmI.js:destroy] deleting howAmIs in map %s", dataId);
		// 	HowAmIModel.remove({'mapId': dataId}, function (err) {
		// 		if (err){
		// 			console.log("[modules/howAmI.js:destroy] error:" + err);
		// 			throw err;
		// 		}
		// 		var data = {id:dataId};
		// 		console.log("[modules/howAmI.js:destroy] data:" + JSON.stringify(data));
		// 		resSendJsonProtected(res, {success: true, data: data, accessId : accessId});
		// 	});
		// 	break;
	}
};