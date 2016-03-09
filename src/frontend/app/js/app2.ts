// https://github.com/angular/angular/blob/master/modules/angular2/src/upgrade/upgrade_adapter.ts
import {upgradeAdapter} from './upgrade_adapter';
// import {LoginStatusComponent} from '../components/login/login-status-component';
// import {KnalledgeMapMain} from '../components/knalledgeMap/main';

/// <reference path="../../../typings/browser/ambient/angular/angular.d.ts" />
/// <reference path="../../../typings/browser/ambient/angular-route/angular-route.d.ts" />


// angular.module('knalledgeMapDirectives')
//     .directive({
//         'loginStatus':
//             upgradeAdapter.downgradeNg2Component(LoginStatusComponent),
//         'knalledgeMapMain':
//             upgradeAdapter.downgradeNg2Component(KnalledgeMapMain)
//     });
// angular.module('KnAllEdgeApp')
//     .directive({
//         'loginStatus':
//             upgradeAdapter.downgradeNg2Component(LoginStatusComponent)
//     })
//     .directive({
//         'knalledgeMapMain':
//             upgradeAdapter.downgradeNg2Component(KnalledgeMapMain)
//     })
//     ;

upgradeAdapter.bootstrap(document.body, ['KnAllEdgeApp'], {strictDi: false});
