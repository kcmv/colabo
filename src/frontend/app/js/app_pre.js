"use strict";
var upgrade_adapter_1 = require('./upgrade_adapter');
var login_status_component_1 = require('../components/login/login-status-component');
var main_1 = require('../components/knalledgeMap/main');
angular.module('knalledgeMapDirectives')
    .directive({
    'loginStatus': upgrade_adapter_1.upgradeAdapter.downgradeNg2Component(login_status_component_1.LoginStatusComponent)
});
angular.module('KnAllEdgeNg2', ['knalledgeMapDirectives'])
    .directive({
    'knalledgeMapMain': upgrade_adapter_1.upgradeAdapter.downgradeNg2Component(main_1.KnalledgeMapMain)
});
//# sourceMappingURL=app_pre.js.map