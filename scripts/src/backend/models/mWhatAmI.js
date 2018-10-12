var mongoose = require('mongoose');

/* SCHEMA */
var whatAmISchema = mongoose.Schema({
    name: String, //TODO: multilingual support?!
    parent: { type: mongoose.Schema.Types.ObjectId, ref: 'WhatAmI', default: null }
});

var pluginAuditing = require('@colabo-knalledge/b-storage-mongo/models/pluginAuditing');
whatAmISchema.plugin(pluginAuditing, {});


whatAmISchema.statics.findByName = function(name, cb) {
    console.log('whatAmISchema::findByName:' + name);
    return this.find({ name: name }, cb);
}

// search for whats which name contains namePart
// http://mongoosejs.com/docs/2.7.x/docs/query.html
// http://stackoverflow.com/questions/9824010/mongoose-js-find-user-by-username-like-value
whatAmISchema.statics.findByNameContaining = function(namePart, cb) {
    var regex = new RegExp(namePart, "i")
    console.log('whatAmISchema::findByNameContaining:' + namePart);
    return this.find({ name: regex }, cb);
}

whatAmISchema.statics.findOneByName = function(name, cb) {
    console.log('whatAmISchema::findByName:' + name);
    return this.findOne({ name: name }, cb);
}

exports.Schema = whatAmISchema;