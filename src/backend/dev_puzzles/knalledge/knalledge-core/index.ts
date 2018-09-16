export function KnAllEdgeCoreRegister(app) {
    console.log("[puzzle(knalledge/core) - /models/index.js] Registering KnAllEdge core API to: ", app);

    let knodes = app.resource('knodes', require('./modules/kNode'), { id: 'type?/:actionType?/:searchParam?/:searchParam2?' });
    let kedges = app.resource('kedges', require('./modules/kEdge'), { id: 'type?/:searchParam?/:searchParam2?' });
    let kmaps = app.resource('kmaps', require('./modules/kMap'), { id: 'type?/:searchParam?/:searchParam2?' });
}

import {VO} from './lib/VO';
import {KNode} from './lib/kNode';
import {KEdge} from './lib/kEdge';
export {VO, KNode, KEdge}