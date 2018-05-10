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
    //TODO: maxiId
    //TODO create in DB node for replies
    CoLaboArthonService.prototype.getNodeByHumanID = function () {
        return null;
    };
    CoLaboArthonService.prototype.saveParticipant = function (name, background, callback) {
        var newUser = {
            name: name,
            isPublic: true,
            dataContent: {
                background: background
            }
        };
        var result = this.rimaService.createNewUser(newUser, callback);
        return "CoLaboArthonService:" + result;
    };
    return CoLaboArthonService;
}());
exports.CoLaboArthonService = CoLaboArthonService;
