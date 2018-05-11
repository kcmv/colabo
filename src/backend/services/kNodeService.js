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
        //TODO shouldn't newUserData be 'translated' into server format or cleaned at least?
        KNodeModule._create(newUserData, callback);
        return "KNodeService:" + newUserData;
    };
    KNodeService.prototype.findByDataContent = function (name, value, callback) {
        if (callback === void 0) { callback = null; }
        KNodeModule._index(name, value, 'in_content_data', callback);
        return true;
    };
    return KNodeService;
}());
exports.KNodeService = KNodeService;
