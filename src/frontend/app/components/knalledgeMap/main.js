"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require('angular2/core');
var upgrade_adapter_1 = require('../../js/upgrade_adapter');
var KnalledgeMapMain = (function () {
    function KnalledgeMapMain() {
    }
    KnalledgeMapMain = __decorate([
        core_1.Component({
            selector: 'knalledge-map-main',
            directives: [
                upgrade_adapter_1.upgradeAdapter.upgradeNg1Component('knalledgeMap'),
                upgrade_adapter_1.upgradeAdapter.upgradeNg1Component('knalledgeMapTools'),
                upgrade_adapter_1.upgradeAdapter.upgradeNg1Component('ontovSearch'),
                upgrade_adapter_1.upgradeAdapter.upgradeNg1Component('rimaRelevantList'),
                upgrade_adapter_1.upgradeAdapter.upgradeNg1Component('knalledgeMapList')
            ],
            templateUrl: 'components/knalledgeMap/partials/main.tpl.html',
            styles: ["\n        .msg {\n            font-size: 0.5em;\n        }\n        .container{\n            margin: 5px;\n            border: 1px solid gray;\n        }\n    "]
        }), 
        __metadata('design:paramtypes', [])
    ], KnalledgeMapMain);
    return KnalledgeMapMain;
}());
exports.KnalledgeMapMain = KnalledgeMapMain;
//# sourceMappingURL=main.js.map