if (!global.hasOwnProperty('db')) {
    var mkNode = require('./mkNode');
    var mkEdge = require('./mkEdge');
    var mkMap = require('./mkMap');
    var sq = null;
    var fs = require('fs');

	global.db = {
		kNode: mkNode,
        kEdge: mkEdge,
        kMap: mkMap,
		LIMIT_NO: 100,
	};
	module.exports = global.db;
}