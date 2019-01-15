# Structure description

We will use `@colabo-flow/b-audit` puzzle as an example.

+ `params.ts` - contains global parameters of the puzzle used in other files (like the puzzle name, etc)
+ `audit-db-vo.ts` - contains VO (Value Objects) used in the database part of the backend puzzle. Note that isomoprhic VOs are stored in the isomporhipc puzzle (`@colabo-flow/i-audit`)
+ `audit-db-schema.ts` - creates DB (Mongo) Schema for the puzzle, adds all DB plugins, like `pluginAuditing` from `@colabo-knalledge/b-storage-mongo` and provides it to the global space
+ `audit-db.ts` - provides DB access functionality. It is agnostic in a sense that it can be used from the RESTfull API (Express.js) or from a service (through gRPC @ ColaboFlow, or RabbitMQ service, etc)
+ `audit-api.ts` - provides RESTfull (through Express.js framework) interface to the puzzle's business logic

**NOTE 1**: isomoprhic VOs are stored in the isomporhipc puzzle (`@colabo-flow/i-audit` in `colabo/src/isomorphic/dev_puzzles/flow/audit`)

**NOTE 2**: `@colabo-flow/s-audit` puzzle contains ***description*** of the gRPC interface (without implementation)

**NOTE 3**: Service `@colabo-flow/service-audit` (and more specifically `colabo/src/services/services/colaboflow-audit/index.ts`) contains ***implementation*** of the gRPC interface (as an additional interface to the business logic of the `@colabo-flow/b-audit` puzzle)

# Procedure

## 1. Create a backend puzzle

See in the [Example](colabo/src/tools/EXAMPLES.md) an example for the `@colabo-flow/b-audit` puzzle creation, by `colabo` CLI tools.

## 2. Integrate in the backend

Integrate it as an offering and dependency in the `colabo/src/backend/colabo.config.js`
    + then `yarn` it (in `colabo/src/backend`)

## 3. Integrate in the backend app

Integrate it as a dependency in the `colabo/src/backend/apps/colabo-space/colabo.config.js`
    + then `yarn` it (in `colabo/src/backend/apps/colabo-space/`)

## 4. Extend app

In `colabo/src/backend/apps/colabo-space/index.ts`

add new puzzle

```ts
import * as ColaboFlowAudit from '@colabo-flow/b-audit';
ColaboFlowAudit.initialize(expressApp);
``` 

## 5. Make puzzle's index.ts

In `colabo/src/backend/dev_puzzles/flow/audit/index.ts`:

```ts
// import { ColaboFlowAudit } from './lib/audit';
// it gets all HTTP verb methods (index, post, ...) available
import * as ColaboFlowAuditAPI from './lib/audit';

const API_ROUTE = 'colabo-flow/audit';

export function initialize(app) {
    console.log("[puzzle(colabo-flow/audit) - /index.js] Registering ColaboFlow Audit API to: %s", API_ROUTE);

    var colaboFlowAudit = app.resource(API_ROUTE, ColaboFlowAuditAPI, { id: 'type?/:actionType?/:searchParam?' });
}
```

## 6. Make puzzle's business logic

In `colabo/src/backend/dev_puzzles/flow/audit/lib/audit.ts`:

```ts
const MODULE_NAME: string = "@colabo-flow/b-audit";

import { AuditedAction } from '@colabo-flow/i-audit';

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

        // TODO: read audits from the database

        if (result) {
            if (callback) callback(null, result);
            if (this.res) resSendJsonProtected(this.res, { data: result, accessId: accessId, success: true });
        } else {
            let msg = "Missing result";
            let err = {
                content: msg
            };
            if (callback) callback(err, null);
            if (this.res) resSendJsonProtected(this.res, { data: null, accessId: accessId, success: false, msg: msg });
        }
    }

    create(callback: Function = null) {
        // create audit in the db
        // let audit: AuditedAction = {
        //     _id: "ffffffffffff"
        // };

        let body: string = this.req.body;
        console.log("[ColaboFlowAudit.post] body: %s", JSON.stringify(body));
        let result:any = {
            // db: audit,
            body: body
        }
        if (callback) callback(null, result);
        if (this.res) resSendJsonProtected(this.res, { data: result, accessId: accessId, success: true });
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
```

## 7. Build puzzle

```sh
cd colabo/src/backend/dev_puzzles/flow/audit
tsc
```

## 8. Build backend app

```sh
cd colabo/src/backend/apps/colabo-space
tsc
```

## 9. Run backend app

```sh
cd colabo/src/backend/apps/colabo-space
npm start
```