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
            cancelCunsumerTags: false,
            queue: 'colabo-service-localhost',

            shouldRequestResult: true,
            noAck: false,

            shouldListenOnSeparateResponseQueue: true,
            separateResponseQueue: 'colabo-service-response-localhost'
        }
    }
};

let config = require('@colabo-utils/i-config');
config.init(globalSet);

// import {ColaboFlowService} from '.';
import {ColaboFlowService} from '@colabo-flow/b-services';

// var connResult = Promise.resolve(5);
// connResult.then(result => console.log("ColaboFlow connect finished with result: ", result)).catch(error => console.log("ColaboFlow connect finished with error: ", error));


let cfService = new ColaboFlowService();

// Connect
let connResult = cfService.connect();
connResult
    .then(result => console.log(chalk.blue.bold("ColaboFlow connect finished with result: "), result));
connResult
    .catch(error => console.log(chalk.red.bold("ColaboFlow connect finished with error: "), error));

async function execute(action, params){

    // avoid rat race
    await connResult;

    let sendMsgResult = cfService.sendMessage(action, params);
    sendMsgResult
        .then((result:any) => console.log(chalk.blue.bold("ColaboFlow action (%s) finished with result: "), action, result))
        .catch(error => console.log(chalk.red.bold("ColaboFlow action (%s) finished with error: "), action, error));
    
    return sendMsgResult;
}

let executionsNo = 300;

let actions = ['get_sims_for_user', 'get_sims'];
let maps = ['5b96619b86f3cc8057216a03', '5b96619b86f3cc8057216a05'];
let iAmIds = ['5b9fbde97f07953d41256b32', '5b9fbde97f07953d41256b38'];
let executeResults = [];

function executeAction(executionNo){
    let action = actions[executionNo % actions.length];
    let map = maps[executionNo % maps.length];
    let iAmId = iAmIds[executionNo % iAmIds.length];
    let params = {
        mapId: map,
        iAmId: iAmId,
        roundId: Math.floor(Math.random() * 3)
    };
    let executeResult = execute(action, params);
    executeResults.push(executeResult);

    executeResult
        .then((response: any) => {
            console.log(chalk.blue.bold("ColaboFlow execution '%s' finished with \n\t response: %s,  \n\t action: %s,  \n\t message: %s"), 
            executionNo, JSON.stringify(response), response.action, JSON.stringify(response.result));
        })
        .catch(error => console.log(chalk.red.bold("ColaboFlow execution '%s' finished with error: "), executionNo, error))
}

for (let executionNo = 0; executionNo<executionsNo; executionNo++){
    executeAction(executionNo);
}

//executeResult1
    // https://stackoverflow.com/questions/35999072/what-is-the-equivalent-of-bluebird-promise-finally-in-native-es6-promises
    //.finally(() => {
    //.then(() => {
    //    cfService.disconnect();
    //})

Promise.all(executeResults).then().catch()
// finally equivalent
.then(() => {
    console.log(chalk.blue.bold("All %s tasks"), executionsNo, "are finished. Quiting");
    cfService.disconnect();
    console.log(chalk.blue.bold("disconnected"));
});
