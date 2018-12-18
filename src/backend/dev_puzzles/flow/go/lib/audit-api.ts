const MODULE_NAME: string = "@colabo-flow/b-go";

import { GoedAction, GoedActionClass } from '@colabo-flow/i-go';

import { GetPuzzle } from '@colabo-utils/i-config';
let puzzleConfig: any = GetPuzzle(MODULE_NAME);

import { ColaboFlowGoDb, MainTypes, ActionTypes, SearchParams } from './go-db';

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


export class ColaboFlowGoApi {
    protected colaboFlowGoDb:ColaboFlowGoDb;

    constructor(protected req: any, protected res: any) {
        this.colaboFlowGoDb = new ColaboFlowGoDb();
    }
    
    index(callback: Function = null) {
        console.log('[ColaboFlowGoApi::index] this.req.params', this.req.params);
        let type = this.req.params.type;
        let actionType = this.req.params.actionType;
        let id = this.req.params.searchParam;
        console.log('[ColaboFlowGoApi::index] type', type);
        console.log('[ColaboFlowGoApi::index] actionType', actionType);
        console.log('[ColaboFlowGoApi::index] req.params.searchParam', this.req.params.searchParam);
        
        let searchParams: SearchParams = {
            type: type,
            actionType: actionType,
            id: id
        };

        // if (actionType === ActionTypes.FilterByName){
        //     searchParams.actionType = ActionTypes.FilterByName;
            
        // }
        
        
        switch(type){
            case MainTypes.GetGos:
                this.colaboFlowGoDb.index(searchParams, function (err, result) {
                    if (result) {
                        if (callback) callback(null, result);
                        if (this.res) resSendJsonProtected(this.res, { data: result, accessId: accessId++, success: true });
                    } else {
                        if (callback) callback(err, null);
                        if (this.res) resSendJsonProtected(this.res, { data: null, accessId: accessId++, success: false, msg: err });
                    }
                }.bind(this));            
            break;
            case MainTypes.GetStats:
                // let msg: string = "'get-stats' are not implemented yet";
                // if (this.res) resSendJsonProtected(this.res, { data: null, accessId: accessId++, success: false, msg: msg });

                this.colaboFlowGoDb.index(searchParams, function (err, result) {
                    if (result) {
                        if (callback) callback(null, result);
                        if (this.res) resSendJsonProtected(this.res, { data: result, accessId: accessId++, success: true });
                    } else {
                        if (callback) callback(err, null);
                        if (this.res) resSendJsonProtected(this.res, { data: null, accessId: accessId++, success: false, msg: err });
                    }
                }.bind(this));
            break;
            default:
                let msg: string = "unknown request type: '" + type + "'";
                if (this.res) resSendJsonProtected(this.res, { data: null, accessId: accessId++, success: false, msg: msg });
        }
    }

    create(callback: Function = null) {
        let body: string = this.req.body;
        console.log("[ColaboFlowGo.post] body: %s", JSON.stringify(body));
        let cfGo: GoedActionClass = new GoedActionClass();
        cfGo.name = "parseRequest";
        cfGo.flowId = "searchSoundsNoCache";
        
        // save(cfGo);

        let result:any = {
            // db: go,
            body: body
        }
        if (callback) callback(null, result);
        if (this.res) resSendJsonProtected(this.res, { data: result, accessId: accessId++, success: true });
    }
} // CLASS END

// curl -v -H "Content-Type: application/json" -X GET http://127.0.0.1:8001/colabo-flow/go/type-right/action-single/test1.json

export function index(req: any, res: any) {
    let colaboFlowGo: ColaboFlowGoApi = new ColaboFlowGoApi(req, res);
    colaboFlowGo.index();
}

/*
curl -i -X POST \
-H "Content-Type: application/json" \
--data '{"name":"Donald","surname":"Duck"}' \
http://localhost:8001/colabo-flow/go
*/

// https://stackoverflow.com/questions/15651510/can-typescript-export-a-function
// https://www.sitepoint.com/understanding-module-exports-exports-node-js/

export function create(req: any, res: any) {
    let colaboFlowGo: ColaboFlowGoApi = new ColaboFlowGoApi(req, res);
    colaboFlowGo.create();
}