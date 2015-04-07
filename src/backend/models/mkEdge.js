var mongoose = require('mongoose');

/* SCHEMA */
var kEdgeSchema = mongoose.Schema({
	name: String,
	iAmId: Number,
	type: String, //TODO: Check 'type' type
	sourceId: {type: mongoose.Schema.Types.ObjectId, ref: 'kNode'},
	targetId: {type: mongoose.Schema.Types.ObjectId, ref: 'kNode'},
	ideaId: Number,
	isPublic: { type: Boolean, default: true },
	createdAt: { type: Date, default: Date.now }, 
	updatedAt: { type: Date, default: Date.now }, //TODO: ADD UPDATE ON SAVE
	dataContentSerialized: {type: String},
	visual: {
	}
});

exports.Schema = kEdgeSchema;