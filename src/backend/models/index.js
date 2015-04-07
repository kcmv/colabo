if (!global.hasOwnProperty('db')) {
    var mkNode = require('./mkNode');
    var mkEdge = require('./mkEdge');
    var sq = null;
    var fs = require('fs');

	global.db = {
		kNode: mkNode,
        kEdge: mkEdge,
		LIMIT_NO: 100,
	};
	module.exports = global.db;
}