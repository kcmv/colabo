var mongoose = require('mongoose');

import { /* SessionDbVo, */ AuditedActionSchema } from './session-db-vo';
import { MODULE_NAME } from './params';

console.log("[%s] AuditedActionSchema: %s", MODULE_NAME, JSON.stringify(AuditedActionSchema));

/* SCHEMA */
export let CfAuditDbSchema = mongoose.Schema(AuditedActionSchema);

import { pluginAuditing } from '@colabo-knalledge/b-storage-mongo';
CfAuditDbSchema.plugin(pluginAuditing, {});

// CfAuditDbSchema.statics.findInMapAfterTime = function (map, time, cb) {
// 	//console.log('CfAuditDbSchema::findInMapAfterTime: %s, %s (%d)', map, time, time.getTime());
//     return this.find( {$and: [ { mapId: map}, {updatedAt: {$gt: time}}]}, cb);
// }

// setting DB schema <start>
declare let global: any;
if (!global.hasOwnProperty('db')) {
    global.db = {};
}
global.db.CfAuditDbSchema = CfAuditDbSchema;
let GlobalDB = global.db;
export { GlobalDB };
// setting DB schema <end>

exports.Schema = CfAuditDbSchema;