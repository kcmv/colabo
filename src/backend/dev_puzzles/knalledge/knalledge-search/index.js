"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var SearchNodesAPI = require("./modules/search-nodes");
function initialize(app) {
    console.log("[puzzle(knalledge/search) - /models/index.js] Registering KnAllEdge search API to: ", app);
    var searchNodes = app.resource('search-nodes', SearchNodesAPI, { id: 'type?/:actionType?/:searchParam?/:searchParam2?' });
}
exports.initialize = initialize;
//# sourceMappingURL=index.js.map