'use strict';

var ANONYMOUS_USER_ID = "55268521fb9a901e442172f8";
var mongoose = require('mongoose');
//var Promise = require("bluebird");
var dbService = require('@colabo-knalledge/b-storage-mongo');

var mockup = { fb: { authenticate: false }, db: { data: false } };
var accessId = 0;

function resSendJsonProtected(res, data) {
    // http://tobyho.com/2011/01/28/checking-types-in-javascript/
    if (data !== null && typeof data === 'object') { // http://stackoverflow.com/questions/8511281/check-if-a-variable-is-an-object-in-javascript
        res.set('Content-Type', 'application/json');
        // JSON Vulnerability Protection
        // http://haacked.com/archive/2008/11/20/anatomy-of-a-subtle-json-vulnerability.aspx/
        // https://docs.angularjs.org/api/ng/service/$http#description_security-considerations_cross-site-request-forgery-protection
        res.send(")]}',\n" + JSON.stringify(data));
    } else if (typeof data === 'string') { // http://stackoverflow.com/questions/4059147/check-if-a-variable-is-a-string
        res.send(data);
    } else {
        res.send(data);
    }
};

var dbConnection = dbService.DBConnect();

var KEdgeModel = dbConnection.model('kEdge', global.db.kEdge.Schema);

//reguired for requests that return results populated with target or ource nodes:
var KNodeModel = dbConnection.model('KNode', global.db.kNode.Schema);

// module.exports = KEdgeModel; //then we can use it by: var User = require('./app/models/KEdgeModel');

// curl -v -H "Content-Type: application/json" -X GET http://127.0.0.1:8888/kedges/one/5524344b498be1070ccca4f6
// curl -v -H "Content-Type: application/json" -X GET http://127.0.0.1:8888/kedges/one/5524344b498be1070ccca4f6
// curl -v -H "Content-Type: application/json" -X GET http://127.0.0.1:8888/kedges/one/5524344b498be1070ccca4f6
//curl -v -H "Content-Type: application/json" -X GET http://127.0.0.1:8888/kedges/between/551b4366fd64e5552ed19364/551bb2c68f6e4cfc35654f37
//curl -v -H "Content-Type: application/json" -X GET http://127.0.0.1:8888/kedges/in_map/552678e69ad190a642ad461c
exports.index = function(req, res) {

    var id = req.params.searchParam;
    var id2 = req.params.searchParam2;
    var id3 = req.params.searchParam3;
    var id4 = req.params.searchParam4;
    var type = req.params.type;

    var found = function(err, kEdges) {
        //console.log("[modules/kEdge.js:index] in found; req.params.type: %s: ", req.params.type);
        //console.log("kEdges:"+kEdges);
        if (err) {
            throw err;
            var msg = JSON.stringify(err);
            resSendJsonProtected(res, { data: kEdges, accessId: accessId, message: msg, success: false });
        } else {
            resSendJsonProtected(res, { data: kEdges, accessId: accessId, success: true });
        }
    }

    console.log("[modules/kEdge.js:index] req.params.searchParam: %s. req.params.searchParam2: %s", req.params.searchParam, req.params.searchParam2);
    if (mockup && mockup.db && mockup.db.data) {
        var datas_json = [];
        //TODO: change data here:
        datas_json.push({ id: 1, name: "Sun" });
        datas_json.push({ id: 2, name: "Earth" });
        datas_json.push({ id: 3, name: "Pluto" });
        datas_json.push({ id: 4, name: "Venera" });
        resSendJsonProtected(res, { data: datas_json, accessId: accessId });
    }

    //TODO: remove (testing)
    KEdgeModel.find(function(err, kEdges) {
        //console.log("all data:\n length: %d.\n", kEdges.length);
        //console.log(kEdges);
        //resSendJsonProtected(res, {data: {, accessId : accessId, success: true});
    });

    switch (type) {
        case 'one': //by edge id:
            KEdgeModel.findById(req.params.searchParam, found);
            break;
        case 'between': //all edges between specific nodes:
            KEdgeModel.find({ $and: [{ 'sourceId': req.params.searchParam }, { 'targetId': req.params.searchParam2 }] }, found);
            break;
        case 'connected': //all edges connected to knode.id
            KEdgeModel.find({ $or: [{ 'sourceId': req.params.searchParam }, { 'targetId': req.params.searchParam }] }, found);
            break;
        case 'in_map': //all edges in specific map
            KEdgeModel.find({ 'mapId': req.params.searchParam }, found);
            break;
        case 'for_map_type_user_w_target_nodes':
            console.log("for_map_type_user_w_target_nodes: mapId: %s, type: %s", id, id2);
            var queryObj = { 'mapId': id, 'type': id2};
            if(id3 !== null && id3 !== undefined && id3 !== 'null') {
                console.log('iAmId: ', id3);
                queryObj['iAmId'] = id3;
            }
            else{
                console.log('iAmId: is not set as a paremeter - so for all users');
            } 
            KEdgeModel.find(queryObj).populate('targetId', '_id name dataContent.humanID').exec(found);
            break;
        default:
            console.log("[modules/kEdge.js:index] unsuported req.params.type: %s", type);
            resSendJsonProtected(res, { data: [], accessId: accessId, message: 'unsuported req type \'' + req.params.type + '\'', success: false });
    }
}

// curl -v -H "Content-Type: application/json" -X POST -d '{"name":"Hello Edge", "iAmId":5, "type":"contains", "sourceId":"551b4366fd64e5552ed19364", "targetId": "551bb2c68f6e4cfc35654f37", "ideaId":0}' http://127.0.0.1:8888/kedges
// curl -v -H "Content-Type: application/json" -X POST -d '{"name":"Hello Edge 3", "iAmId":6, "type":"contains", "ideaId":0}' http://127.0.0.1:8888/kedges
exports.create = function(req, res) {
    console.log("[modules/kEdge.js:create] req.body: %s", JSON.stringify(req.body));

    var data = req.body;
    if (!("iAmId" in data) || data.iAmId == null || data.iAmId == 0) data.iAmId = mongoose.Types.ObjectId(ANONYMOUS_USER_ID);

    var kEdge = new KEdgeModel(data);
    //TODO: Should we force existence of node ids?
    if (data.sourceId) {
        kEdge.sourceId = mongoose.Types.ObjectId(data.sourceId);
    }
    if (data.targetId) {
        kEdge.targetId = mongoose.Types.ObjectId(data.targetId);
    }

    kEdge.save(function(err) {
        if (err) throw err;
        console.log("[modules/kEdge.js:create] data (id:%s) created data: %s", kEdge.id, JSON.stringify(kEdge));
        resSendJsonProtected(res, { success: true, data: kEdge, accessId: accessId });
    });
}

//curl -v -H "Content-Type: application/json" -X PUT -d '{"name": "Hello World E1"}' http://127.0.0.1:8888/kedges/one/551bb2c68f6e4cfc35654f37
//curl -v -H "Content-Type: application/json" -X PUT -d '{"mapId": "552678e69ad190a642ad461c", "sourceId": "55268521fb9a901e442172f9", "targetId": "5526855ac4f4db29446bd183"}' http://127.0.0.1:8888/kedges/one/552475525034f70c166bf89c
exports.update = function(req, res) {
    //console.log("[modules/KEdge.js:update] req.body: %s", JSON.stringify(req.body));

    var data = req.body;
    var id = req.params.searchParam;

    console.log("[modules/KEdge.js:update] id : %s", id);
    console.log("[modules/KEdge.js:update] data, : %s", JSON.stringify(data));

    delete data._id;
    //TODO: check this: multi (boolean) whether multiple documents should be updated (false)
    //TODO: fix: numberAffected vraca 0, a raw vraca undefined. pitanje je da li su ispravni parametri callback f-je
    // KEdgeModel.findByIdAndUpdate(id , data, { /* multi: true */ }, function (err, numberAffected, raw) {
    // 	  if (err) throw err;
    // 	  console.log('The number of updated documents was %d', numberAffected);
    // 	  console.log('The raw response from Mongo was ', raw);
    // 	  resSendJsonProtected(res, {success: true, data: data, accessId : accessId});
    // });

    data.updatedAt = new Date(); //TODO: workaround for hook "schema.pre('update',...)" not working
    KEdgeModel.update({ _id: id }, data, function(err, raw) {
        if (err) throw err;
        console.log('The raw response from Mongo was ', raw);
        data._id = id;
        resSendJsonProtected(res, { success: true, data: data, accessId: accessId });
    });
}

exports.destroy = function(req, res) {
    var type = req.params.type;
    var dataId = req.params.searchParam;
    var dataId2 = req.params.searchParam2;
    console.log("[modules/kEdge.js::destroy] dataId:%s, type:%s, req.body: %s", dataId, type, JSON.stringify(req.body));

    switch (type) {
        case 'one': //by edge id:
            console.log("[modules/kEdge.js:destroy] deleting 'one' edge with id = %d", dataId);
            KEdgeModel.findByIdAndRemove(dataId, function(err) {
                if (err) throw err;
                var data = { id: dataId };
                resSendJsonProtected(res, { success: true, data: data, accessId: accessId });
            });
            break;
        case 'connected': //all edges connected to knode.id
            console.log("[modules/kEdge.js:destroy] deleting 'connected' to %s", dataId);
            KEdgeModel.remove({ $or: [{ 'sourceId': dataId }, { 'targetId': dataId }] }, function(err) {
                if (err) {
                    console.log("[modules/kEdge.js:destroy] error:" + err);
                    throw err;
                }
                var data = { id: dataId };
                console.log("[modules/kEdge.js:destroy] data:" + JSON.stringify(data));
                resSendJsonProtected(res, { success: true, data: data, accessId: accessId });
            });
            break;
        case 'in-map': //all edges in the map
            console.log("[modules/kEdge.js:destroy] deleting edges in map %s", dataId);
            KEdgeModel.remove({ 'mapId': dataId }, function(err) {
                if (err) {
                    console.log("[modules/kEdge.js:destroy] error:" + err);
                    throw err;
                }
                var data = { id: dataId };
                console.log("[modules/kEdge.js:destroy] data:" + JSON.stringify(data));
                resSendJsonProtected(res, { success: true, data: data, accessId: accessId });
            });
            break;
            // TODO: this currently delete all edges that belongs to the provided mapId
        case 'by-modification-source': // by source (manual/computer) of modification
            console.log("[modules/kEdge.js:destroy] deleting edges in map %s", dataId);
            KEdgeModel.remove({ 'mapId': dataId }, function(err) {
                if (err) {
                    console.log("[modules/kEdge.js:destroy] error:" + err);
                    throw err;
                }
                var data = { id: dataId };
                console.log("[modules/kEdge.js:destroy] data:" + JSON.stringify(data));
                resSendJsonProtected(res, { success: true, data: data, accessId: accessId });
            });
            break;
        case 'by-type-n-user': // by type and user
            //TODO: we must also filter by `mapId` but so far we are sending only 2 parameters!
            console.log("[modules/kEdge.js:destroy] deleting all edges of type %s by user %s", dataId, dataId2);
            KEdgeModel.remove({ $and: [{ 'type': dataId }, { 'iAmId': dataId2 }] }, function(err) {
                if (err) {
                    console.log("[modules/kEdge.js:destroy] error:" + err);
                    throw err;
                }
                var data = { id: dataId };
                console.log("[modules/kEdge.js:destroy] data:" + JSON.stringify(data));
                resSendJsonProtected(res, { success: true, data: data, accessId: accessId });
            });
            break;
        case 'edges-to-child': // by type and user
            console.log("[modules/kEdge.js:destroy] deleting all edges with specific tagetId %s", dataId);
            KEdgeModel.remove({ 'targetId': dataId }, function(err) {
                if (err) {
                    console.log("[modules/kEdge.js:destroy] error:" + err);
                    throw err;
                }
                var data = { id: dataId };
                console.log("[modules/kEdge.js:destroy] data:" + JSON.stringify(data));
                resSendJsonProtected(res, { success: true, data: data, accessId: accessId });
            });
            break;
        default:
            console.log("[modules/kEdge.js:index] unsuported req.params.type: %s", type);
            resSendJsonProtected(res, { data: [], accessId: accessId, message: 'unsuported req type \'' + type + '\'', success: false });
    }
};