'use strict';

/**
 * New whoAmI file
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


var WhoAmIModel = mongoose.model('WhoAmI', global.db.whoAmI.Schema);

// module.exports = WhoAmIModel; //then we can use it by: var User = require('./app/models/WhoAmIModel');

/* connecting */
var dbName = (global.dbConfig && global.dbConfig.name) || "KnAllEdge";
mongoose.connect('mongodb://127.0.0.1/' + dbName);
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));

// curl -v -H "Content-Type: application/json" -X GET http://127.0.0.1:8888/whoAmIs/one/5544aedea7592efb3e3c561d
// curl -v -H "Content-Type: application/json" -X GET http://127.0.0.1:8888/whoAmIs/in_map/552678e69ad190a642ad461c
exports.index = function(req, res){
	var found = function(err,whoAmIs){
		console.log("[modules/whoAmI.js:index] in 'found'");
		if (err){
			throw err;
			var msg = JSON.stringify(err);
			resSendJsonProtected(res, {data: whoAmIs, accessId : accessId, message: msg, success: false});
		}else{
			//console.log("[modules/whoAmI.js:index] Data:\n%s", JSON.stringify(whoAmIs));
			resSendJsonProtected(res, {data: whoAmIs, accessId : accessId, success: true});
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
	// WhoAmIModel.find(function (err, whoAmIs) {
	// 	console.log("all data:\n length: %d.\n", whoAmIs.length);
	// 	console.log(whoAmIs);
	// 	//resSendJsonProtected(res, {data: {, accessId : accessId, success: true});
	// });
	
	console.log("[modules/whoAmI.js:index] req.params.searchParam: %s. req.params.searchParam2: %s", req.params.searchParam, req.params.searchParam2);
	switch (req.params.type){
		case 'one': //by id:
			console.log("findById:\n id: %s.\n", id);
			WhoAmIModel.findById(id, found);
			break;
		case 'in_list': //by id:
			console.log("in_list:\n list: %s.\n", req.params.searchParam);
			WhoAmIModel.find({}, found);
			break;
		// case 'in_map': //all whoAmIs in specific map
		// 	console.log("find:\n mapId: %s.\n", id);
		// 	WhoAmIModel.find({ 'mapId': id}, found);
		// 	break;
		// case 'in_map_of_type': //all whoAmIs of particular type in specific map
		// 	console.log("find: mapId: %s, type: %s", id, id2);
		// 	WhoAmIModel.find({ $and: [{ mapId: id}, { type: id2}] }, found);
		// 	break;
	}
}

// curl -v -H "Content-Type: application/json" -X POST -d '{"firstname":"Sasha", "familyname": "Rudan", "displayName": "mPrinc"}' http://127.0.0.1:8888/whoAmIs
// curl -v -H "Content-Type: application/json" -X POST -d '{"_id":"551bdcda1763e3f0eb749bd4", "name":"Hello World ID", "iAmId":5, "visual": {"isOpen": true}}' http://127.0.0.1:8888/whoAmIs
exports.create = function(req, res){
	console.log("[modules/whoAmI.js:create] req.body: %s", JSON.stringify(req.body));
	
	var data = req.body;
	
	console.log(data);
	var whoAmI = new WhoAmIModel(data);

	whoAmI.save(function(err) {
		if (err) throw err;
		console.log("[modules/WhoAmI.js:create] id:%s, whoAmI data: %s", whoAmI._id, JSON.stringify(whoAmI));
		resSendJsonProtected(res, {success: true, data: whoAmI, accessId : accessId});
	});				
}

// curl -v -H "Content-Type: application/json" -X PUT -d '{"name": "Hello World Pt23", "iAmId": 5, "visual": {"isOpen": false}}' http://127.0.0.1:8888/whoAmIs/one/55266618cce5af993fe8675f
exports.update = function(req, res){
	//console.log("[modules/WhoAmI.js:update] req.body: %s", JSON.stringify(req.body));

	var data = req.body;
	var id = req.params.searchParam;
	
	/* this is wrong because it creates default-values populated object (including id) first and then populate it with paremeter object:
	 * var whoAmI = new WhoAmIModel(req.body);
	 */
	
	console.log("[modules/WhoAmI.js:update] id : %s", id );
	console.log("[modules/WhoAmI.js:update] data, : %s", JSON.stringify(data));
	// console.log("[modules/WhoAmI.js:update] whoAmI.toObject(), : %s", JSON.stringify(whoAmI.toObject());
	delete data._id;
	//TODO: check this: multi (boolean) whether multiple documents should be updated (false)
	//TODO: fix: numberAffected vraca 0, a raw vraca undefined. pitanje je da li su ispravni parametri callback f-je

	data.updatedAt = new Date(); //TODO: workaround for hook "schema.pre('update',...)" not working
	WhoAmIModel.update({_id:id}, data, function (err, raw) {
		if (err) throw err;
		console.log('The raw response from Mongo was ', raw);
		resSendJsonProtected(res, {success: true, data: data, accessId : accessId});
	});

	// WhoAmIModel.findByIdAndUpdate(id , data, { /* multi: true */ }, function (err, numberAffected, raw) {
	// 	  if (err) throw err;
	// 	  console.log('The number of updated documents was %d', numberAffected);
	// 	  console.log('The raw response from Mongo was ', raw);
	// 	  resSendJsonProtected(res, {success: true, data: data, accessId : accessId});	
	// });			
}

// curl -v -H "Content-Type: application/json" -X DELETE http://127.0.0.1:8888/whoAmIs/one/551bdcda1763e3f0eb749bd4
exports.destroy = function(req, res){
	//TODO: should we destroy edges connected to this whoAmI? or is it done automatically? or error is risen?
	var type = req.params.type;
	var dataId = req.params.searchParam;
	console.log("[modules/WhoAmI.js:destroy] dataId:%s, type:%s, req.body: %s", dataId, type, JSON.stringify(req.body));

	switch (type){
		case 'one':
			WhoAmIModel.findByIdAndRemove(dataId, function (err) {
					if (err) throw err;
					var data = {id:dataId};
					resSendJsonProtected(res, {success: true, data: data, accessId : accessId});
				}
			);
			break;
		// case 'in-map': //all whoAmIs connected to whoAmI.id
		// 	console.log("[modules/whoAmI.js:destroy] deleting whoAmIs in map %s", dataId);
		// 	WhoAmIModel.remove({'mapId': dataId}, function (err) {
		// 		if (err){
		// 			console.log("[modules/whoAmI.js:destroy] error:" + err);
		// 			throw err;
		// 		}
		// 		var data = {id:dataId};
		// 		console.log("[modules/whoAmI.js:destroy] data:" + JSON.stringify(data));
		// 		resSendJsonProtected(res, {success: true, data: data, accessId : accessId});
		// 	});
		// 	break;
	}
};