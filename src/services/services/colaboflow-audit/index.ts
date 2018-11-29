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

import { ColaboFlowAudit } from '@colabo-flow/b-audit';
import { ColaboFlowAuditServer } from '@colabo-flow/s-audit';
import { RpcMethods } from '@colabo-flow/i-audit';


/**
 * Get a feature object at the given point, or creates one if it does not exist.
 * @param {auditRequest} audit The audit to submit
 * @return {auditReplay} reply to the audit submission
 */
function submit(auditRequest) {
    console.log("auditRequest: %s", JSON.stringify(auditRequest));
    let auditReplay: any = {
        n1: auditRequest.n1 + auditRequest.n2
    }
    return auditReplay;
}

let rpcMethods: RpcMethods = {
    submit: submit.bind(this)
}

let colaboFlowAuditServer = new ColaboFlowAuditServer();
colaboFlowAuditServer.init(rpcMethods);
colaboFlowAuditServer.start();
console.log(coLaboFlowAuditText + " started ...")
