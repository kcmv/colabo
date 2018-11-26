/*
 * Public API Surface of `@colabo-flow/b-audit`
 */

// import { ColaboFlowAudit } from './lib/audit';
// it gets all HTTP verb methods (index, post, ...) available
import * as ColaboFlowAuditAPI from './lib/audit';

const API_ROUTE = 'colabo-flow/audit';

export function initialize(app) {
    console.log("[puzzle(colabo-flow/audit) - /index.js] Registering ColaboFlow Audit API to: %s", API_ROUTE);

    var colaboFlowAudit = app.resource(API_ROUTE, ColaboFlowAuditAPI, { id: 'type?/:actionType?/:searchParam?' });
}