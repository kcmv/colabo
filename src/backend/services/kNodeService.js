"use strict";
exports.__esModule = true;
//export public class KNodeService {
var KNodeService = /** @class */ (function () {
    function KNodeService(MAP_ID) {
        this.MAP_ID = MAP_ID;
    }
    KNodeService.prototype.createNewNode = function (newUserData) {
        return "KNodeService:" + newUserData;
    };
    return KNodeService;
}());
exports.KNodeService = KNodeService;
