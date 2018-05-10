"use strict";
exports.__esModule = true;
var kNodeService_1 = require("../services/kNodeService");
//export public class CoLaboArthonService {
var RimaService = /** @class */ (function () {
    function RimaService(MAP_ID) {
        this.MAP_ID = MAP_ID;
        this.kNodeService = new kNodeService_1.KNodeService(this.MAP_ID);
    }
    RimaService.prototype.createNewUser = function (newUserData, callback) {
        if (callback === void 0) { callback = null; }
        console.log("[createNewUser] newUserData: ", newUserData);
        var result = this.kNodeService.createNewNode(newUserData);
        return "RimaService:" + result;
        function newUserCreated(newUser, newUserEdge) {
            this.users.push(newUser);
            if (callback)
                callback(newUser, newUserEdge);
        }
    };
    return RimaService;
}());
exports.RimaService = RimaService;
