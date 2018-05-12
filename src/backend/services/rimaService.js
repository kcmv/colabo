"use strict";
exports.__esModule = true;
var kNodeService_1 = require("../services/kNodeService");
//export public class CoLaboArthonService {
var RimaService = /** @class */ (function () {
    function RimaService(MAP_ID, AUTHOR_ID) {
        this.MAP_ID = MAP_ID;
        this.AUTHOR_ID = AUTHOR_ID;
        this.kNodeService = new kNodeService_1.KNodeService();
    }
    RimaService.prototype.createNewUser = function (newUserData, callback) {
        if (callback === void 0) { callback = null; }
        console.log("[createNewUser] newUserData: ", newUserData);
        newUserData.type = RimaService.TYPE_USER;
        newUserData.mapId = this.MAP_ID;
        newUserData.iAmId = this.AUTHOR_ID;
        var result = this.kNodeService.createNewNode(newUserData, callback);
        return "RimaService:" + result;
        // function newUserCreated(newUser:KNode, newUserEdge:KEdge){
        //   this.users.push(newUser);
        //   if(callback) callback(newUser, newUserEdge);
        // }
    };
    RimaService.prototype.addReply = function (referenceId, newData, callback) {
        if (callback === void 0) { callback = null; }
        console.log("[addReply] newData: ", newData);
        newData.type = //RimaService.TYPE_USER;
            newData.mapId = this.MAP_ID;
        //newData.iAmId = this.AUTHOR_ID;
        //TODO: find the node to be related
        //TODO create an edge and connect its source to the referenceId-node and target to this newData-node
        //TODO new Human ID (=ß maxiId+1) to be added and returned
        var result = this.kNodeService.createNewNode(newData);
        return "CoLaboArthon: Your reply is auccesfully saved";
        // function newNodeCreated(newUser:KNode, newUserEdge:KEdge){
        //   this.users.push(newUser);
        //   if(callback) callback(newUser, newUserEdge);
        // }
    };
    RimaService.prototype.getNodeByHumanID = function (humanID, callback) {
        if (callback === void 0) { callback = null; }
        return this.kNodeService.findByDataContent('humanID', humanID, callback);
    };
    RimaService.prototype.getUserByPhoneNo = function (phoneNo, callback) {
        if (callback === void 0) { callback = null; }
        return this.kNodeService.findByDataContent('phoneNo', phoneNo, callback);
    };
    RimaService.TYPE_USER = "rima.user";
    return RimaService;
}());
exports.RimaService = RimaService;
