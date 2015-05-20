var mongoose = require('mongoose');

/* SCHEMA */
var kEdgeSchema = mongoose.Schema({
	name: String,
	type: String,
	mapId: {type: mongoose.Schema.Types.ObjectId, ref: 'KMap'},
	iAmId: {type: mongoose.Schema.Types.ObjectId, ref: 'WhoAmI'},
	type: String, //TODO: Check 'type' type
	sourceId: {type: mongoose.Schema.Types.ObjectId, ref: 'KNode'},
	targetId: {type: mongoose.Schema.Types.ObjectId, ref: 'KNode'},
	ideaId: Number,
	isPublic: { type: Boolean, default: true },
	dataContent: {type: mongoose.Schema.Types.Mixed},
	visual: {
	}
});

var pluginAuditing = require('./pluginAuditing');
kEdgeSchema.plugin(pluginAuditing, {});

kEdgeSchema.statics.findInMapAfterTime = function (map, time, cb) {
	console.log('kEdgeSchema::findInMapAfterTime: %s, %s', map, time);
    return this.find( {$and: [ { mapId: map}, {updatedAt: {$gt: time}}]}, cb);
}

exports.Schema = kEdgeSchema;