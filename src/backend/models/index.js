if (!global.hasOwnProperty('db')) {
    var mkNode = require('./mkNode');
    var mkEdge = require('./mkEdge');
    var mkMap = require('./mkMap');
    var mWhatAmI = require('./mWhatAmI');
    var mWhoAmI = require('./mWhoAmI');
    var mHowAmI = require('./mHowAmI');
    var sq = null;
    var fs = require('fs');

	global.db = {
		kNode: mkNode,
        kEdge: mkEdge,
        kMap: mkMap,
        whatAmI: mWhatAmI,
        whoAmI: mWhoAmI,
        howAmI: mHowAmI,
		LIMIT_NO: 100,
	};
	module.exports = global.db;
}