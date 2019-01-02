var mongoose = require('mongoose');

import { GoDbVo, GoedActionSchema } from './go-db-vo';
import { MODULE_NAME } from './params';

console.log("[%s] GoedActionSchema: %s", MODULE_NAME, JSON.stringify(GoedActionSchema));

/* SCHEMA */
export let CfGoDbSchema = mongoose.Schema(GoedActionSchema);

import { pluginAuditing }  from '@colabo-knalledge/b-storage-mongo';
CfGoDbSchema.plugin(pluginAuditing, {});

// CfGoDbSchema.statics.findInMapAfterTime = function (map, time, cb) {
// 	//console.log('CfGoDbSchema::findInMapAfterTime: %s, %s (%d)', map, time, time.getTime());
//     return this.find( {$and: [ { mapId: map}, {updatedAt: {$gt: time}}]}, cb);
// }

// setting DB schema <start>
declare let global: any;
if (!global.hasOwnProperty('db')) {
    global.db = {};
}
global.db.CfGoDbSchema = CfGoDbSchema;
let GlobalDB = global.db;
export { GlobalDB };
// setting DB schema <end>

exports.Schema = CfGoDbSchema;