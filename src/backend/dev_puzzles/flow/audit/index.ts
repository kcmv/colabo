/*
 * Public API Surface of `@colabo-flow/b-audit`
 */

import { CfAuditSchema } from './lib/audit-schema';
export { CfAuditSchema };

export { ColaboFlowAudit } from './lib/audit-api';

// setting express route <start>
// it gets all HTTP verb methods (index, post, ...) available
import * as ColaboFlowAuditAPI from './lib/audit-api';

const API_ROUTE = 'colabo-flow/audit';

export function initialize(app) {
    console.log("[puzzle(colabo-flow/audit) - /index.js] Registering ColaboFlow Audit API to: %s", API_ROUTE);

    var colaboFlowAudit = app.resource(API_ROUTE, ColaboFlowAuditAPI, { id: 'type?/:actionType?/:searchParam?' });
}
// setting express route <end>
