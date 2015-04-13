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


var KNodeModel = mongoose.model('KNode', global.db.kNode.Schema);

// module.exports = KNodeModel; //then we can use it by: var User = require('./app/models/KNodeModel');

/* connecting */
mongoose.connect('mongodb://127.0.0.1/KnAllEdge');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));


exports.populateDemo = function(){
	var fileName = '../data/demo_data.json';
	console.log('[populateDemo] loading file %s', fileName);
	fs.readFile(fileName, 'utf8', function (err, dataStr) {
		if (err) {
			return console.log(err);
		}
		console.log('[populateDemo] parsing file');
		//console.log('[populateDemo] dataStr: %s', JSON.stringify(dataStr));
		var dataObj = tsv.parse(dataStr);
		//console.log('[populateDemo] dataObj: %s', JSON.stringify(dataObj));
		var i = 0;
		for (var datumId in dataObj){
			var datum = dataObj[datumId];
			process.stdout.write("\rDatum : " + i);
			//console.log('[populateDemo] datum: %s', JSON.stringify(datum));
			//var test2 = new SLaWS({form: 'руке', lemma: 'рука', ana: 'Nnpkdjf'});
			var datumMongo = new SLaWS(datum);
			datumMongo.save();
			i++;
		}
		console.log("\n[populateDemo] data inserted");
	});
}

// curl -v -H "Content-Type: application/json" -X GET http://127.0.0.1:8888/knodes/one/551bdcda1763e3f0eb749bd4
// curl -v -H "Content-Type: application/json" -X GET http://127.0.0.1:8888/knodes/in_map/552678e69ad190a642ad461c
exports.index = function(req, res){
	var found = function(err,kNodes){
		console.log("[modules/kNode.js:index] in 'found'");
		if (err){
			throw err;
			var msg = JSON.stringify(err);
			resSendJsonProtected(res, {data: kNodes, accessId : accessId, message: msg, success: false});
		}else{
			resSendJsonProtected(res, {data: kNodes, accessId : accessId, success: true});
		}
	}
	
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
	
	console.log("[modules/kNode.js:index] req.params.searchParam: %s. req.params.searchParam2: %s", req.params.searchParam, req.params.searchParam2);
	switch (req.params.type){
		case 'one': //by edge id:
			KNodeModel.findById(id, found);
			break;
		case 'in_map': //all edges in specific map
			KNodeModel.find({ 'mapId': id}, found);
			break;
	}
}

// curl -v -H "Content-Type: application/json" -X POST -d '{"name":"Hello World Pl", "iAmId":5, "visual": {"isOpen": true}}' http://127.0.0.1:8888/knodes
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

// curl -v -H "Content-Type: application/json" -X PUT -d '{"name": "Hello World Pt23", "iAmId": 5, "visual": {"isOpen": false}}' http://127.0.0.1:8888/knodes/one/55266618cce5af993fe8675f
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

// curl -v -H "Content-Type: application/json" -X DELETE http://127.0.0.1:8888/knodes/one/551bdcda1763e3f0eb749bd4
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