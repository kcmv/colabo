console.log("[puzzle(knalledge/storage-mongo) - /models/index.js] Building up 'global.db'");

var mkNode = require('./mkNode');
var mkEdge = require('./mkEdge');
var mkMap = require('./mkMap');

if (!global.hasOwnProperty('db')) {
    global.db = {};
}

global.db.kNode = mkNode;
global.db.kEdge = mkEdge;
global.db.kMap = mkMap;

module.exports = global.db;

console.log("[puzzle(knalledge/storage-mongo) - /models/index.js] Built up 'global.db'");
console.log("[puzzle(knalledge/storage-mongo) - /models/index.js] global.db.kEdge.Schema: " + global.db.kEdge.Schema);