// import {MATERIAL_DIRECTIVES} from 'ng2-material';

// https://github.com/angular/angular/blob/master/modules/@angular/src/upgrade/upgrade_adapter.ts
import {upgradeAdapter, moduleProviders, moduleDeclarations, moduleImports} from './upgrade_adapter';

//import {DemoPuzzleService} from '../components/demoPuzzle/demoPuzzle.service';
import {LoginStatusComponent} from '../components/login/login-status-component';
import {KnalledgeMapMain} from '../components/knalledgeMap/main';
import {MapsList} from '../components/mapsList/maps-list.component';
import {KnalledgeMapPolicyService} from '../components/knalledgeMap/knalledgeMapPolicyService';
import {KnalledgeMapViewService} from '../components/knalledgeMap/knalledgeMapViewService';
import {TopiChatReports} from '../components/topiChat/reports';
import {GlobalEmitterService} from '../../dev_puzzles/puzzles/puzzles_core/code/puzzles/globalEmitterService';
import {GlobalEmitterServicesArray} from '../../dev_puzzles/puzzles/puzzles_core/code/puzzles/globalEmitterServicesArray';
import {TopiChatConfigService} from '../components/topiChat/topiChatConfigService';
import {TopiChatService} from '../components/topiChat/topiChatService';
import {RequestService} from '../components/request/request.service';
import {ApprovalNodeService} from '../components/gardening/approval.node.service';
import {SuggestionService} from '../components/suggestion/suggestion.service';

// import {MATERIAL_PROVIDERS} from 'ng2-material';
// import {provide} from '@angular/core';

// import { disableDeprecatedForms, provideForms } from '@angular/forms';

// import {BroadcastManagerService} from '../components/collaboBroadcasting/broadcastManagerService';

import {KNode} from '@colabo-knalledge/knalledge_core/code/knalledge/kNode';
import {KEdge} from '@colabo-knalledge/knalledge_core/code/knalledge/kEdge';

var n = new KNode();
var e = new KEdge();

import {MapInteraction} from '@colabo-knalledge/knalledge_view_enginee/code/interaction/mapInteraction';

var i = new MapInteraction(null, null);

import { Injector } from '../components/utils/injector';
var injector:Injector = new Injector();
/// <reference path="../../../typings/browser/ambient/angular/angular.d.ts" />
/// <reference path="../../../typings/browser/ambient/angular-route/angular-route.d.ts" />


// Loading external puzzles-containers dependencies
// like injecting services, providers, etc
import './pluginDependencies';
import {PluginsPreloader} from '../../dev_puzzles/puzzles/puzzles_core/code/puzzles/pluginsPreloader';
injector.addPath("puzzles.collaboPlugins.PluginsPreloader", PluginsPreloader);
declare var Config:any;
for(let puzzleName in Config.Plugins.external){
  let puzzleInfo = Config.Plugins.external[puzzleName];
  PluginsPreloader.loadServicesFromExternalPuzzleContainer(puzzleInfo);
}

/** used instead of
* import {MATERIAL_PROVIDERS} from 'ng2-material';
* because of the bug
* https://github.com/justindujardin/ng2-material/issues/271
*/
//upgradeAdapter.addProvider(provide(OVERLAY_CONTAINER_TOKEN, {useValue: createOverlayContainer()}));
// upgradeAdapter.addProvider(MATERIAL_PROVIDERS);

/** for Angular Forms:
* instead of
* `bootstrap(AppComponent, [
* disableDeprecatedForms(),
* provideForms()
* ])`
* that cannot be used until we bootstrap as Angular 2
*/
// upgradeAdapter.addProvider(disableDeprecatedForms());
// upgradeAdapter.addProvider(provideForms());

declare var angular;

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

import {ChangeService} from '../components/change/change.service';
// upgradeAdapter.addProvider(ChangeService);
var changeServices =
    angular.module('changeServices');
changeServices.
    service('ChangeService', upgradeAdapter.downgradeNg2Provider(ChangeService));

import {CollaboGrammarService} from '../components/collaboPlugins/CollaboGrammarService';
// not working :( since it injects class not service singletone instance
// injector.addPath("collaboPlugins.CollaboGrammarService", CollaboGrammarService);
// upgradeAdapter.addProvider(CollaboGrammarService);
var collaboServices =
    angular.module('collaboPluginsServices');
collaboServices.
    service('CollaboGrammarService', upgradeAdapter.downgradeNg2Provider(CollaboGrammarService));

import {BrainstormingService} from '../components/brainstorming/brainstorming.service';
// upgradeAdapter.addProvider(BrainstormingService);
var brainstormingServices = angular.module('brainstormingServices');
brainstormingServices
    .service('BrainstormingService', upgradeAdapter.downgradeNg2Provider(BrainstormingService))
    ;

import {SessionService} from '../components/session/session.service';
// upgradeAdapter.addProvider(SessionService);
var sessionServices = angular.module('sessionServices');
sessionServices
  .service('SessionService', upgradeAdapter.downgradeNg2Provider(SessionService))
  ;


// upgrading ng1 services into ng2 space
upgradeAdapter.upgradeNg1Provider('KnAllEdgeRealTimeService');
upgradeAdapter.upgradeNg1Provider('RimaService');
upgradeAdapter.upgradeNg1Provider('WhoAmIService');

upgradeAdapter.upgradeNg1Provider('CollaboPluginsService');

upgradeAdapter.upgradeNg1Provider('Plugins');
upgradeAdapter.upgradeNg1Provider('ENV');
// upgradeAdapter.upgradeNg1Provider('$injector');
upgradeAdapter.upgradeNg1Provider('KnalledgeMapService');
upgradeAdapter.upgradeNg1Provider('KnalledgeMapVOsService');
// upgradeAdapter.upgradeNg1Provider('BroadcastManagerService');
upgradeAdapter.upgradeNg1Provider('TopiChatConfigService');
upgradeAdapter.upgradeNg1Provider('TopiChatService');
upgradeAdapter.upgradeNg1Provider('GlobalEmitterServicesArray');
upgradeAdapter.upgradeNg1Provider('RequestService');
upgradeAdapter.upgradeNg1Provider('ApprovalNodeService');
upgradeAdapter.upgradeNg1Provider('SuggestionService');
upgradeAdapter.upgradeNg1Provider('IbisTypesService');

// upgradeAdapter.addProvider(GlobalEmitterService);
// upgradeAdapter.upgradeNg1Provider(GlobalEmitterService);
// upgradeAdapter.addProvider(GlobalEmitterService);

// knalledgeMapServicesModule
//     .service('GlobalEmitterServicesArray', upgradeAdapter.downgradeNg2Provider(GlobalEmitterServicesArray));

// upgrading ng1 services (written in TS) into ng2 space
upgradeAdapter.upgradeNg1Provider('KnalledgeMapPolicyService');
upgradeAdapter.upgradeNg1Provider('KnalledgeMapViewService');


// injector.addPath("collaboPlugins.globalEmitterServicesArray", GlobalEmitterServicesArray);
// injector.addPath("collaboPlugins.globalEmitterService", GlobalEmitterService);
injector.addPath("utils.globalEmitterService", Injector);

angular.module('Config')
	.constant("injector", injector)
;

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

import {RimaVotingForm} from '../components/rima/rimaVotingForm';
angular.module('rimaDirectives')
     .directive({
        'rimaVotingForm':
            upgradeAdapter.downgradeNg2Component(RimaVotingForm)
    })
    ;

// console.log('GOTOVO ng2 a');

// provide provider necessary in the DbAuditService service
// http://blog.thoughtram.io/angular/2015/10/24/upgrading-apps-to-angular-2-using-ngupgrade.html
// import { HTTP_PROVIDERS } from '@angular/http';
// upgradeAdapter.addProvider(HTTP_PROVIDERS);

// import { ActivatedRoute } from '@angular/router';
// upgradeAdapter.addProvider(ActivatedRoute);

// upgradeAdapter.addProvider(DemoPuzzleService);
// var demoPuzzleServices = angular.module('demoPuzzleServices');
// demoPuzzleServices
//     .service('DemoPuzzleService', upgradeAdapter.downgradeNg2Provider(DemoPuzzleService))
//     ;

import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import {HttpModule} from '@angular/http';
import {FormsModule} from '@angular/forms';
import {RouterModule} from '@angular/router';

import {MaterialModule} from '@angular/material';
// Bootstrap 4 + ng2
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {Ng2MaterialModule} from 'ng2-material';

// NG2 TS services
moduleProviders.push(ChangeService);
moduleProviders.push(CollaboGrammarService);
moduleProviders.push(BrainstormingService);
moduleProviders.push(SessionService);

// import {KnalledgeMapTools} from '../components/knalledgeMap/tools';
import {MainModule} from '../components/knalledgeMap/main';

import {MapsListModule} from '../components/mapsList/maps-list.component';
// NG1 components
// moduleDeclarations.push(upgradeAdapter.upgradeNg1Component('knalledgeMapsList'));
// NG2 components
moduleDeclarations.push(KnalledgeMapMain);

moduleImports.push(BrowserModule);
moduleImports.push(FormsModule);
moduleImports.push(HttpModule);
// moduleImports.push(RouterModule.forRoot(DEMO_APP_ROUTES));
// NOTE: it is removed in later versions
// see: https://github.com/angular/material2/blob/master/CHANGELOG.md#materialmodule
moduleImports.push(MaterialModule.forRoot());
moduleImports.push(Ng2MaterialModule.forRoot());
moduleImports.push(NgbModule.forRoot());

// CF modules
moduleImports.push(MainModule);
moduleImports.push(MapsListModule);

@NgModule({
  imports: moduleImports,
  declarations: moduleDeclarations,
  providers: moduleProviders,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  // entryComponents: [
  //   // DemoApp,
  // ],
})
export class AppModule {}

// patching fake NgModule with a real one
// TODO: NOTE: this part is implementation speciffic and needs to be checked against new angular versions
upgradeAdapter['ng2AppModule'] = AppModule;

// bootstrapping app
upgradeAdapter.bootstrap(document.body, ['KnAllEdgeApp'], {strictDi: false})
.ready((ref) => {
  // notify to the rest of the system that ng1 and ng2 ratrace is finished and
  // that services ara available so loading of the system can start
  var knalledgeMapPolicyService = ref.ng1Injector.get('KnalledgeMapPolicyService');
  // alert('KnalledgeMapPolicyService: ' + knalledgeMapPolicyService);
  knalledgeMapPolicyService.get().config.running.ng1ng2Ready = true;
});

// console.log('GOTOVO ng2 b');
