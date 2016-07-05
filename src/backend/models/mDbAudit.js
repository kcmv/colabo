var mongoose = require('mongoose');

// export const enum ChangeVisibility {
// 	ALL,
// 	MAP_PARTICIPANTS,
// 	MAP_MEDIATORS,
// 	MAP_SAME_GROUP_MEMBERS,
// 	USER
// }
//
// export const enum ChangeType {
// 	UNDEFINED,
// 	STRUCTURAL,
// 	NAVIGATIONAL,
// 	VIEW
// }
//
// export const enum ChangePhase {
// 	UNDISPLAYED,
// 	DISPLAYED,
// 	SEEN
// }
//
// export const enum Domain {
// 	UNDEFINED,
// 	EDGE,
// 	MAP,
// 	NODE,
// 	HOW_AM_I,
// 	WHAT_AM_I,
// 	WHO_AM_I
// }

/* SCHEMA */
var dbAuditSchema = mongoose.Schema({
	value: {type: mongoose.Schema.Types.Mixed},
	valueBeforeChange: {type: mongoose.Schema.Types.Mixed},
	reference: {type: mongoose.Schema.Types.ObjectId}, //reference to the object over which the change is done//
	type: Number, //coressponding to enum `Type`
	action: {type: mongoose.Schema.Types.Mixed}, //may be String or enum number
	domain: Number, //object type the change is done on, corresponding to enum Domain
	mapId: {type: mongoose.Schema.Types.ObjectId, ref: 'KMap'}, // id of map this object belongs to
	iAmId: {type: mongoose.Schema.Types.ObjectId, ref: 'WhoAmI'}, // it is iAmId or an reference ...//
	//(depending in which layer we are) to the object creator (whoAmi/RIMA user)
	visibility: Number, //coressponding to enum `Visibility`
	// dataContent: Object,
	// decorations: Object,
	// phase: Number, //coressponding to enum `ChangePhase`
});


var pluginAuditing = require('./pluginAuditing');
dbAuditSchema.plugin(pluginAuditing, {});

exports.Schema = dbAuditSchema;
