if (!global.hasOwnProperty('db')) {
	var mDbAudit = require('./mDbAudit');
	var mSession = require('./mSession');
	var mkNode = require('./mkNode');
	var mkEdge = require('./mkEdge');
	var mkMap = require('./mkMap');
	var mWhatAmI = require('./mWhatAmI');
	var mWhoAmI = require('./mWhoAmI');
	var mWhoAmIStats = require('./mWhoAmIStats');
	var mHowAmI = require('./mHowAmI');
	var sq = null;
	var fs = require('fs');

	global.db = {
		dbAudit: mDbAudit,
		session: mSession,
		kNode: mkNode,
		kEdge: mkEdge,
		kMap: mkMap,
		whatAmI: mWhatAmI,
		whoAmI: mWhoAmI,
		whoAmIStats: mWhoAmIStats,
		howAmI: mHowAmI,
		LIMIT_NO: 100,
	};
	module.exports = global.db;
}
