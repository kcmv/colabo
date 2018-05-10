"use strict";
exports.__esModule = true;
var MAP_ID = "5af39ce82843ddf04b459cb0";
//export public class CoLaboArthonService {
var CoLaboArthonService = /** @class */ (function () {
    function CoLaboArthonService() {
    }
    CoLaboArthonService.prototype.saveParticipant = function (name, background) {
        //this.createNewUser();
        return name + ":" + background;
    };
    CoLaboArthonService.prototype.createNewUser = function (newUserData, MAP_ID, callback) {
        if (callback === void 0) { callback = null; }
        console.log("[createNewUser] newUserData: ", newUserData);
        // this.nodeService.createNewUser(newUserData, newUserCreated.bind(this));
        function newUserCreated(newUser, newUserEdge) {
            this.users.push(newUser);
            if (callback)
                callback(newUser, newUserEdge);
        }
    };
    return CoLaboArthonService;
}());
exports.CoLaboArthonService = CoLaboArthonService;
