var mongoose = require('mongoose');

/* SCHEMA */
var whoAmISchema = mongoose.Schema({
	firstname: String,
	familyname: String,
	e_mail: String,
	passw: String,
	displayName: String,
	gender: Number,
	birthday: Date,
	coordX: Number,
	coordY: Number,
	locationType: Number,
	mySearchAreaVisible: Number,
	myLocationVisible: Number,
	accessedAt: Date,
	locationUpdatedAt: Date,
	language: String,
	origin: String
});

var pluginAuditing = require('./pluginAuditing');
whoAmISchema.plugin(pluginAuditing, {});

exports.Schema = whoAmISchema;