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

/* SCHEMA */
var KNodeSchema = mongoose.Schema({
	name: String,
	iAmId: Number,
	activeVersion: { type: Number, default: 1 },
	ideaId: Number,
	version: { type: Number, default: 1 }, //{type: DataTypes.INTEGER, allowNull: false, primaryKey: true},
	isPublic: { type: Boolean, default: true },
	createdAt: { type: Date, default: Date.now }, //CHECK AUTOMATIC OPTIONS
	updatedAt: { type: Date, default: Date.now },
	dataContentSerialized: {type: String},
	visual: {
		isOpen: { type: Boolean, default: false },
		manualX: Number,
		manualY: Number
	}
});

var KNodeModel = mongoose.model('KNode', KNodeSchema);

// module.exports = KNodeModel; //then we can use it by: var User = require('./app/models/KNodeModel');

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
  		datas_json.push({id: 1, name: "Sun"});
  		datas_json.push({id: 2, name: "Earth"});
  		datas_json.push({id: 3, name: "Pluto"});
  		datas_json.push({id: 4, name: "Venera"});
		resSendJsonProtected(res, {data: datas_json, accessId : accessId});
	}

	KNodeModel.findById(req.params.searchParam, function (err, knode) {
		if (err){
			throw err;
			var msg = JSON.stringify(err);
			resSendJsonProtected(res, {data: knode, accessId : accessId, message: msg, success: false});
		}else{
			resSendJsonProtected(res, {data: knode, accessId : accessId, success: true});
		};
	});
}

exports.create = function(req, res){
	console.log("[modules/KNode.js:create] req.body: %s", JSON.stringify(req.body));
	
	var data = req.body;
	
	var knode = new KNodeModel(data);

	knode.save(function(err) {
		if (err) throw err;
		console.log("[modules/KNode.js:create] data (id:%d) created: %s", dataCreated.id, JSON.stringify(dataCreated));
		resSendJsonProtected(res, {success: true, data: data, accessId : accessId});
	});				
}

exports.update = function(req, res){
	console.log("[modules/KNode.js:update] req.body: %s", JSON.stringify(req.body));

	var data = req.body;
	
	var knode = new KNodeModel(knodeJSON);
	//TODO: check this: multi (boolean) whether multiple documents should be updated (false)
	KNodeModel.findByIdAndUpdate(knode._id , knode, { multi: true }, function (err, numberAffected, raw) {
		  if (err) throw err;
		  console.log('The number of updated documents was %d', numberAffected);
		  console.log('The raw response from Mongo was ', raw);
		  resSendJsonProtected(res, {success: true, data: data, accessId : accessId});	
	});			
}

exports.destroy = function(req, res){
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