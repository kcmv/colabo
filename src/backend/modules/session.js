'use strict';

/**
 * New session file
 */
//var Promise = require("bluebird");

//var mockup = {fb: {authenticate: false}, db: {data:false}};
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

var dbService = require('./dbService');
var dbConnection = dbService.connect();

var SessionModel = dbConnection.model('Session', global.db.session.Schema);

// module.exports = SessionModel; //then we can use it by: var User = require('./app/models/SessionModel');

// curl -v -H "Content-Type: application/json" -X GET http://127.0.0.1:8888/sessions/one/5544aedea7592efb3e3c561d
// curl -v -H "Content-Type: application/json" -X GET http://127.0.0.1:8888/sessions/in_map/552678e69ad190a642ad461c
exports.index = function(req, res){

	/**
	 * [function called as a find callback]
	 * @param  {[type]} err     [description]
	 * @param  {[type]} sessions [description]
	 * @return {[type]}         [description]
	 */
	var found = function(err,sessions){
		console.log("[modules/session.js:index] in 'found'");
		if (err){
			throw err;
			var msg = JSON.stringify(err);
			resSendJsonProtected(res, {data: sessions, accessId : accessId, message: msg, success: false});
		}else{
			console.log("[modules/session.js:index] Data:\n%s", JSON.stringify(sessions));
			resSendJsonProtected(res, {data: sessions, accessId : accessId, success: true});
		}
	}

	var id = req.params.searchParam;
	var id2 = req.params.searchParam2;

	//TODO: remove (this is for testing)
	// SessionModel.find(function (err, sessions) {
	// 	console.log("all data:\n length: %d.\n", sessions.length);
	// 	console.log(sessions);
	// 	//resSendJsonProtected(res, {data: {, accessId : accessId, success: true});
	// });

	console.log("[modules/session.js:index] req.params.searchParam: %s. req.params.searchParam2: %s", req.params.searchParam, req.params.searchParam2);
	switch (req.params.type){
		case 'one': //by id:

			SessionModel.findById(id, found);
		console.log("[byId] Id: %s.\n", id);
			break;
		case 'oneByEmail': // by email
			console.log("findBy e-mail:\n e-mail: %s.\n", id);
			SessionModel.findOne({e_mail: id}, found);
			break;
		// case 'in_list': //by id:
		// 	console.log("in_list:\n list: %s.\n", req.params.searchParam);
		// 	var ids = []
		// 	if(req.params.searchParam != undefined){
		// 		var ids = req.params.searchParam.split(',');
		// 	}
		// 	console.log('isArray:', Array.isArray(ids),ids.length);
		// 	SessionModel.find({_id: {$in: ids}}, found);
		// 	break;
		case 'in_map':
			var mapId = req.params.searchParam;
			console.log("in_map:\n mapId: %s.\n", mapId);
			SessionModel.find({mapId: mapId}, found);
			break;
		case 'all':
			console.log("all", req.params.searchParam);
			SessionModel.find().exec(found);
			break;
		// case 'in_map': //all sessions in specific map
		// 	console.log("find:\n mapId: %s.\n", id);
		// 	SessionModel.find({ 'mapId': id}, found);
		// 	break;
		// case 'in_map_of_type': //all sessions of particular type in specific map
		// 	console.log("find: mapId: %s, type: %s", id, id2);
		// 	SessionModel.find({ $and: [{ mapId: id}, { type: id2}] }, found);
		// 	break;
		default:
			console.log("type not defined");
			resSendJsonProtected(res, {success: false});
	}
}

// curl -v -H "Content-Type: application/json" -X POST -d '{"firstname":"Sasha", "familyname": "Rudan", "displayName": "mPrinc"}' http://127.0.0.1:8888/sessions
// curl -v -H "Content-Type: application/json" -X POST -d '{"_id":"551bdcda1763e3f0eb749bd4", "name":"Hello World ID", "iAmId":5, "visual": {"isOpen": true}}' http://127.0.0.1:8888/sessions
exports.create = function(req, res){
	console.log("[modules/session.js:create] req.body: %s", JSON.stringify(req.body));

	var data = req.body;

	console.log(data);
	var session = new SessionModel(data);

	session.save(function(err) {
		if (err) throw err;
		console.log("[modules/Session.js:create] id:%s, session data: %s", session._id, JSON.stringify(session));
		resSendJsonProtected(res, {success: true, data: session, accessId : accessId});
	});
}

// curl -v -H "Content-Type: application/json" -X PUT -d '{"name": "Hello World Pt23", "iAmId": 5, "visual": {"isOpen": false}}' http://127.0.0.1:8888/sessions/one/55266618cce5af993fe8675f
exports.update = function(req, res){
	//console.log("[modules/Session.js:update] req.body: %s", JSON.stringify(req.body));

	var data = req.body;
	var id = req.params.searchParam;

	/* this is wrong because it creates default-values populated object (including id) first and then populate it with paremeter object:
	 * var session = new SessionModel(req.body);
	 */

	console.log("[modules/Session.js:update] id : %s", id );
	console.log("[modules/Session.js:update] data, : %s", JSON.stringify(data));
	// console.log("[modules/Session.js:update] session.toObject(), : %s", JSON.stringify(session.toObject());
	delete data._id;
	//TODO: check this: multi (boolean) whether multiple documents should be updated (false)
	//TODO: fix: numberAffected vraca 0, a raw vraca undefined. pitanje je da li su ispravni parametri callback f-je

	data.updatedAt = new Date(); //TODO: workaround for hook "schema.pre('update',...)" not working
	SessionModel.update({_id:id}, data, function (err, raw) {
		if (err) throw err;
		console.log('The raw response from Mongo was ', raw);
		data._id = id;
		resSendJsonProtected(res, {success: true, data: data, accessId : accessId});
	});

	// SessionModel.findByIdAndUpdate(id , data, { /* multi: true */ }, function (err, numberAffected, raw) {
	// 	  if (err) throw err;
	// 	  console.log('The number of updated documents was %d', numberAffected);
	// 	  console.log('The raw response from Mongo was ', raw);
	// 	  resSendJsonProtected(res, {success: true, data: data, accessId : accessId});
	// });
}

// curl -v -H "Content-Type: application/json" -X DELETE http://127.0.0.1:8888/sessions/one/551bdcda1763e3f0eb749bd4
exports.destroy = function(req, res){
	//TODO: should we destroy edges connected to this session? or is it done automatically? or error is risen?
	var type = req.params.type;
	var dataId = req.params.searchParam;
	console.log("[modules/Session.js:destroy] dataId:%s, type:%s, req.body: %s", dataId, type, JSON.stringify(req.body));

	switch (type){
		case 'one':
			SessionModel.findByIdAndRemove(dataId, function (err) {
					if (err) throw err;
					var data = {id:dataId};
					resSendJsonProtected(res, {success: true, data: data, accessId : accessId});
				}
			);
			break;
		// case 'in-map': //all sessions connected to session.id
		// 	console.log("[modules/session.js:destroy] deleting sessions in map %s", dataId);
		// 	SessionModel.remove({'mapId': dataId}, function (err) {
		// 		if (err){
		// 			console.log("[modules/session.js:destroy] error:" + err);
		// 			throw err;
		// 		}
		// 		var data = {id:dataId};
		// 		console.log("[modules/session.js:destroy] data:" + JSON.stringify(data));
		// 		resSendJsonProtected(res, {success: true, data: data, accessId : accessId});
		// 	});
		// 	break;
	}
};
