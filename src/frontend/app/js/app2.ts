// https://github.com/angular/angular/blob/master/modules/@angular/src/upgrade/upgrade_adapter.ts
import {upgradeAdapter} from './upgrade_adapter';

import {ROUTER_PROVIDERS} from '@angular/router-deprecated';

import {LoginStatusComponent} from '../components/login/login-status-component';
import {KnalledgeMapMain} from '../components/knalledgeMap/main';
import {MapsList} from '../components/mapsList/maps-list.component';
import {KnalledgeMapPolicyService} from '../components/knalledgeMap/knalledgeMapPolicyService';
import {KnalledgeMapViewService} from '../components/knalledgeMap/knalledgeMapViewService';
import {TopiChatReports} from '../components/topiChat/reports';
import {GlobalEmitterService} from '../components/collaboPlugins/globalEmitterService';
import {GlobalEmitterServicesArray} from '../components/collaboPlugins/globalEmitterServicesArray';
import {TopiChatConfigService} from '../components/topiChat/topiChatConfigService';
import {TopiChatService} from '../components/topiChat/topiChatService';
import {RequestService} from '../components/request/request.service';
import {ApprovalNodeService} from '../components/gardening/approval.node.service';
import {SuggestionService} from '../components/suggestion/suggestion.service';
import {ChangeService} from '../components/change/change.service';

// import {BroadcastManagerService} from '../components/collaboBroadcasting/broadcastManagerService';
import { MapInteraction } from './interaction/mapInteraction';

import { Injector } from '../components/utils/injector';
/// <reference path="../../../typings/browser/ambient/angular/angular.d.ts" />
/// <reference path="../../../typings/browser/ambient/angular-route/angular-route.d.ts" />


var topiChatServices = angular.module('topiChatServices');
topiChatServices
    .service('TopiChatConfigService', TopiChatConfigService)
    .service('TopiChatService', TopiChatService)
    ;

// injecting NG1 TS service into NG1 space
var requestServices = angular.module('requestServices');
requestServices
    .service('RequestService', RequestService)
    ;

var gardeningServices = angular.module('gardeningServices');
gardeningServices
    .service('ApprovalNodeService', ApprovalNodeService)
    ;

var suggestionServices = angular.module('suggestionServices');
suggestionServices
    .service('SuggestionService', SuggestionService)
    ;

// injecting NG1 TS service into NG1 space
var changeServices = angular.module('changeServices');
changeServices
    .service('ChangeService', ChangeService)
    ;

// registering ng2 directives in ng1 space
// angular.module('KnAllEdgeNg2', ['knalledgeMapDirectives']);

angular.module('knalledgeMapDirectives')
     .directive({
        'knalledgeMapMain':
            upgradeAdapter.downgradeNg2Component(KnalledgeMapMain)
    })
    .directive({
       'topichatReports':
           upgradeAdapter.downgradeNg2Component(TopiChatReports)
   })
   .directive({
       'loginStatus':
           upgradeAdapter.downgradeNg2Component(LoginStatusComponent)
   })
   .directive({
      'mapsList':
          upgradeAdapter.downgradeNg2Component(MapsList)
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
 // .service('BroadcastManagerService', BroadcastManagerService)
  ;

// upgrading ng1 services into ng2 space
upgradeAdapter.upgradeNg1Provider('KnAllEdgeRealTimeService');
upgradeAdapter.upgradeNg1Provider('RimaService');
upgradeAdapter.upgradeNg1Provider('KnalledgeMapService');
upgradeAdapter.upgradeNg1Provider('KnalledgeMapVOsService');
// upgradeAdapter.upgradeNg1Provider('BroadcastManagerService');
upgradeAdapter.upgradeNg1Provider('TopiChatConfigService');
upgradeAdapter.upgradeNg1Provider('TopiChatService');
upgradeAdapter.upgradeNg1Provider('GlobalEmitterServicesArray');
upgradeAdapter.upgradeNg1Provider('RequestService');
upgradeAdapter.upgradeNg1Provider('ApprovalNodeService');
upgradeAdapter.upgradeNg1Provider('SuggestionService');
upgradeAdapter.upgradeNg1Provider('ChangeService');

// upgradeAdapter.addProvider(GlobalEmitterService);
// upgradeAdapter.upgradeNg1Provider(GlobalEmitterService);
// upgradeAdapter.addProvider(GlobalEmitterService);

// knalledgeMapServicesModule
//     .service('GlobalEmitterServicesArray', upgradeAdapter.downgradeNg2Provider(GlobalEmitterServicesArray));

// upgrading ng1 services (written in TS) into ng2 space
upgradeAdapter.upgradeNg1Provider('KnalledgeMapPolicyService');
upgradeAdapter.upgradeNg1Provider('KnalledgeMapViewService');


var injector:Injector = new Injector();
injector.addPath("collaboPlugins.globalEmitterServicesArray", GlobalEmitterServicesArray);
injector.addPath("collaboPlugins.globalEmitterService", GlobalEmitterService);
injector.addPath("utils.globalEmitterService", Injector);
injector.addPath("interaction.MapInteraction", MapInteraction);

angular.module('Config')
	.constant("injector", injector)
;

// console.log('GOTOVO ng2 a');

// bootstrapping app
upgradeAdapter.bootstrap(document.body, ['KnAllEdgeApp'], {strictDi: false});

// console.log('GOTOVO ng2 b');
