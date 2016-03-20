// https://github.com/angular/angular/blob/master/modules/angular2/src/upgrade/upgrade_adapter.ts
import {upgradeAdapter} from './upgrade_adapter';
import {LoginStatusComponent} from '../components/login/login-status-component';
import {KnalledgeMapMain} from '../components/knalledgeMap/main';
import {KnalledgeMapPolicyService} from '../components/knalledgeMap/knalledgeMapPolicyService';
import {KnalledgeMapViewService} from '../components/knalledgeMap/knalledgeMapViewService';
import {TopiChatReports} from '../components/topiChat/reports';
// import {GlobalEmitterService} from '../components/collaboPlugins/globalEmitterService';
import {GlobalEmitterServicesArray} from '../components/collaboPlugins/globalEmitterServicesArray';
import {TopiChatService} from '../components/topiChat/topiChatService';

/// <reference path="../../../typings/browser/ambient/angular/angular.d.ts" />
/// <reference path="../../../typings/browser/ambient/angular-route/angular-route.d.ts" />


// registering ng2 directives in ng1 space
angular.module('knalledgeMapDirectives')
    .directive({
        'loginStatus':
            upgradeAdapter.downgradeNg2Component(LoginStatusComponent)
        // ,
        // 'knalledgeMapMain':
        //     upgradeAdapter.downgradeNg2Component(KnalledgeMapMain)
    })
    ;
var topiChatServices = angular.module('topiChatServices');
topiChatServices
    .service('TopiChatService', TopiChatService);

angular.module('KnAllEdgeNg2', ['knalledgeMapDirectives'])
     .directive({
        'knalledgeMapMain':
            upgradeAdapter.downgradeNg2Component(KnalledgeMapMain)
    })
    .directive({
       'topichatReports':
           upgradeAdapter.downgradeNg2Component(TopiChatReports)
   })
    ;

// In Angular 2, we have to add a provider configuration for the component’s injector,
// but since we don’t bootstrap using Angular 2, there’s no way to do so.
// ngUpgrade allows us to add a provider using the addProvider() method to solve this scenario.
// upgradeAdapter.addProvider(GlobalEmitterServicesArray);

// registering ng1 services (written in TypeScript) into/as ng1 services
var knalledgeMapServicesModule = angular.module('knalledgeMapServices');
knalledgeMapServicesModule
  .service('KnalledgeMapPolicyService', KnalledgeMapPolicyService)
  .service('KnalledgeMapViewService', KnalledgeMapViewService)
 // .service('GlobalEmitterService', upgradeAdapter.downgradeNg2Provider(GlobalEmitterService))
 // .service('GlobalEmitterService', GlobalEmitterService)
 .service('GlobalEmitterServicesArray', GlobalEmitterServicesArray)
  ;

upgradeAdapter.upgradeNg1Provider('KnalledgeMapViewService');
upgradeAdapter.upgradeNg1Provider('GlobalEmitterServicesArray');
upgradeAdapter.upgradeNg1Provider('TopiChatService');
// upgradeAdapter.addProvider(GlobalEmitterService);
// upgradeAdapter.upgradeNg1Provider(GlobalEmitterService);

// knalledgeMapServicesModule
//     .service('GlobalEmitterServicesArray', upgradeAdapter.downgradeNg2Provider(GlobalEmitterServicesArray));

// upgrading ng1 services (written in TS) into ng2 space
upgradeAdapter.upgradeNg1Provider('KnalledgeMapPolicyService');

// bootstrapping app
upgradeAdapter.bootstrap(document.body, ['KnAllEdgeApp'], {strictDi: false});
