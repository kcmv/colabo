var mongoose = require('mongoose');

/* SCHEMA */
export var kMapSchema = mongoose.Schema({
	name: String,
	type: String, //TODO: Check 'type' type
	rootNodeId: {type: mongoose.Schema.Types.ObjectId, ref: 'KNode'},
	iAmId: {type: mongoose.Schema.Types.ObjectId, ref: 'WhoAmI'},
	ideaId: Number,
	activeVersion: { type: Number, default: 1 },
	version: { type: Number, default: 1 },
	parentMapId: String,
	participants: [{type: mongoose.Schema.Types.ObjectId, ref: 'WhoAmI'}],
	isPublic: { type: Boolean, default: false },
	dataContent: {type: mongoose.Schema.Types.Mixed}, //dataContent.mcm.authors
	visual: {
	}
});

import { pluginAuditing } from './pluginAuditing';

kMapSchema.plugin(pluginAuditing, {});
