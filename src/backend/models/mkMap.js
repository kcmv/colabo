var mongoose = require('mongoose');

/* SCHEMA */
var kMapSchema = mongoose.Schema({
	name: String,
	rootNodeId: {type: mongoose.Schema.Types.ObjectId, ref: 'KNode'},
	type: String, //TODO: Check 'type' type
	iAmId: {type: mongoose.Schema.Types.ObjectId, ref: 'WhoAmI'},
	ideaId: Number,
	activeVersion: { type: Number, default: 1 },
	version: { type: Number, default: 1 },
	parentMapId: String,
	participants: [{type: mongoose.Schema.Types.ObjectId, ref: 'WhoAmI'}],
	isPublic: { type: Boolean, default: true },
	dataContent: {type: mongoose.Schema.Types.Mixed}, //dataContent.mcm.authors
	visual: {
	}
});

var pluginAuditing = require('./pluginAuditing');
kMapSchema.plugin(pluginAuditing, {});

exports.Schema = kMapSchema;
