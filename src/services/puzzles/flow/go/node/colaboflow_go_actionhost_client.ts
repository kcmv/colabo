// var fs = require('fs');
import * as fs from 'fs';

// var chalk = require('chalk');
// import * as chalk from 'chalk';
import chalk from 'chalk'
var parseArgs = require('minimist');
var _ = require('lodash');
var async = require('async');
// var grpc = require('grpc');
import * as grpc from 'grpc';
// var protoLoader = require('@grpc/proto-loader');
import * as protoLoader from '@grpc/proto-loader';
// load the `*.proto` file with gRPC service definition

import { ActionExecuteRequestInterface, ActionExecuteRequestClass } from '@colabo-flow/i-go';

export class ColaboFlowGoActionHostClient {
    protected gRpcColaboFlow: any;
    protected socketUrl: string;
    protected client: any;

    constructor(socketUrl:string = 'localhost:50801') {
        this.socketUrl = socketUrl;

        // relative to the dist folder
        var PROTO_PATH = __dirname + '/../../protos/colabo/flow/go/go.proto';
        console.log("__dirname: %s, PROTO_PATH: %s", __dirname, PROTO_PATH);
        PROTO_PATH = fs.realpathSync(PROTO_PATH);
        console.log("after fs.realpathSync: PROTO_PATH: %s", PROTO_PATH);

        var packageDefinition = protoLoader.loadSync(
            PROTO_PATH,
            // Suggested options for similarity to existing grpc.load behavior
            {
                keepCase: true,
                longs: String,
                enums: String,
                defaults: true,
                oneofs: true
            });
        // The protoDescriptor object has the full package hierarchy
        var protoDescriptor = grpc.loadPackageDefinition(packageDefinition);
        //  we are getting the colaboFlow descriptor ...
        this.gRpcColaboFlow = (<any>protoDescriptor.colabo).flow;

        // and building stub client from the `colaboFlow.Go` class
        // (similarly the service class used to create a server is in the `colaboFlow.Go.service` class)
        this.client = new this.gRpcColaboFlow.ActionsHost(this.socketUrl,
            grpc.credentials.createInsecure());
    }
    
    executeAction(actionExecuteRequest: ActionExecuteRequestClass, callback?:Function){
        function finished(error, result){
            console.log("[executeAction] Result: ", result);
            if (typeof callback === 'function'){
                callback(error, result);
            }
        }

        this.client.executeAction(actionExecuteRequest, finished);
    }
}

/**
 * Run the getFeature demo. Calls getFeature with a point known to have a
 * feature and a point known not to have a feature.
 * @param {function} callback Called when this demo is complete
 */
// function submit(callback) {
//     var next = _.after(2, callback);

//     function featureCallback(error, result) {
//         if (error) {
//             callback(error);
//             return;
//         }
//         console.log('Result:  ' , result);
//         next();
//     }
//     let request1 = {
//         n1: 2,
//         n2: 3
//     };
//     client.submit(request1, featureCallback);
//     let request2 = {
//         n1: 4,
//         n2: 3
//     };
//     client.submit(request2, featureCallback);
// }
