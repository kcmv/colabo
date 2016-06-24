// https://github.com/angular/angular/blob/master/modules/@angular/src/upgrade/upgrade_adapter.ts
import {upgradeAdapter} from './upgrade_adapter';
import {LoginStatusComponent} from '../components/login/login-status-component';
import {KnalledgeMapMain} from '../components/knalledgeMap/main';
import {MapsList} from '../components/mapsList/mapsList';

/// <reference path="../../../typings/browser/ambient/angular/angular.d.ts" />
/// <reference path="../../../typings/browser/ambient/angular-route/angular-route.d.ts" />


angular.module('knalledgeMapDirectives')
    .directive({
        'loginStatus':
            upgradeAdapter.downgradeNg2Component(LoginStatusComponent)
        // ,
        // 'knalledgeMapMain':
        //     upgradeAdapter.downgradeNg2Component(KnalledgeMapMain)
    });
angular.module('KnAllEdgeNg2', ['knalledgeMapDirectives'])
     .directive({
        'knalledgeMapMain':
            upgradeAdapter.downgradeNg2Component(KnalledgeMapMain)
    })
    ;
    angular.module('KnAllEdgeNg2', ['knalledgeMapDirectives'])
      .directive({
         'mapsList':
             upgradeAdapter.downgradeNg2Component(MapsList)
     })
    ;
