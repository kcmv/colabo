var mongoose = require('mongoose');

/* SCHEMA */
var kMapSchema = mongoose.Schema({
	name: String,
	rootNodeId: {type: mongoose.Schema.Types.ObjectId, ref: 'kNode'},
	type: String, //TODO: Check 'type' type
	iAmId: Number, //TODO: ref to WhoAmI
	ideaId: Number,
	activeVersion: { type: Number, default: 1 },
	version: { type: Number, default: 1 },
	parentMapId: String,
	isPublic: { type: Boolean, default: true },
	dataContent: {type: mongoose.Schema.Types.Mixed},
	visual: {
	}
});

var pluginAuditing = require('./pluginAuditing');
kMapSchema.plugin(pluginAuditing, {});

exports.Schema = kMapSchema;