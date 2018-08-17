"use strict";
exports.__esModule = true;
var KNodeModule = require("@colabo-knalledge/b-knalledge-core/modules/kNode");
//export public class KNodeService {
var KNodeService = /** @class */ (function () {
    function KNodeService() {
    }
    KNodeService.prototype.createNewNode = function (newData, callback) {
        if (callback === void 0) { callback = null; }
        function maxHumanIDFound(val, err) {
            if (err === null) {
                console.log('maxHumanIDFound::val', val);
                if (val === null) {
                    val = 0;
                }
                console.log('newData', newData);
                if (!newData.dataContent) {
                    newData.dataContent = {};
                }
                newData.dataContent.humanID = ++val;
                console.log('maxHumanIDFound::humanID:', val);
                //TODO shouldn't newData be 'translated' into server format or cleaned at least?
                KNodeModule._create(newData, callback);
            }
            else {
                callback(null, err);
            }
        }
        //console.log("KNodeModule: ", KNodeModule);
        //this should be added to Model or as a hook as we did for 'date of update'
        this.findMaxVal('dataContent.humanID', maxHumanIDFound); // this
    };
    KNodeService.prototype.findByDataContent = function (name, value, callback) {
        if (callback === void 0) { callback = null; }
        KNodeModule._index(name, value, 'in_content_data', callback);
    };
    KNodeService.prototype.findMaxVal = function (name, callback) {
        if (callback === void 0) { callback = null; }
        KNodeModule._index(name, null, 'max_val', callback);
    };
    return KNodeService;
}());
exports.KNodeService = KNodeService;
