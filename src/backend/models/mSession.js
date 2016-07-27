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
var sessionSchema = mongoose.Schema({
	name: String,
	participants: {type: mongoose.Schema.Types.Mixed},
	mustFollowPresenter: { type: Boolean, default: false }, //control of participants option of (NOT) receiveNavigation (if **they CAN STOP FOLLOWing**)
	readOnly: { type: Boolean, default: false },
	phase: Number,
	mapId: {type: mongoose.Schema.Types.ObjectId, ref: 'KMap'}, //map at which the session is happening
	collaboSpace: {type: mongoose.Schema.Types.Mixed}, //representing state of all relevant puzzles in the Collabospace, e.g. Brainstorming, etc ...
	creator: {type: mongoose.Schema.Types.ObjectId, ref: 'WhoAmI'}
});


var pluginAuditing = require('./pluginAuditing');
sessionSchema.plugin(pluginAuditing, {});

exports.Schema = sessionSchema;
