// var fs = require('fs');
import * as fs from 'fs';

// relative to the dist folder
var PROTO_PATH = __dirname + '/../../protos/colaboflow/audit.proto';
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
var colaboFlow = protoDescriptor.colabo.flow;

var COORD_FACTOR = 1e7;

/**
 * For simplicity, a point is a record type that looks like
 * {latitude: number, longitude: number}, and a feature is a record type that
 * looks like {name: string, location: point}. feature objects with name===''
 * are points with no feature.
 */

/**
 * List of feature objects at points that have been requested so far.
 */
var feature_list = [];

/**
 * Get a feature object at the given point, or creates one if it does not exist.
 * @param {audit} audit The audit to check
 * @return {feature} The feature object at the audit. Note that an empty name
 *     indicates no feature
 */
function submit(auditRequest) {
    console.log("auditRequest: %s", JSON.stringify(auditRequest));
    let auditReplay:any = {
        n1: auditRequest.n1 +auditRequest.n2
    }
    return auditReplay;
}

/**
 * submit request handler. Gets a request with a point, and responds with a
 * feature object indicating whether there is a feature at that point.
 * @param {EventEmitter} call Call object for the handler to process
 * @param {function(Error, feature)} callback Response callback
 */
function submitWrapper(call, callback) {
    // first parameter equal to null indicates that there is no error
    callback(null, submit(call.request));
}

/**
 * Get a new server with the handler functions in this file bound to the methods
 * it serves.
 * @return {Server} The new server object
 */
function getServer() {
    var server = new grpc.Server();
    server.addService(colaboFlow.Audit.service, {
        submit: submitWrapper
    });
    return server;
}

if (require.main === module) {
    // If this is run as a script, start a server on an unused port
    var routeServer = getServer();
    routeServer.bind('0.0.0.0:50505', grpc.ServerCredentials.createInsecure());
    console.info(chalk.bold("Started " + chalk.red("Colabo") + chalk.blue("Flow") + "Audit Service"));
    routeServer.start();
}

exports.getServer = getServer;