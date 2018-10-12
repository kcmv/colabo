import {DBConnect} from './lib/dbService';
export {DBConnect};
declare let global:any;

console.log("[puzzle(knalledge/storage-mongo) - index.ts] Building up 'global.db'");

let mkNode = require('./lib/models/mkNode');
let mkEdge = require('./lib/models/mkEdge');
let mkMap = require('./lib/models/mkMap');

if (!global.hasOwnProperty('db')) {
    global.db = {};
}

global.db.kNode = mkNode;
global.db.kEdge = mkEdge;
global.db.kMap = mkMap;

let GlobalDB = global.db;
export {GlobalDB};

console.log("[puzzle(knalledge/storage-mongo) - index.ts] Built up 'global.db'");
console.log("[puzzle(knalledge/storage-mongo) - index.ts] global.db.kEdge.Schema: " + global.db.kEdge.Schema);