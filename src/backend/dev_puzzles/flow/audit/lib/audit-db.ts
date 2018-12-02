const MODULE_NAME: string = "@colabo-flow/b-audit";

import { AuditedAction } from '@colabo-flow/i-audit';

import { GetPuzzle } from '@colabo-utils/i-config';
let puzzleConfig: any = GetPuzzle(MODULE_NAME);

import { AuditDbVo } from './audit-db-vo';

import { CfAuditDbSchema } from './audit-db-schema';
var dbService = require('@colabo-knalledge/b-storage-mongo');
var dbConnection = dbService.DBConnect();
// var CfAuditModel = dbConnection.model('CfAudit', (<any>global).db.CfAuditDbSchema);
var CfAuditModel = dbConnection.model('CfAudit', CfAuditDbSchema);

export class ColaboFlowAuditDb {

    constructor() {
    }

    index(callback: Function = null) {
        let result = "Hello from audit";

        // TODO: read audits from the database

        if (result) {
            if (callback) callback(null, result);
        } else {
            let msg = "Missing result";
            let err = {
                content: msg
            };
            if (callback) callback(err, null);
        }
    }

    create(auditedAction:AuditedAction, callback: Function = null) {
        let cfAuditDb: AuditDbVo = new AuditDbVo(auditedAction);

        var cfAuditDbModel = new CfAuditModel(cfAuditDb);

        console.log("[%s:ColaboFlowAuditDb:save] Before create data: %s", MODULE_NAME, JSON.stringify(cfAuditDbModel));

        cfAuditDbModel.save(function (err) {
            console.log("[%s:ColaboFlowAuditDb:save] After create data: %s", MODULE_NAME, JSON.stringify(cfAuditDbModel));

            if (callback) {
                callback(cfAuditDbModel, err);
            }
            else {
                console.log('no callback');
            }

            if (err) {
                console.error('cfAuditDbModel.save', err);
                throw err;
            }
        });
    }
}