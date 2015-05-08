var mongoose = require('mongoose');

/* SCHEMA */
var whatAmISchema = mongoose.Schema({
	name: String, //TODO: multilingual support?!
	parent: {type: mongoose.Schema.Types.ObjectId, ref: 'whatAmI', default: null}, //ToDO: ??
});

var pluginAuditing = require('./pluginAuditing');
whatAmISchema.plugin(pluginAuditing, {});

exports.Schema = whatAmISchema;