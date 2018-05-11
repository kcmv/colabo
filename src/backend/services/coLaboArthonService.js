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
            iAmId: null
            // dataContent: {
            //   background: background
            // }
        };
        var user = this.rimaService.getUserByPhoneNo(phoneNo, userFound);
        function userFound(user) {
            if (user === null) {
                //TODO: extract message and translate it
                console.warn("CoLaboArthon: You should regeister first and then send your reply. Do it by sending SMS in this form: 'REG your_name your_occupation'");
                callback("CoLaboArthon: You should regeister first and then send your reply. Do it by sending SMS in this form: 'REG your_name your_occupation'", 'REPLY_BY_NONREGISTERED_USER');
            }
            newData.iAmId = user.iAmId;
            var referenceNode = this.rimaService.getNodeByHumanID(referenceHumanId);
            if (referenceNode === null) {
                return "CoLaboArthon: Content with the " + referenceHumanId + ", that you are replying on, is not found";
            } //TODO: extract message and translate it
            newData.iAmId = user.iAmId;
            var result = this.rimaService.addReply(referenceNode._id, newData, callback);
            return "CoLaboArthon:" + result;
        }
        return true;
    };
    return CoLaboArthonService;
}());
exports.CoLaboArthonService = CoLaboArthonService;
