var mongoose = require('mongoose');

import { AuditDbVo, AuditDbSchema } from './audit-db-vo';
import { MODULE_NAME } from './params';

console.log("[%s] AuditDbSchema: %s", MODULE_NAME, JSON.stringify(AuditDbSchema));

/* SCHEMA */
export let CfAuditSchema = mongoose.Schema(AuditDbSchema);

let pluginAuditing = require('@colabo-knalledge/b-storage-mongo/lib/models/pluginAuditing');
CfAuditSchema.plugin(pluginAuditing, {});

// CfAuditSchema.statics.findInMapAfterTime = function (map, time, cb) {
// 	//console.log('CfAuditSchema::findInMapAfterTime: %s, %s (%d)', map, time, time.getTime());
//     return this.find( {$and: [ { mapId: map}, {updatedAt: {$gt: time}}]}, cb);
// }

// setting DB schema <start>
declare let global: any;
if (!global.hasOwnProperty('db')) {
    global.db = {};
}
global.db.CfAuditSchema = CfAuditSchema;
let GlobalDB = global.db;
export { GlobalDB };
// setting DB schema <end>

exports.Schema = CfAuditSchema;