"use strict";
exports.__esModule = true;
var KNodeModule = require("../modules/kNode");
//export public class KNodeService {
var KNodeService = /** @class */ (function () {
    function KNodeService() {
    }
    KNodeService.prototype.createNewNode = function (newUserData) {
        console.log("KNodeModule: ", KNodeModule);
        //TODO should 'newUserData' be 'translated' to the server mKNode format or cleaned at least?
        KNodeModule._create(newUserData);
        return "KNodeService:" + newUserData;
    };
    return KNodeService;
}());
exports.KNodeService = KNodeService;
