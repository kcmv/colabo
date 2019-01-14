/*
 * Public API Surface of `@colabo-flow/b-session`
 */

 /*
 * Public API Surface of `@colabo-flow/b-session`
 */

import { CfSessionDbSchema } from './lib/session-db-schema';
export { CfSessionDbSchema };

export { ColaboFlowSessionApi } from './lib/session-api';
export { ColaboFlowSessionDb, MainTypes, ActionTypes, SearchParams } from './lib/session-db';

export { SessionDbVo } from './lib/session-db-vo';

// setting express route <start>
// it gets all HTTP verb methods (index, post, ...) available
import * as ColaboFlowSessionAPI_All from './lib/session-api';

const API_ROUTE = 'colabo-flow/session';

export function initialize(app) {
    console.log("[puzzle(colabo-flow/session) - /index.js] Registering ColaboFlow Session API to: %s", API_ROUTE);

    var colaboFlowSession = app.resource(API_ROUTE, ColaboFlowSessionAPI_All, { id: 'type?/:actionType?/:searchParam?/:searchParam2?' });
}
// setting express route <end>
