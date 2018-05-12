"use strict";
exports.__esModule = true;
// const RimaService = require('../services/rimaService').RimaService;
var rimaService_1 = require("../services/rimaService");
var MAP_ID = "5af39ce82843ddf04b459cb0";
var AUTHOR_ID = "556760847125996dc1a4a24f";
//export public class CoLaboArthonService {
var CoLaboArthonService = /** @class */ (function () {
    function CoLaboArthonService() {
        this.rimaService = new rimaService_1.RimaService(MAP_ID, AUTHOR_ID);
    }
    CoLaboArthonService.prototype.saveParticipant = function (name, occupation, phoneNo, callback) {
        if (callback === void 0) { callback = null; }
        var newUser = {
            name: name,
            isPublic: true,
            dataContent: {
                occupation: occupation,
                phoneNo: phoneNo
            }
        };
        var result = this.rimaService.createNewUser(newUser, callback);
        return "CoLaboArthonService:" + result;
    };
    CoLaboArthonService.prototype.saveReply = function (referenceHumanId, reply, phoneNo, callback) {
        if (callback === void 0) { callback = null; }
        var newData = {
            name: reply,
            isPublic: true,
            iAmId: null,
            dataContent: {
            // background: background
            }
        };
        var user = null;
        var referenceNode = null;
        this.rimaService.getUserByPhoneNo(phoneNo, userFound.bind(this));
        function replyAdded(reply, err) {
            if (reply === null) {
                callback(null, 'ERROR_IN_ADDING');
            }
            else {
                callback("Thank you for your reply! It's ID is " + reply.dataContent.humanID, null);
            }
        }
        function referenceNodeFound(referenceNodes) {
            if (referenceNodes === null || referenceNodes.length === 0) {
                //TODO: extract message and translate it
                var msg = "CoLaboArthon: Content with the ID " + referenceHumanId + ", that you are replying on, is not found";
                console.warn(msg);
                callback(msg, 'REFERENCED_NODE_NOT_FOUND');
            }
            else {
                referenceNode = referenceNodes[0];
                console.log("Found referenceNode  (" + referenceHumanId + ")'" + referenceNode.name + "' that user " + user.name + " is replying on");
                this.rimaService.addReply(referenceNode._id, newData, replyAdded.bind(this));
            }
        }
        function userFound(users) {
            //console.log('userFound:users',users);
            //console.log('typeof users', typeof users);
            if (users === null || users.length === 0) {
                //TODO: extract message and translate it
                var msg = "CoLaboArthon: You should regeister first and then send your reply. Do it by sending SMS in this form: 'REG your_name your_occupation'";
                console.warn(msg);
                callback(msg, 'REPLY_BY_NONREGISTERED_USER');
            }
            else {
                user = users[0];
                newData.iAmId = user._id;
                //console.log('found user:',user);
                //console.log(`Found user ${user.name} that is replying`);
                var referenceNode_1 = this.rimaService.getNodeByHumanID(referenceHumanId, referenceNodeFound.bind(this));
            }
        }
    };
    return CoLaboArthonService;
}());
exports.CoLaboArthonService = CoLaboArthonService;
