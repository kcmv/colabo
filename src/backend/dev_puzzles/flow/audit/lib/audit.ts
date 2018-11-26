const MODULE_NAME: string = "@colabo-flow/b-audit";

import { GetPuzzle } from '@colabo-utils/i-config';
let puzzleConfig: any = GetPuzzle(MODULE_NAME);

var accessId = 0;

function resSendJsonProtected(res, data) {
    // http://tobyho.com/2011/01/28/checking-types-in-javascript/
    if (data !== null && typeof data === 'object') { // http://stackoverflow.com/questions/8511281/check-if-a-variable-is-an-object-in-javascript
        res.set('Content-Type', 'application/json');
        // JSON Vulnerability Protection
        // http://haacked.com/archive/2008/11/20/anatomy-of-a-subtle-json-vulnerability.aspx/
        // https://docs.angularjs.org/api/ng/service/$http#description_security-considerations_cross-site-request-forgery-protection
        res.send(")]}',\n" + JSON.stringify(data));
    } else if (typeof data === 'string') { // http://stackoverflow.com/questions/4059147/check-if-a-variable-is-a-string
        res.send(data);
    } else {
        res.send(data);
    }
};


export class ColaboFlowAudit {

    constructor(protected req: any, protected res: any) {

    }
    
    index(callback: Function = null) {
        let result = "Hello from audit";

        if (result) {
            if (callback) callback(null, result);
            resSendJsonProtected(this.res, { data: result, accessId: accessId, success: true });
        } else {
            let msg = "Missing result";
            let err = {
                content: msg
            };
            if (callback) callback(err, null);
            resSendJsonProtected(this.res, { data: null, accessId: accessId, success: false, msg: msg });
        }
    }

    create(callback: Function = null) {
        let body: string = this.req.body;
        console.log("[ColaboFlowAudit.post] body: %s", JSON.stringify(body));
        if (callback) callback(null, body);
        resSendJsonProtected(this.res, { data: body, accessId: accessId, success: true });
    }
} // CLASS END

// curl -v -H "Content-Type: application/json" -X GET http://127.0.0.1:8001/colabo-flow/audit/type-right/action-single/test1.json

export function index(req: any, res: any) {
    let colaboFlowAudit: ColaboFlowAudit = new ColaboFlowAudit(req, res);
    colaboFlowAudit.index();
}

/*
curl -i -X POST \
-H "Content-Type: application/json" \
--data '{"name":"Donald","surname":"Duck"}' \
http://localhost:8001/colabo-flow/audit
*/

// https://stackoverflow.com/questions/15651510/can-typescript-export-a-function
// https://www.sitepoint.com/understanding-module-exports-exports-node-js/

export function create(req: any, res: any) {
    let colaboFlowAudit: ColaboFlowAudit = new ColaboFlowAudit(req, res);
    colaboFlowAudit.create();
}