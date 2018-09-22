#!/usr/bin/env node

'use strict';
declare let require:any;

let chalk = require('chalk');

// import {ColaboFlowService} from '.';
import {ColaboFlowService} from '@colabo-flow/b-services';

let cfService = new ColaboFlowService();

async function execute(){
    // Connect
    let connResult = cfService.connect();
    connResult
        .then(result => console.log(chalk.blue.bold("ColaboFlow connect finished with result: "), result))
        .catch(error => console.log(chalk.red.bold("ColaboFlow connect finished with error: "), error));


    // avoid rat race
    await connResult;
    // send message
    let action = 'get_sims_for_user';
    let params = {
        mapId: '5b96619b86f3cc8057216a03',
        iAmId: '5b9fbde97f07953d41256b32',
        roundId: 1
    };

    let sendMsgResult = cfService.sendMessage(action, params);
    sendMsgResult
        .then((result:any) => console.log(chalk.blue.bold("ColaboFlow action (%s) finished with result: "), action, result))
        .catch(error => console.log(chalk.red.bold("ColaboFlow action (%s) finished with error: "), action, error));
    
    return sendMsgResult;
}

execute()
    .then((result:any) => {
        console.log(chalk.blue.bold("ColaboFlow execution finished with \n\t result: %s,  \n\t message: %s"), JSON.stringify(result), result.msg);
    })
    .catch(error => console.log(chalk.red.bold("ColaboFlow execution finished with error: "), error));