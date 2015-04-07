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


var KNodeModel = mongoose.model('KNode', KNodeSchema);

// module.exports = KNodeModel; //then we can use it by: var User = require('./app/models/KNodeModel');

/* connecting */
mongoose.connect('mongodb://127.0.0.1/KnAllEdge');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));

//TODO - test this:
userSchema.pre('save', function(next) {
	 // var currentDate = new Date(); // get the current date
	  
	  // change the updated_at field to current date
	  this.updatedAt = new Date(); //currentDate;
	  
	  /* TODO: according to our 'deafult settings, this is no needed:
	  // if created_at doesn't exist, add to that field
	  if (!this.created_at)
	    this.created_at = currentDate;
	   */
	  next();
	});



// curl -v -H "Content-Type: application/json" -X GET http://127.0.0.1:8080/knodes/one/551bdcda1763e3f0eb749bd4
exports.index = function(req, res){
	var id = req.params.searchParam;
	if(mockup && mockup.db && mockup.db.data){
		var datas_json = [];
  		datas_json.push({id: 1, name: "Sun"});
  		datas_json.push({id: 2, name: "Earth"});
  		datas_json.push({id: 3, name: "Pluto"});
  		datas_json.push({id: 4, name: "Venera"});
		resSendJsonProtected(res, {data: datas_json, accessId : accessId});
	}
	//TODO: remove (testing)
	KNodeModel.find(function (err, knodes) {
		console.log(knodes);
		//resSendJsonProtected(res, {data: {, accessId : accessId, success: true});
	});
	
	
	KNodeModel.findById(id, function (err, knode) {
		if (err){
			throw err;
			var msg = JSON.stringify(err);
			resSendJsonProtected(res, {data: knode, accessId : accessId, message: msg, success: false});
		}else{
			resSendJsonProtected(res, {data: knode, accessId : accessId, success: true});
		};
	});
	
}

// curl -v -H "Content-Type: application/json" -X POST -d '{"name":"Hello World", "iAmId":5, "visual": {"isOpen": true}}' http://127.0.0.1:8080/knodes
exports.create = function(req, res){
	console.log("[modules/kNode.js:create] req.body: %s", JSON.stringify(req.body));
	
	var data = req.body;
	
	console.log(data);
	var knode = new KNodeModel(data);

	knode.save(function(err) {
		if (err) throw err;
		console.log("[modules/KNode.js:create] id:%d, knode data: %s", knode._id, JSON.stringify(knode));
		resSendJsonProtected(res, {success: true, data: data, accessId : accessId});
	});				
}

// curl -v -H "Content-Type: application/json" -X GET http://127.0.0.1:8080/knodes/one/551bdc841763e3f0eb749bd1
// curl -v -H "Content-Type: application/json" -X PUT -d '{"name": "Hello World 2", "iAmId": 5, "visual": {"isOpen": false}}' http://127.0.0.1:8080/knodes/one/551bdc841763e3f0eb749bd1
// curl -v -H "Content-Type: application/json" -X GET http://127.0.0.1:8080/knodes/one/551bdc841763e3f0eb749bd1
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

// curl -v -H "Content-Type: application/json" -X DELETE http://127.0.0.1:8080/knodes/one/551bdcda1763e3f0eb749bd4
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