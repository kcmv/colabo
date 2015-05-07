var mongoose = require('mongoose');

/* SCHEMA */
var kEdgeSchema = mongoose.Schema({
	name: String,
	type: String,
	mapId: {type: mongoose.Schema.Types.ObjectId, ref: 'kMap'},
	iAmId: {type: mongoose.Schema.Types.ObjectId, ref: 'whoAmI'},
	type: String, //TODO: Check 'type' type
	sourceId: {type: mongoose.Schema.Types.ObjectId, ref: 'kNode'},
	targetId: {type: mongoose.Schema.Types.ObjectId, ref: 'kNode'},
	ideaId: Number,
	isPublic: { type: Boolean, default: true },
	dataContent: {type: mongoose.Schema.Types.Mixed},
	visual: {
	}
});

var pluginAuditing = require('./pluginAuditing');
kEdgeSchema.plugin(pluginAuditing, {});

exports.Schema = kEdgeSchema;