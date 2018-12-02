const MODULE_NAME: string = "@colabo-flow/service-audit";

let chalk = require('chalk');
let coLaboFlowAuditText = chalk.red("Colabo") + chalk.blue("Flow") + "Audit Service";
console.log(coLaboFlowAuditText + " is starting ...")

process.chdir(__dirname);

// import * as express from "express";

let configFile: any = require('./config/global');
let globalSet: any = configFile.globalSet;
console.log("[ColaboFlowAudit:index] globalSet.paths: %s", JSON.stringify(globalSet.paths));
let config = require('@colabo-utils/i-config');
config.init(globalSet);

let fs = require('fs');

import { ColaboFlowAuditDb, AuditDbVo } from '@colabo-flow/b-audit';
import { ColaboFlowAuditServer } from '@colabo-flow/s-audit';
import { RpcMethods, RpcCallback, AuditedAction, AuditedActionReply } from '@colabo-flow/i-audit';

let colaboFlowAuditDb: ColaboFlowAuditDb = new ColaboFlowAuditDb();
/**
 * Get a feature object at the given point, or creates one if it does not exist.
 * @param {auditRequest} audit The audit to submit
 * @return {auditReplay} reply to the audit submission
 */
function submit(auditRequest: AuditedAction, callback: RpcCallback) {
    console.log("auditRequest: %s", JSON.stringify(auditRequest));
    colaboFlowAuditDb.create(auditRequest, function (auditDbVo:AuditDbVo){
        let auditReplay: AuditedActionReply = {
            id: auditDbVo._id,
            time: auditDbVo.createdAt
        }
        callback(null, auditReplay);
    }.bind(this));
}

let rpcMethods: RpcMethods = {
    submit: submit.bind(this)
}

let colaboFlowAuditServer = new ColaboFlowAuditServer();
colaboFlowAuditServer.init(rpcMethods);
colaboFlowAuditServer.start();
console.log(coLaboFlowAuditText + " started ...");
