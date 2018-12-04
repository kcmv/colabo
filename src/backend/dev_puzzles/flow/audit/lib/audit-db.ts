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

export enum MainTypes {
    GetAudits = 'get-audits',
    GetStats = 'get-stats'
}

export enum ActionTypes{
    FilterByName = 'filter-by-name',
    All = 'all'
}
export interface SearchParams{
    type: MainTypes;
    actionType?: ActionTypes;
    id?: string;
};

export class ColaboFlowAuditDb {
    protected limitFindNo:Number;
    constructor() {
        this.limitFindNo = puzzleConfig.limitFindNo || 100;
    }

    index(searchParams:any, callback: Function = null) {
        let result = "Hello from audit";
        var foundAudits = function (err, cfAudits) {
            console.log("[%s:ColaboFlowAuditDb:index:foundAudits] cfAudits:%s", MODULE_NAME, JSON.stringify(cfAudits));
            if (err) {
                var msg = JSON.stringify(err);
                if (callback) callback(err, null);
                throw err;
            } else {
                if (callback) callback(null, cfAudits);
            }
        }

        let searchQuery:any = {};
        switch(searchParams.type){
            case MainTypes.GetAudits:
                if(searchParams.actionType === ActionTypes.FilterByName){
                    searchQuery.name = searchParams.id;
                }
                CfAuditModel.find(searchQuery, foundAudits.bind(this)).sort({ createdAt: -1 }).limit(this.limitFindNo);            
            break;
            case MainTypes.GetStats:
                if(searchParams.actionType === ActionTypes.FilterByName){
                    searchQuery.name = searchParams.id;
                }
                CfAuditModel.aggregate().group({ _id: "$name", count: { $sum: 1 }, avgTime: { $avg: "$time" }, successCount: { $sum: "$success" } })
                // .project('_id count avgTime successCount')
                // CfAuditModel.aggregate().group({ _id: "$name", count: { $sum: 1 }, maxTime: { $max: "$time" } })
                // .project('_id maxTime')
                .exec(foundAudits)

                // .group({ _id: null, maxBalance: { $max: '$balance' } }).
                // .project('-id maxBalance').
                // CfAuditModel.find(searchQuery, foundAudits.bind(this)).sort({ createdAt: -1 }).limit(this.limitFindNo);            
            break;
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