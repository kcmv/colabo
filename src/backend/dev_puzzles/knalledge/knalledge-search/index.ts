declare var require: any;
declare var module: any;

import * as SearchNodesAPI from './modules/search-nodes';

export function initialize(app) {
    console.log("[puzzle(knalledge/search) - /models/index.js] Registering KnAllEdge search API to: ", app);

    var searchNodes = app.resource('search-nodes', SearchNodesAPI, { id: 'type?/:actionType?/:searchParam?/:searchParam2?' });
}