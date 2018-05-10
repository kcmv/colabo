"use strict";
exports.__esModule = true;
var KNodeModule = require("../modules/kNode");
//export public class KNodeService {
var KNodeService = /** @class */ (function () {
    function KNodeService() {
    }
    KNodeService.prototype.createNewNode = function (newUserData, callback) {
        if (callback === void 0) { callback = null; }
        console.log("KNodeModule: ", KNodeModule);
        KNodeModule._create(newUserData, callback);
        return "KNodeService:" + newUserData;
    };
    return KNodeService;
}());
exports.KNodeService = KNodeService;
