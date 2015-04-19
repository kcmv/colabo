var mongoose = require('mongoose');

/* SCHEMA */
var kNodeSchema = mongoose.Schema({
	//think of _id:Number, instead of ObjectId
	name: String,
	type: String,
	mapId: {type: mongoose.Schema.Types.ObjectId, ref: 'kMap'},
	iAmId: Number,
	activeVersion: { type: Number, default: 1 },
	ideaId: Number,
	version: { type: Number, default: 1 }, //{type: DataTypes.INTEGER, allowNull: false, primaryKey: true},
	isPublic: { type: Boolean, default: true },
	dataContent: {type: mongoose.Schema.Types.Mixed},
	visual: {
		isOpen: { type: Boolean, default: false },
		xM: Number,
		yM: Number,
		widthM: 0,
		heightM: 0
	}
});

var pluginAuditing = require('./pluginAuditing');
kNodeSchema.plugin(pluginAuditing, {});

exports.Schema = kNodeSchema;