// @colabo-knalledge/b-storage-mongo

import {DBConnect} from './lib/dbService';
export {DBConnect};
declare let global:any;

console.log("[puzzle(knalledge/storage-mongo) - index.ts] Building up 'global.db'");

import { kNodeSchema } from './lib/models/mkNode';
import { kEdgeSchema } from './lib/models/mkEdge';
import { kMapSchema } from './lib/models/mkMap';
import { pluginAuditing } from './lib/models/pluginAuditing';

console.log("index:pluginAuditing: ", pluginAuditing);
export { kNodeSchema, kEdgeSchema, kMapSchema, pluginAuditing };

if (!global.hasOwnProperty('db')) {
    global.db = {};
}

global.db.kNode = {Schema: kNodeSchema};
global.db.kEdge = {Schema: kEdgeSchema};
global.db.kMap = {Schema: kMapSchema};

let GlobalDB = global.db;
export {GlobalDB};

console.log("[puzzle(knalledge/storage-mongo) - index.ts] Built up 'global.db'");
console.log("[puzzle(knalledge/storage-mongo) - index.ts] global.db.kEdge.Schema: " + global.db.kEdge.Schema);