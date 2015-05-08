var mongoose = require('mongoose');

/* SCHEMA */
var whatAmISchema = mongoose.Schema({
	name: String, //TODO: multilingual support?!
	parent: {type: mongoose.Schema.Types.ObjectId, ref: 'WhatAmI', default: null}, //ToDO: ??
});

var pluginAuditing = require('./pluginAuditing');
whatAmISchema.plugin(pluginAuditing, {});


whatAmISchema.statics.findByName = function (name, cb) {
	console.log('whatAmISchema::findByName:'+ name);
    return this.find({ name: name}, cb);
}

whatAmISchema.statics.findOneByName = function (name, cb) {
	console.log('whatAmISchema::findByName:'+ name);
    return this.findOne({ name: name}, cb);
}

exports.Schema = whatAmISchema;