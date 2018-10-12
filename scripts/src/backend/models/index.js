console.log("[src/backend/models/index.js] Building up 'global.db'");

var mDbAudit = require('./mDbAudit');
var mSession = require('./mSession');
var mWhatAmI = require('./mWhatAmI');
var mWhoAmI = require('./mWhoAmI');
var mWhoAmIStats = require('./mWhoAmIStats');
var mHowAmI = require('./mHowAmI');

if (!global.hasOwnProperty('db')) {
    global.db = {};
}

global.db.dbAudit = mDbAudit;
global.db.session = mSession;
global.db.whatAmI = mWhatAmI;
global.db.whoAmI = mWhoAmI;
global.db.whoAmIStats = mWhoAmIStats;
global.db.howAmI = mHowAmI;
global.db.LIMIT_NO = 100;

module.exports = global.db;

console.log("[src/backend/models/index.js] Built up 'global.db'");

console.log("global.db.kEdge.Schema: " + global.db.kEdge.Schema);