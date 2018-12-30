var mongoose = require('mongoose');

/* SCHEMA */
export var kEdgeSchema = mongoose.Schema({
	name: String,
	type: String, //TODO: Check 'type' type
	mapId: {type: mongoose.Schema.Types.ObjectId, ref: 'KMap'},
	iAmId: {type: mongoose.Schema.Types.ObjectId, ref: 'WhoAmI'},
	sourceId: {type: mongoose.Schema.Types.ObjectId, ref: 'KNode'},
	targetId: {type: mongoose.Schema.Types.ObjectId, ref: 'KNode'},
	ideaId: Number,
	isPublic: { type: Boolean, default: true },
	dataContent: {type: mongoose.Schema.Types.Mixed},
	value: {type: Number, default: 0},
	visual: {
	}
});

import { pluginAuditing } from './pluginAuditing';

kEdgeSchema.plugin(pluginAuditing, {});

kEdgeSchema.statics.findInMapAfterTime = function (map, time, cb) {
	console.log('kEdgeSchema::findInMapAfterTime: %s, %s', map, time);
    return this.find( {$and: [ { mapId: map}, {updatedAt: {$gt: time}}]}, cb);
}