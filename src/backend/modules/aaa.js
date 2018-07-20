'use strict';

var crypto = require('crypto');

/**
 * New aaa file
 */
//var Promise = require("bluebird");

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

var dbService = require('./dbService');
var dbConnection = dbService.connect();

var KNodeModel = dbConnection.model('KNode', global.db.kNode.Schema);

let setPassword = function(kNode) {
    if (kNode.dataContent.password) {
        kNode.dataContent.salt = crypto.randomBytes(16).toString('hex');
        kNode.dataContent.hash = crypto.pbkdf2Sync(kNode.dataContent.password, kNode.dataContent.salt, 1000, 64, 'sha512').toString('hex');
        // delete kNode.dataContent.password;
    }
};

let validPassword = function(kNode, password) {
    console.log("[modules/aaa.js:validPassword] password: '%s', kNode.dataContent.salt: '%s'", password, kNode.dataContent.salt);
    if (password && kNode.dataContent.salt) {
        var hash = crypto.pbkdf2Sync(password, kNode.dataContent.salt, 1000, 64, 'sha512').toString('hex');
        return kNode.dataContent.hash === hash;
    }
    return false;
};

// curl -v -H "Content-Type: application/json" -X GET http://localhost:8001/aaa/one/default/5b50b14c735e9b2b499a3250
// curl -v -H "Content-Type: application/json" -X GET http://localhost:8001/aaa/oneByEmail/default/mprinc@gmail.com.json
// curl -v -H "Content-Type: application/json" -X GET http://localhost:8001/aaa/oneByEmailInMap/5b49e7f736390f03580ac9a7/mprinc@gmail.com.json
// curl -v -H "Content-Type: application/json" -X GET http://127.0.0.1:8888/aaa/in_map/552678e69ad190a642ad461c
exports.index = function(req, res) {

    /**
     * [function called as a find callback]
     * @param  {[type]} err     [description]
     * @param  {[type]} whoAmIs [description]
     * @return {[type]}         [description]
     */
    var found = function(err, whoAmIs) {
        console.log("[modules/aaa.js:index] in 'found'");
        if (err) {
            throw err;
            var msg = JSON.stringify(err);
            resSendJsonProtected(res, { data: whoAmIs, accessId: accessId, message: msg, success: false });
        } else {
            console.log("[modules/aaa.js:index] Data:\n%s", JSON.stringify(whoAmIs));
            resSendJsonProtected(res, { data: whoAmIs, accessId: accessId, success: true });
        }
    }

    var id = req.params.searchParam;
    var id2 = req.params.searchParam2;
    if (mockup && mockup.db && mockup.db.data) {
        var datas_json = [];
        datas_json.push({ id: 1, name: "Sun" });
        datas_json.push({ id: 2, name: "Earth" });
        datas_json.push({ id: 3, name: "Pluto" });
        datas_json.push({ id: 4, name: "Venera" });
        datas_json.push({ id: 4, name: "Saturn" });
        resSendJsonProtected(res, { data: datas_json, accessId: accessId, success: true });
        return;
    }
    //TODO: remove (this is for testing)
    // KNodeModel.find(function (err, whoAmIs) {
    // 	console.log("all data:\n length: %d.\n", whoAmIs.length);
    // 	console.log(whoAmIs);
    // 	//resSendJsonProtected(res, {data: {, accessId : accessId, success: true});
    // });

    console.log("[modules/aaa.js:index] req.params.searchParam: %s. req.params.searchParam2: %s", req.params.searchParam, req.params.searchParam2);
    switch (req.params.type) {
        case 'one': //by id:
            console.log("findById:\n id: %s.\n", id);
            KNodeModel.findById(id, found);
            break;
        case 'oneByEmail': // by email
            console.log("findBy e-mail:\n e-mail: %s\n", id2);
            KNodeModel.findOne({ 'dataContent.email': id2 }, found);
            break;
        case 'oneByEmailInMap': // by email
            console.log("find in map '%s' by e-mail: '%s'\n", id, id2);
            // AND operator condition
            // https://docs.mongodb.com/manual/tutorial/query-embedded-documents/
            KNodeModel.findOne({ mapId: id, 'dataContent.email': id2 }, found);
            break;
        case 'in_list': //by id:
            console.log("in_list:\n list: %s.\n", req.params.searchParam);
            var ids = []
            if (req.params.searchParam != undefined) {
                var ids = req.params.searchParam.split(',');
            }
            console.log('isArray:', Array.isArray(ids), ids.length);
            KNodeModel.find({ _id: { $in: ids } }, found);
            break;
        case 'all':
            console.log("all", req.params.searchParam);
            KNodeModel.find().exec(found);
            break;
            // case 'in_map': //all whoAmIs in specific map
            // 	console.log("find:\n mapId: %s.\n", id);
            // 	KNodeModel.find({ 'mapId': id}, found);
            // 	break;
            // case 'in_map_of_type': //all whoAmIs of particular type in specific map
            // 	console.log("find: mapId: %s, type: %s", id, id2);
            // 	KNodeModel.find({ $and: [{ mapId: id}, { type: id2}] }, found);
            // 	break;
    }
}

// curl -v -H "Content-Type: application/json" -X POST -d '{"firstname":"Sasha", "familyname": "Rudan", "displayName": "mPrinc"}' http://127.0.0.1:8888/aaa
// curl -v -H "Content-Type: application/json" -X POST -d '{"_id":"551bdcda1763e3f0eb749bd4", "name":"Hello World ID", "iAmId":5, "visual": {"isOpen": true}}' http://127.0.0.1:8888/aaa
exports.create = function(req, res) {
    /**
     * [function called as a find callback]
     * @param  {[type]} err     [description]
     * @param  {[type]} whoAmIs [description]
     * @return {[type]}         [description]
     */
    var found = function(err, whoAmIs) {
        console.log("[modules/aaa.js:create] in 'found'");
        if (err) {
            throw err;
            var msg = JSON.stringify(err);
            resSendJsonProtected(res, { data: whoAmIs, accessId: accessId, message: msg, success: false });
        } else {
            console.log("[modules/aaa.js:create] Data:\n%s", JSON.stringify(whoAmIs));
            let isValid = validPassword(whoAmIs, data.password);
            console.log("[modules/aaa.js:create] isValid: %s", isValid);
            if (isValid) {
                resSendJsonProtected(res, { data: whoAmIs, accessId: accessId, success: true });
            } else {
                var msg = "Wrong user name or password";
                resSendJsonProtected(res, { data: null, accessId: accessId, message: msg, success: false });
            }
        }
    }

    console.log("[modules/aaa.js:index] req.params.searchParam: %s. req.params.searchParam2: %s", req.params.searchParam, req.params.searchParam2);
    console.log("[modules/aaa.js:create] req.body: %s", JSON.stringify(req.body));

    var data = req.body;
    console.log("[modules/aaa.js:create] action (req.body.action): %s", req.body.action);
    console.log(data);

    switch (data.action) {
        case 'createUser':
            var whoAmI = new KNodeModel(data);
            setPassword(whoAmI);
            whoAmI.save(function(err) {
                if (err) throw err;
                console.log("[modules/aaa.js:create] id:%s, whoAmI data: %s", whoAmI._id, JSON.stringify(whoAmI));
                resSendJsonProtected(res, { success: true, data: whoAmI, accessId: accessId });
            });
            break;
        case 'checkUser':
            let email = data.email;
            let password = data.password;
            let mapId = data.mapId;
            console.log("findBy in map '%s' by e-mail '%s' and password: `%s'\n", mapId, email, password);
            KNodeModel.findOne({ 'dataContent.email': email, mapId: mapId }, found);
            break;
    }
}

// curl -v -H "Content-Type: application/json" -X PUT -d '{"name": "Hello World Pt23", "iAmId": 5, "visual": {"isOpen": false}}' http://127.0.0.1:8888/aaa/one/55266618cce5af993fe8675f
exports.update = function(req, res) {
    //console.log("[modules/aaa.js:update] req.body: %s", JSON.stringify(req.body));

    var data = req.body;
    var id = req.params.searchParam;

    /* this is wrong because it creates default-values populated object (including id) first and then populate it with paremeter object:
     * var whoAmI = new KNodeModel(req.body);
     */

    console.log("[modules/aaa.js:update] id : %s", id);
    console.log("[modules/aaa.js:update] data, : %s", JSON.stringify(data));
    // console.log("[modules/aaa.js:update] whoAmI.toObject(), : %s", JSON.stringify(whoAmI.toObject());
    delete data._id;
    //TODO: check this: multi (boolean) whether multiple documents should be updated (false)
    //TODO: fix: numberAffected vraca 0, a raw vraca undefined. pitanje je da li su ispravni parametri callback f-je

    data.updatedAt = new Date(); //TODO: workaround for hook "schema.pre('update',...)" not working
    KNodeModel.update({ _id: id }, data, function(err, raw) {
        if (err) throw err;
        console.log('The raw response from Mongo was ', raw);
        data._id = id;
        resSendJsonProtected(res, { success: true, data: data, accessId: accessId });
    });

    // KNodeModel.findByIdAndUpdate(id , data, { /* multi: true */ }, function (err, numberAffected, raw) {
    // 	  if (err) throw err;
    // 	  console.log('The number of updated documents was %d', numberAffected);
    // 	  console.log('The raw response from Mongo was ', raw);
    // 	  resSendJsonProtected(res, {success: true, data: data, accessId : accessId});
    // });
}

// curl -v -H "Content-Type: application/json" -X DELETE http://127.0.0.1:8888/aaa/one/551bdcda1763e3f0eb749bd4
exports.destroy = function(req, res) {
    //TODO: should we destroy edges connected to this whoAmI? or is it done automatically? or error is risen?
    var type = req.params.type;
    var dataId = req.params.searchParam;
    console.log("[modules/aaa.js:destroy] dataId:%s, type:%s, req.body: %s", dataId, type, JSON.stringify(req.body));

    switch (type) {
        case 'one':
            KNodeModel.findByIdAndRemove(dataId, function(err) {
                if (err) throw err;
                var data = { id: dataId };
                resSendJsonProtected(res, { success: true, data: data, accessId: accessId });
            });
            break;
            // case 'in-map': //all whoAmIs connected to whoAmI.id
            // 	console.log("[modules/aaa.js:destroy] deleting whoAmIs in map %s", dataId);
            // 	KNodeModel.remove({'mapId': dataId}, function (err) {
            // 		if (err){
            // 			console.log("[modules/aaa.js:destroy] error:" + err);
            // 			throw err;
            // 		}
            // 		var data = {id:dataId};
            // 		console.log("[modules/aaa.js:destroy] data:" + JSON.stringify(data));
            // 		resSendJsonProtected(res, {success: true, data: data, accessId : accessId});
            // 	});
            // 	break;
    }
};