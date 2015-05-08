var mongoose = require('mongoose');

/* SCHEMA */
var howAmISchema = mongoose.Schema({
	whoAmI: {type: mongoose.Schema.Types.ObjectId, ref: 'whoAmI'},
	whatAmI: {type: mongoose.Schema.Types.ObjectId, ref: 'whatAmI'},
	how: String, //TODO: language?!
	negation: { type: Boolean, default: false },
	level: { type: Number, default: 3 }, // 0 - 5
	importance: { type: Number, default: 3 }, // 0 - 5
});

var pluginAuditing = require('./pluginAuditing');
howAmISchema.plugin(pluginAuditing, {});

exports.Schema = howAmISchema;