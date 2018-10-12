#!/usr/bin/env node

const MODULE_NAME = "@colabo-flow/b-services/demo"

declare let require:any;

let chalk = require('chalk');

// preset config
let globalSet:any = {
        puzzles: {
        '@colabo-flow/b-services': {
            debug: true,

            url: 'amqp://localhost:5672',
            queue: 'colabo-service-localhost',

            shouldRequestResult: true,
            noAck: true,

            shouldListenOnSeparateResponseQueue: false,
            separateResponseQueue: 'colabo-service-response-localhost'
        }
    }
};

let config = require('@colabo-utils/i-config');
config.init(globalSet);

// import {ColaboFlowService} from '.';
import {ColaboFlowService} from '@colabo-flow/b-services';

let cfService = new ColaboFlowService();

async function execute(action, params){
    // Connect
    let connResult = cfService.connect();
    connResult
        .then(result => console.log(chalk.blue.bold("ColaboFlow connect finished with result: "), result))
        .catch(error => console.log(chalk.red.bold("ColaboFlow connect finished with error: "), error));

    // avoid rat race
    await connResult;

    let sendMsgResult = cfService.sendMessage(action, params);
    sendMsgResult
        .then((result:any) => console.log(chalk.blue.bold("ColaboFlow action (%s) finished with result: "), action, result))
        .catch(error => console.log(chalk.red.bold("ColaboFlow action (%s) finished with error: "), action, error));
    
    return sendMsgResult;
}

// send message 1
let action1 = 'get_sims_for_user';
let params1 = {
    mapId: '5b96619b86f3cc8057216a03',
    iAmId: '5b9fbde97f07953d41256b32',
    roundId: 1
};

let executeResult1 = execute(action1, params1);
executeResult1
    .then((response:any) => {
        console.log(chalk.blue.bold("ColaboFlow execution finished with \n\t response: %s,  \n\t action: %s,  \n\t message: %s"), JSON.stringify(response), response.action, JSON.stringify(response.result));
    })
    .catch(error => console.log(chalk.red.bold("ColaboFlow execution finished with error: "), error))

// send message 2
let action2 = 'get_sims';
let params2 = {
    mapId: '5b96619b86f3cc8057216a05',
    iAmId: '5b9fbde97f07953d41256b38',
    roundId: 2
};

let executeResult2 = execute(action2, params2);
executeResult2
    .then((response:any) => {
        console.log(chalk.blue.bold("ColaboFlow execution finished with \n\t response: %s,  \n\t action: %s,  \n\t message: %s"), JSON.stringify(response), response.action, JSON.stringify(response.result));
    })
    .catch(error => console.log(chalk.red.bold("ColaboFlow execution finished with error: "), error))

//executeResult1
    // https://stackoverflow.com/questions/35999072/what-is-the-equivalent-of-bluebird-promise-finally-in-native-es6-promises
    //.finally(() => {
    //.then(() => {
    //    cfService.disconnect();
    //})

Promise.all([executeResult1, executeResult2]).then().catch()
.then(() => {
    console.log(chalk.blue.bold("both tasks"), "are finished. Quiting");
    cfService.disconnect();
});
