export function KnAllEdgeCoreRegister(app) {
    console.log("[puzzle(knalledge/core) - /models/index.js] Registering KnAllEdge core API to: ", app);

    var knodes = app.resource('knodes', require('./lib/modules/kNode'), { id: 'type?/:actionType?/:searchParam?/:searchParam2?' });
    var kedges = app.resource('kedges', require('./lib/modules/kEdge'), { id: 'type?/:searchParam?/:searchParam2?' });
    var kmaps = app.resource('kmaps', require('./lib/modules/kMap'), { id: 'type?/:searchParam?/:searchParam2?' });
}

import {VO} from './lib/VO';
import {KNode} from './lib/kNode';
import {KEdge} from './lib/kEdge';
export {VO, KNode, KEdge}