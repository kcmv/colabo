var mongoose = require('mongoose');

/* SCHEMA */
var kMapSchema = mongoose.Schema({
	name: String,
	type: String,
	iAmId: Number, //TODO: ref to WhoAmI
	type: String, //TODO: Check 'type' type
	ideaId: Number,
	isPublic: { type: Boolean, default: true },
	dataContent: Mixed,
	visual: {
	}
});

var pluginAuditing = require('./pluginAuditing');
kMapSchema.plugin(pluginAuditing, {});

exports.Schema = kMapSchema;