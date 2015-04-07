var mongoose = require('mongoose');

/* SCHEMA */
var KNodeSchema = mongoose.Schema({
	name: String,
	iAmId: Number,
	activeVersion: { type: Number, default: 1 },
	ideaId: Number,
	version: { type: Number, default: 1 }, //{type: DataTypes.INTEGER, allowNull: false, primaryKey: true},
	isPublic: { type: Boolean, default: true },
	createdAt: { type: Date, default: Date.now },
	updatedAt: { type: Date, default: Date.now }, //TODO: ADD UPDATE ON SAVE
	dataContentSerialized: {type: String},
	visual: {
		isOpen: { type: Boolean, default: false },
		manualX: Number,
		manualY: Number
	}
});

exports.Schema = KNodeSchema;