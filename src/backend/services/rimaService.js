"use strict";
exports.__esModule = true;
//export public class CoLaboArthonService {
var RimaService = /** @class */ (function () {
    function RimaService(MAP_ID) {
        this.MAP_ID = MAP_ID;
    }
    RimaService.prototype.createNewUser = function (newUserData, callback) {
        if (callback === void 0) { callback = null; }
        console.log("[createNewUser] newUserData: ", newUserData);
        return "" + newUserData;
        // this.nodeService.createNewUser(newUserData, newUserCreated.bind(this));
        function newUserCreated(newUser, newUserEdge) {
            this.users.push(newUser);
            if (callback)
                callback(newUser, newUserEdge);
        }
    };
    return RimaService;
}());
exports.RimaService = RimaService;
