"use strict";
exports.__esModule = true;
var KNodeModule = require("../modules/kNode");
//export public class KNodeService {
var KNodeService = /** @class */ (function () {
    function KNodeService() {
    }
    KNodeService.prototype.createNewNode = function (newUserData) {
        console.log("KNodeModule: ", KNodeModule);
        KNodeModule._create(newUserData);
        return "KNodeService:" + newUserData;
    };
    return KNodeService;
}());
exports.KNodeService = KNodeService;
