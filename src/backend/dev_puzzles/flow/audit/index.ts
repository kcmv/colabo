/*
 * Public API Surface of `@colabo-flow/b-audit`
 */

import { CfAuditDbSchema } from './lib/audit-db-schema';
export { CfAuditDbSchema };

export { ColaboFlowAuditApi } from './lib/audit-api';
export { ColaboFlowAuditDb } from './lib/audit-db';

export { AuditDbVo } from './lib/audit-db-vo';

// setting express route <start>
// it gets all HTTP verb methods (index, post, ...) available
import * as ColaboFlowAuditAPI_All from './lib/audit-api';

const API_ROUTE = 'colabo-flow/audit';

export function initialize(app) {
    console.log("[puzzle(colabo-flow/audit) - /index.js] Registering ColaboFlow Audit API to: %s", API_ROUTE);

    var colaboFlowAudit = app.resource(API_ROUTE, ColaboFlowAuditAPI_All, { id: 'type?/:actionType?/:searchParam?' });
}
// setting express route <end>
