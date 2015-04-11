var mongoose = require('mongoose');

/* SCHEMA */
var kNodeSchema = mongoose.Schema({
	//think of _id:Number, instead of ObjectId
	name: String,
	mapId: {type: mongoose.Schema.Types.ObjectId, ref: 'kMap'},
	iAmId: Number,
	activeVersion: { type: Number, default: 1 },
	ideaId: Number,
	version: { type: Number, default: 1 }, //{type: DataTypes.INTEGER, allowNull: false, primaryKey: true},
	isPublic: { type: Boolean, default: true },
	dataContentSerialized: {type: String},
	visual: {
		isOpen: { type: Boolean, default: false },
		manualX: Number,
		manualY: Number
	}
});

var pluginAuditing = require('./pluginAuditing');
kNodeSchema.plugin(pluginAuditing, {});

exports.Schema = kNodeSchema;