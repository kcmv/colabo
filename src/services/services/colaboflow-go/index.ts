const MODULE_NAME: string = "@colabo-flow/service-go";


var https = require("https");
var http = require("http");
// We need this to build our post string
var querystring = require('querystring');

let chalk = require('chalk');
let coLaboFlowGoText = chalk.red("Colabo") + chalk.blue("Flow") + "Go Service";
console.log(coLaboFlowGoText + " is starting ...")

process.chdir(__dirname);

// import * as express from "express";

import { init, GetPuzzle } from '@colabo-utils/i-config';
const configFile:any = require('./config/global');
const globalSet:any = configFile.globalSet;
console.log("[ColaboFlow.Go:index] globalSet.paths: %s", JSON.stringify(globalSet.paths));
init(globalSet);
const puzzleConfig: any = GetPuzzle(MODULE_NAME);
const actions:any[] = puzzleConfig.actions;

console.log("Actions: ", actions);

let fs = require('fs');

const DB_USE = false;

import { ColaboFlowGoServer } from '@colabo-flow/s-go';
import { RpcMethods, RpcCallback, ActionExecuteRequest, ActionExecuteReply } from '@colabo-flow/i-go';

if (DB_USE){
    // import { ColaboFlowGoDb, GoDbVo } from '@colabo-flow/b-go';
}

if (DB_USE) {
// let colaboFlowGoDb: ColaboFlowGoDb = new ColaboFlowGoDb();
}

var id:number=0;

function getActionDefinition(goRequest: ActionExecuteRequest){
    for(let actionId in actions){
        let action = actions[actionId];
        if (action.name === goRequest.name){
            console.log("Action found: ", action);
            return action;
        }
    }
}
// curl -X POST https://m.audiocommons.org/api/o/token/ -d 'client_id=<YOUR_CLIENT_ID>&grant_type=password&username=<YOUR_USERNAME>&password=<YOUR_PASSWORD>'
function getHttpContent(connectionParam:any, callback:Function, postData:any=undefined) {

    // https://stackoverflow.com/questions/6819143/curl-equivalent-in-nodejs
    // https://gist.github.com/bdickason/1105888
    // https://www.npmjs.com/package/curlrequest
    // https: //github.com/mrsarm/reqclient#logging-with-curl-style
    // https://stackoverflow.com/questions/6158933/how-to-make-an-http-post-request-in-node-js
    // Build the post string from an object
    var postDataStr:string;
    if (connectionParam.isPost){
        postDataStr = querystring.stringify(postData);
    }
    console.log("postDataStr: ", postDataStr);
    
    let postDataTemp:any = {
        'query': 'PREFIX cc: <http://creativecommons.org/ns#>\nPREFIX ac: <https://w3id.org/ac-ontology/aco#>\nPREFIX dc: <http://purl.org/dc/elements/1.1/>\nPREFIX iter: <http://w3id.org/sparql-generate/iter/>\nPREFIX fn: <http://w3id.org/sparql-generate/fn/>\nPREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>\nPREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>\nPREFIX prov: <http://www.w3.org/ns/prov#>\nPREFIX foaf: <http://xmlns.com/foaf/0.1/>\nPREFIX schema: <http://schema.org/>\nPREFIX ebu: <http://www.ebu.ch/metadata/ontologies/ebucore/ebucore#>\n\nPREFIX europeana-res: <https://w3id.org/audiocommons/services/europeana/resources>\n\nPREFIX europeana-api: <https://www.europeana.eu/api/v2/>\n\n            GENERATE {\n            \nGENERATE {\n\n  GENERATE {\n    <http://europeana.eu>\n        rdf:type prov:Agent, foaf:Organization ;\n        foaf:name "Europeana" .\n\n    ?searchAction\n        a schema:SearchAction ;\n        schema:object <http://europeana.eu> ;\n        schema:query $pattern ;\n        schema:startTime $startTime;\n        schema:endTime ?endTime;\n        schema:actionStatus ?actionStatus;\n        schema:result ?audioCollection ;\n        schema:error ?error .\n\n    ?audioCollection\n        rdf:type ac:AudioCollection; #, prov:Entity ;\n    #    prov:wasAttributedTo <http://europeana.eu> ;\n        ac:nodeCount ?nodeCount .\n\n    ?error rdfs:label ?errorMessage .\n\n    GENERATE {\n      ?audioCollection ac:memberNode ?audioCollectionNode .\n      ?audioCollectionNode\n          a ac:AudioCollectionNode ;\n          ac:nodeIndex ?index ;\n          ac:nodeContent ?audioClip .\n\n      ?audioClip\n          rdf:type ac:AudioClip ;\n          dc:title ?title ;\n  \t      dc:description ?desc ;\n  \t      ac:author ?author ;\n  \t      cc:license ?license ;\n  #\t      ac:originalFile _:originalFile ;\n          ac:availableAs ?audioPreviewFile .\n  #        rdf:type prov:Entity ;\n  #        prov:wasAttributedTo <http://europeana.eu> .\n      ?audioPreviewFile rdf:type ac:AudioFile ;\n          ebu:locator ?audioPreviewFileUrl .\n\n    }\n    ITERATOR iter:JSONElement(?source,"items[*]") AS ?resIterator\n    WHERE {\n      BIND(BNODE() AS ?audioCollectionNode)\n      BIND(fn:JSONPath(?resIterator, "element") AS ?res)\n      BIND(fn:JSONPath(?resIterator, "position") AS ?indexFromZero)\n      BIND(?indexFromZero + 1 AS ?index)\n\n      BIND(IRI(CONCAT(STR(europeana-res:), STR(fn:JSONPath(?res, "id")))) AS ?audioClip)\n      BIND(fn:JSONPath(?res, "type") AS ?type)\n      BIND(fn:JSONPath(?res, "title[0]") AS ?title)\n      BIND(IRI(fn:JSONPath(?res, "rights[0]")) AS ?license)\n      BIND(fn:JSONPath(?res, "dcCreator[0]") AS ?author)\n      BIND(fn:JSONPath(?res, "dcDescription[0]") AS ?desc)\n  #    BIND(IRI(fn:JSONPath(?res, "edmIsShownAt[0]")) AS ?origFile)\n      BIND(IRI(fn:JSONPath(?res, "edmIsShownBy[0]")) AS ?audioPreviewFileUrl)\n      OPTIONAL {\n        BIND(BNODE() AS ?audioPreviewFile).\n        FILTER(BOUND(?audioPreviewFileUrl))\n      }\n    } .\n  }\n  SOURCE ?serviceCall AS ?source\n  WHERE {\n    BIND(BNODE() AS ?searchAction)\n    BIND(fn:JSONPath(?source, "success") AS ?wasSuccessful)\n    BIND(IF(BOUND(?wasSuccessful), schema:CompletedActionStatus, schema:FailedActionStatus) AS ?actionStatus)\n    OPTIONAL {\n    \tBIND(BNODE() AS ?audioCollection) .\n      FILTER(BOUND(?wasSuccessful))\n    }\n    OPTIONAL {\n    \tBIND(BNODE() AS ?error) .\n      FILTER(!BOUND(?wasSuccessful))\n    }\n    BIND(fn:JSONPath(?source, "error") AS ?errorMessage)  .\n    BIND(NOW() AS ?endTime)\n  } .\n}\nWHERE {\n  BIND(IRI(CONCAT(\n      STR(europeana-api:), "search.json",\n      "?wskey=", ENCODE_FOR_URI("6NPvpkHH4"),\n      "&qf=what:SOUND",\n      "&reusability=RESTRICTED&reusability=OPEN",\n      "&media=true&profile=rich",\n      "&query=", ENCODE_FOR_URI($pattern),\n      IF(BOUND($limit), CONCAT("&rows=", ENCODE_FOR_URI(STR($limit))),""),\n      IF(BOUND($page), CONCAT("&start=", ENCODE_FOR_URI(STR($limit * ($page - 1) + 1))),"")\n  )) AS ?serviceCall)\n}\n.\n            }\n            WHERE {\n            BIND("dog" AS $pattern). BIND("2018-12-17T16:35:15.874683"^^<http://www.w3.org/2001/XMLSchema#dateTime> AS $startTime). BIND(12 AS $limit). BIND(1 AS $page).\n            } '
    }


    var options = {
        host: connectionParam.host,
        // https://stackoverflow.com/questions/15421050/node-request-getting-error-ssl23-get-server-hellounknown-protocol
        port: connectionParam.port,
        path: connectionParam.path,
        method: connectionParam.isPost ? 'POST' : 'GET',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Content-Length': Buffer.byteLength(postDataStr)
        }
    };
    
    let _http = connectionParam.isHttps ? https : http;
    
    console.log("options: ", options);

    // TODO support detecting and forwarding errors
    var req = _http.request(options, function (res:any) {
        var bodyStr = "";
        console.log('STATUS: ' + res.statusCode);
        console.log('HEADERS: ' + JSON.stringify(res.headers));
        res.setEncoding('utf8');
        res.on('data', function (chunk) {
            console.log('chunk length: ' + chunk.length);
            bodyStr += chunk;
        });
        res.on('end', function () {
            console.log('bodyStr: ' + bodyStr);
            // var body = JSON.parse(bodyStr);
            callback(bodyStr);
        });
    });

    req.on('error', function (e) {
        console.error('problem with request: ' + e.message);
    });

    // write data to request body
    console.log("Request data: ", postDataStr);
    if (connectionParam.isPost){
        // postDataStr = JSON.stringify(postDataTemp);
        console.log("Sending POST data: ", postDataStr);
        req.write(postDataStr);
    }
    req.end();
};

/**
 * Get a feature object at the given point, or creates one if it does not exist.
 * @param {goRequest} go The go to executeActionSync
 * @return {goReplay} reply to the go submission
 */
function executeActionSync(goRequest: ActionExecuteRequest, callback: RpcCallback) {
    console.log("goRequest: %s", JSON.stringify(goRequest));
    let actionDefinition = getActionDefinition(goRequest);
    if (actionDefinition.connector.type === 'http'){
        let url: string = 'https://m2.audiocommons.org/api/audioclips/search?pattern=dog';
        let host: string = 'm2.audiocommons.org';
        let path: string = '/api/audioclips/search?pattern=dog';
        let postData = JSON.parse(goRequest.dataIn);
        console.log("postData: ", postData);
        let instances = actionDefinition.connector.instances;
        let instanceId = Math.floor(Math.random() * instances.list.length);
        let instance = instances.list[instanceId];
        let connectionParam:any = {
            host: instance.host,
            port: instance.port,
            path: instance.path,
            isHttps: actionDefinition.connector.isHttps,
            isPost: actionDefinition.connector.isPost,
        };
        getHttpContent(connectionParam, function (result) {
            let goDbVo: any;
            let goReplay: ActionExecuteReply = {
                id: "" + (id++),
                dataOut: result,
                params: "all good"
            }
            callback(null, goReplay);
        }.bind(this), postData);
    }
    // colaboFlowGoDb.create(goRequest, function (goDbVo:GoDbVo){
        // let goDbVo: any;
        // let goReplay: ActionExecuteReply = {
        //     id: "" + (id++),
        //     dataOut: "Hura, executer",
        //     params: "all good"
        // }
        // callback(null, goReplay);
    // }.bind(this));
}

let rpcMethods: RpcMethods = {
    executeActionSync: executeActionSync.bind(this)
}

let colaboFlowGoServer = new ColaboFlowGoServer();
colaboFlowGoServer.init(rpcMethods);
colaboFlowGoServer.start();
console.log(coLaboFlowGoText + " started ...");
