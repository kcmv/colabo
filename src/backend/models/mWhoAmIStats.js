var mongoose = require('mongoose');

/* ACCESSES_ARRAY_SCHEMA */
var accessesArraySchema = mongoose.Schema({
    from: { type: Date },
    till: { type: Date, default: null }
}, {
    _id: false //otherwise Mongoose adds _id to each subschema: http://stackoverflow.com/questions/17254008/stop-mongoose-from-creating-id-property-for-sub-document-array-items
});

/* SCHEMA */
var whoAmIStatsSchema = mongoose.Schema({
    whoAmI: { type: mongoose.Schema.Types.ObjectId, ref: 'WhoAmI' },
    accesses: [accessesArraySchema]
});

// var pluginAuditing = require('@colabo-knalledge/b-storage-mongo/models/pluginAuditing');
// whoAmIStatsSchema.plugin(pluginAuditing, {});

exports.Schema = whoAmIStatsSchema;