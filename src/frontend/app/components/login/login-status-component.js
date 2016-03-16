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
var LoginStatusComponent = (function () {
    function LoginStatusComponent() {
    }
    LoginStatusComponent = __decorate([
        core_1.Component({
            selector: 'login-status', template: "\n        <div class=\"container\">\n            <span class='msg'>ng2-component:</span>\n            <h2>User - mPrinc</h2>\n            <div><label>IAm: </label>5</div>\n        </div>\n    ",
            styles: ["\n        .msg {\n            font-size: 0.5em;\n        }\n        .container{\n            margin: 5px;\n            border: 1px solid gray;\n        }\n    "]
        }), 
        __metadata('design:paramtypes', [])
    ], LoginStatusComponent);
    return LoginStatusComponent;
}());
exports.LoginStatusComponent = LoginStatusComponent;
//# sourceMappingURL=login-status-component.js.map