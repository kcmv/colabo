const MODULE_NAME: string = "@colabo-flow/b-go";

import { GoedAction } from '@colabo-flow/i-go';

import { GetPuzzle } from '@colabo-utils/i-config';
let puzzleConfig: any = GetPuzzle(MODULE_NAME);

import { GoDbVo } from './go-db-vo';

import { CfGoDbSchema } from './go-db-schema';
var dbService = require('@colabo-knalledge/b-storage-mongo');
var dbConnection = dbService.DBConnect();
// var CfGoModel = dbConnection.model('CfGo', (<any>global).db.CfGoDbSchema);
var CfGoModel = dbConnection.model('CfGo', CfGoDbSchema);

export enum MainTypes {
    GetGos = 'get-gos',
    GetStats = 'get-stats'
}

export enum ActionTypes{
    FilterByName = 'filter-by-name',
    All = 'all',
    Sessions = 'sessions'
}
export interface SearchParams{
    type: MainTypes;
    actionType?: ActionTypes;
    id?: string;
};

export class ColaboFlowGoDb {
    protected limitFindNo:Number;
    constructor() {
        this.limitFindNo = puzzleConfig.limitFindNo || 100;
    }

    index(searchParams:any, callback: Function = null) {
        let result = "Hello from go";
        console.log('[ColaboFlowGoDb::index] searchParams',searchParams);
        var foundGos = function (err, cfGos) {
            console.log("[%s:ColaboFlowGoDb:index:foundGos] cfGos:%s", MODULE_NAME, JSON.stringify(cfGos));
            if (err) {
                var msg = JSON.stringify(err);
                if (callback) callback(err, null);
                throw err;
            } else {
                if (callback) callback(null, cfGos);
            }
        }

        let searchQuery:any = {};
        switch(searchParams.type){
            case MainTypes.GetGos:
                if(searchParams.actionType === ActionTypes.FilterByName){
                    searchQuery.name = searchParams.id;
                }
                CfGoModel.find(searchQuery, foundGos.bind(this)).sort({ createdAt: -1 }).limit(this.limitFindNo);            
            break;
            case MainTypes.GetStats:
                // if(searchParams.actionType === ActionTypes.Sessions){
                //     searchQuery.name = searchParams.id;
                // }

                let id:string = searchParams.id; //'e123,cat,e124'; //mockup
                console.log("[index] " + MainTypes.GetStats + ": id: %s", id);
                let ids:string[] = id.split(',');
                console.log('[index] ids', ids);
                // KNodeModel.find({ '_id': { $in: ids } }, found);
                //https://docs.mongodb.com/manual/reference/operator/aggregation/cond/#exp._S_cond
                CfGoModel
                .aggregate()
                .match({ sessionId: { $in: ids } })
                //.match({ sessionId: { $in: [ "e123", "cat" ] } })
                .group({ _id: "$name", count: { $sum: 1 }, avgTime: { $avg: {$toInt: "$time"} }, successCount: { $sum: { $cond: { if: "$success", then: 1, else: 0 } } }})
                // .project('_id count avgTime successCount')
                // CfGoModel.aggregate().group({ _id: "$name", count: { $sum: 1 }, maxTime: { $max: "$time" } })
                // .project('_id maxTime')
                .exec(foundGos)

                // .group({ _id: null, maxBalance: { $max: '$balance' } }).
                // .project('-id maxBalance').
                // CfGoModel.find(searchQuery, foundGos.bind(this)).sort({ createdAt: -1 }).limit(this.limitFindNo);            
            break;
        }
    }

    create(goedAction:GoedAction, callback: Function = null) {
        let cfGoDb: GoDbVo = new GoDbVo(goedAction);

        var cfGoDbModel = new CfGoModel(cfGoDb);

        console.log("[%s:ColaboFlowGoDb:save] Before create data: %s", MODULE_NAME, JSON.stringify(cfGoDbModel));

        cfGoDbModel.save(function (err) {
            console.log("[%s:ColaboFlowGoDb:save] After create data: %s", MODULE_NAME, JSON.stringify(cfGoDbModel));

            if (callback) {
                callback(cfGoDbModel, err);
            }
            else {
                console.log('no callback');
            }

            if (err) {
                console.error('cfGoDbModel.save', err);
                throw err;
            }
        });
    }
}