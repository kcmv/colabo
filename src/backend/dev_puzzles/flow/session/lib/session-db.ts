const MODULE_NAME: string = "@colabo-flow/b-session";

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
    All = 'all',
    // Sessions = 'sessions',
    SessionsFlow = 'sessions-flow',
}
export interface SearchParams{
    type: MainTypes;
    actionType?: ActionTypes;
    id?: string;
    id2?: string;
};

export class ColaboFlowAuditDb {
    protected limitFindNo:Number;
    constructor() {
        this.limitFindNo = puzzleConfig.limitFindNo || 100;
    }

    index(searchParams:any, callback: Function = null) {
        let result = "Hello from audit";
        console.log('[ColaboFlowAuditDb::index] searchParams',searchParams);
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
            {
                let sessions:string = searchParams.id; //'e123,cat,e124'; //mockup
                let flowId:string = searchParams.id2;
                console.log("[index] " + MainTypes.GetAudits + ": sessions:", sessions,", flowId:", flowId);
                let ids:string[] = sessions.split(',');
                console.log('[index] ids', ids);
                
                searchQuery = {
                    sessionId: { $in: ids },
                    flowId: flowId
                }

                CfAuditModel.find(searchQuery, foundAudits.bind(this)).sort({ createdAt: -1 }).limit(this.limitFindNo);            
            }
            break;
            case MainTypes.GetStats:
            {
                // if(searchParams.actionType === ActionTypes.Sessions){
                //     searchQuery.name = searchParams.id;
                // }

                let sessions:string = searchParams.id; //'e123,cat,e124'; //mockup
                let flowId:string = searchParams.id2;
                console.log("[index] " + MainTypes.GetStats + ": sessions:", sessions,", flowId:", flowId);
                let ids:string[] = sessions.split(',');
                console.log('[index] ids', ids);
                // KNodeModel.find({ '_id': { $in: ids } }, found);
                //https://docs.mongodb.com/manual/reference/operator/aggregation/cond/#exp._S_cond

                let matchQ:any[] = [{ sessionId: { $in: ids } }];
                if(flowId !== 'null' && flowId !==  'null' && flowId !==  undefined){
                    matchQ.push({ flowId: flowId});
                }
                    
                CfAuditModel
                .aggregate()
                .match({
                    $and: matchQ
                })
                //.match({ sessionId: { $in: [ "e123", "cat" ] } })
                .group({ _id: "$name", count: { $sum: 1 }, avgTime: { $avg: {$toInt: "$time"} }, successCount: { $sum: { $cond: { if: "$success", then: 1, else: 0 } } }})
                // .project('_id count avgTime successCount')
                // CfAuditModel.aggregate().group({ _id: "$name", count: { $sum: 1 }, maxTime: { $max: "$time" } })
                // .project('_id maxTime')
                .exec(foundAudits)

                // .group({ _id: null, maxBalance: { $max: '$balance' } }).
                // .project('-id maxBalance').
                // CfAuditModel.find(searchQuery, foundAudits.bind(this)).sort({ createdAt: -1 }).limit(this.limitFindNo);            
            }
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