'use strict';

require('../models'); // injects DB Schemas in global.db


var mongoose = require('mongoose');
var Promise = require("bluebird");
// set it either in path: (node createDemoData.js 'demo_data.json') or default
// var fileName = process.argv[2] || '../../data/exportedDB.json';
// var mapId = process.argv[3] || '552678e69ad190a642ad461c';
// var rootNodeId = process.argv[4] || '55268521fb9a901e442172f9';

// var fs = require('fs');

/* connecting */
mongoose.connect('mongodb://127.0.0.1/KnAllEdge');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));

var KNodeModel = mongoose.model('KNode', global.db.kNode.Schema);
var KEdgeModel = mongoose.model('kEdge', global.db.kEdge.Schema);
var KMapModel = mongoose.model('kMap', global.db.kMap.Schema);

var mapData = null;
// console.log('fileName: ' + fileName);

db.on('open', function (callback) {
	updateDefaultWhoAmi();
});

function updateDefaultWhoAmi(){
	var updateDefaultWhoAmiCallback = function(nodes,edges, maps){
		console.log("updateDefaultWhoAmiCallback");
	}
	console.log("updateDefaultWhoAmi");
	var nodes = KNodeModel.update({ $or:[ {'iAmId':'0'}, {'iAmId':undefined}]}, { iAmId: "55268521fb9a901e442172f9"}).exec();
	var edges = KEdgeModel.update({ $or:[ {'iAmId':'0'}, {'iAmId':undefined}]}, { iAmId: "55268521fb9a901e442172f9"}).exec();
	var maps = KMapModel.update({ $or:[ {'iAmId':'0'}, {'iAmId':undefined}]}, { iAmId: "55268521fb9a901e442172f9"}).exec();
	
	Promise.join(nodes,edges, maps, updateDefaultWhoAmiCallback);
}