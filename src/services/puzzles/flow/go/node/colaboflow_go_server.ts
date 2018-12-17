const MODULE_NAME: string = "@colabo-flow/s-go";

// var fs = require('fs');
import * as fs from 'fs'; 

// relative to the dist folder
var PROTO_PATH = __dirname + '/../../protos/colabo/flow/go/go.proto';
console.log("__dirname: %s, PROTO_PATH: %s", __dirname, PROTO_PATH);
PROTO_PATH = fs.realpathSync(PROTO_PATH);
console.log("after fs.realpathSync: PROTO_PATH: %s", PROTO_PATH);

// var chalk = require('chalk');
// import * as chalk from 'chalk';
import chalk from 'chalk'
var parseArgs = require('minimist');
var _ = require('lodash');
// var grpc = require('grpc'); 
import * as grpc from 'grpc';
// var protoLoader = require('@grpc/proto-loader');
import * as protoLoader from '@grpc/proto-loader';

import { GetPuzzle } from '@colabo-utils/i-config';
let puzzleConfig: any = GetPuzzle(MODULE_NAME);

import { RpcMethods } from '@colabo-flow/i-go';

export class ColaboFlowGoServer{
    protected gRpcServer:any;
    protected rpcMethods: RpcMethods;
    protected gRpcColaboFlow:any;

    constructor(){
        // load the `*.proto` file with gRPC service definition
        var packageDefinition = protoLoader.loadSync(
            PROTO_PATH, {
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
    }
    
    init(rpcMethods: RpcMethods){
        this.rpcMethods = rpcMethods;
    }
    
    /**
     * Get a new server with the handler functions in this file bound to the methods
     * it serves.
     * @return {Server} The new server object
     */
    protected getServer():any {
        var server = new grpc.Server();
        server.addService(this.gRpcColaboFlow.FlowsHost.service, {
            executeActionSync: this.executeActionSyncWrapper.bind(this)
        });
        return server;
    }

    /**
     * executeActionSync request handler. Gets a request with a point, and responds with a
     * feature object indicating whether there is a feature at that point.
     * @param {EventEmitter} call Call object for the handler to process
     * @param {function(Error, feature)} callback Response callback
     */
    protected executeActionSyncWrapper(call, callback) {
        // first parameter equal to null indicates that there is no error
        this.rpcMethods.executeActionSync(call.request, callback);
    }

    start(){
        this.gRpcServer = this.getServer();
        let gRpcUrl: string = puzzleConfig.gRpcUrl;
        console.info("[%s] Starting service at %s", MODULE_NAME, gRpcUrl);
        this.gRpcServer.bind(gRpcUrl, grpc.ServerCredentials.createInsecure());
        this.gRpcServer.start();
    }
}

