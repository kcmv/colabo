"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// import {KNode} from '../services/kNode';
var dbService = require('@colabo-knalledge/b-knalledge-storage-mongo/dbService');
var accessId = 0;
function resSendJsonProtected(res, data) {
    // http://tobyho.com/2011/01/28/checking-types-in-javascript/
    if (data !== null && typeof data === 'object') {
        res.set('Content-Type', 'application/json');
        // JSON Vulnerability Protection
        // http://haacked.com/archive/2008/11/20/anatomy-of-a-subtle-json-vulnerability.aspx/
        // https://docs.angularjs.org/api/ng/service/$http#description_security-considerations_cross-site-request-forgery-protection
        res.send(")]}',\n" + JSON.stringify(data));
    }
    else if (typeof data === 'string') {
        res.send(data);
    }
    else {
        res.send(data);
    }
}
;
var dbConnection = dbService.connect();
var KNodeModel = dbConnection.model('KNode', global.db.kNode.Schema);
var KEdgeModel = dbConnection.model('kEdge', global.db.kEdge.Schema);
var SearchNodes = /** @class */ (function () {
    function SearchNodes(req, res) {
        this.req = req;
        this.res = res;
    }
    SearchNodes.prototype.index = function (callback) {
        if (callback === void 0) { callback = null; }
        console.log("[puzzle(knalledge/search) - /models/index.js] req: %s", JSON.stringify(this.req.params));
        console.log('req.body:', this.req.body);
        var id = this.req.params.searchParam;
        var id2 = this.req.params.searchParam2;
        var type = this.req.params.type;
        var actionType = this.req.params.actionType;
        var isParents = true;
        var foundEdges = function (err, kEdges) {
            console.log("[puzzle(knalledge/search) - /models/index.js] in 'foundEdges'", kEdges);
            if (err) {
                // throw err;
                var msg = JSON.stringify(err);
                if (callback)
                    callback(err, null);
                resSendJsonProtected(this.res, { data: null, accessId: accessId, message: msg, success: false });
            }
            else {
                var kNodeIds = [];
                var kEdge;
                if (isParents) {
                    for (var _i = 0, kEdges_1 = kEdges; _i < kEdges_1.length; _i++) {
                        kEdge = kEdges_1[_i];
                        kNodeIds.push(kEdge.sourceId);
                    }
                }
                else {
                    for (var _a = 0, kEdges_2 = kEdges; _a < kEdges_2.length; _a++) {
                        kEdge = kEdges_2[_a];
                        kNodeIds.push(kEdge.targetId);
                    }
                }
                var foundNodes = function (err, kNodes) {
                    console.log("[puzzle(knalledge/search) - /models/index.js] in 'foundEdges'", kNodes);
                    if (err) {
                        // throw err;
                        var msg = JSON.stringify(err);
                        if (callback)
                            callback(err, null);
                        resSendJsonProtected(this.res, { data: null, accessId: accessId, message: msg, success: false });
                    }
                    else {
                        if (callback)
                            callback(null, kNodes);
                        // resSendJsonProtected(this.res, { data: { type: type, actionType: actionType, id: id, id2: id2, edges: kEdges, nodes: kNodes }, accessId: accessId, success: true });
                        resSendJsonProtected(this.res, { data: kNodes, accessId: accessId, success: true });
                    }
                };
                KNodeModel.find({ '_id': { $in: kNodeIds } }, foundNodes.bind(this));
            }
        };
        if (type == 'parents' && actionType == 'in-map') {
            KEdgeModel.find({ 'mapId': id, 'targetId': id2 }, foundEdges.bind(this));
            isParents = true;
        }
        else if (type == 'children' && actionType == 'in-map') {
            KEdgeModel.find({ 'mapId': id, 'sourceId': id2 }, foundEdges.bind(this));
            isParents = false;
        }
        else {
            resSendJsonProtected(this.res, { data: null, accessId: accessId, success: false, msg: "Not matching API signature" });
        }
    };
    return SearchNodes;
}()); // CLASS END
// curl -v -H "Content-Type: application/json" -X GET http://127.0.0.1:8001/search-nodes/parents/in-map/58068a04a37162160341d402/59d3fb284b077e6c540f758e
// curl -v -H "Content-Type: application/json" -X GET http://127.0.0.1:8001/search-nodes/parents/in-map/58068a04a37162160341d402/580c10bed50bfd4f0ceacb1c
// https://stackoverflow.com/questions/15651510/can-typescript-export-a-function
// https://www.sitepoint.com/understanding-module-exports-exports-node-js/
function index(req, res) {
    var searchNodes = new SearchNodes(req, res);
    searchNodes.index();
}
exports.index = index;
//# sourceMappingURL=search-nodes.js.map