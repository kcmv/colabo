import {Component, Inject, OnInit, ViewChild} from '@angular/core';
import {upgradeAdapter} from '../../js/upgrade_adapter';
import {MD_SIDENAV_DIRECTIVES} from '@angular2-material/sidenav';
// import {LoginStatusComponent} from '../login/login-status-component';
// import {Media, MdContent, MdButton} from 'ng2-material';
import {MATERIAL_DIRECTIVES, Media, MdDialog} from "ng2-material";
import {MdToolbar} from '@angular2-material/toolbar';
import {InfoForDialog} from '../../js/interaction/infoForDialog';
//import {OVERLAY_PROVIDERS} from '@angular2-material/core/overlay/overlay';
// http://stackoverflow.com/questions/35533783/angular2-unable-to-navigate-to-url-using-location-gourl

import { Router, ROUTER_DIRECTIVES} from '@angular/router';

import {KnalledgeMapTools} from './tools';
import {KnalledgeMapPolicyService} from './knalledgeMapPolicyService';
import {KnalledgeMapViewService} from './knalledgeMapViewService';
// import {RequestService} from '../request/request.service';
import {GlobalEmitterServicesArray} from '../collaboPlugins/GlobalEmitterServicesArray';
import {MediaShowComponent} from '../mediaShow/mediaShow.component';
import {BottomPanel} from '../bottomPanel/bottomPanel';
import {UserDialogComponent} from '../rima/user-dialog-component';

import {ChangeService} from '../change/change.service';

declare var window;
declare var Config;

// import {DbAuditService} from './dbAudit.service';
// import {Change} from '../change/change';
// import {ChangeService} from "../change/change.service";

// TODO: probable remove later, this is just to trigger starting the service
// import {BroadcastManagerService} from '../collaboBroadcasting/broadcastManagerService';

/**
 * Directive that handles the main KnAllEdge or rather CollaboFramework user interface
 *
 * Selector: `knalledge-map-main`
 * @class KnalledgeMapMain
 * @memberof knalledge.knalledgeMap
 * @constructor
*/

// @RouteConfig([
//     {
//         path: "/",
//         name: "root",
//         redirectTo: ["/Home"]
//     },
//
//     {
//         path: "/maps",
//         name: "Maps",
//         // component: HomeComponent,
//         redirectTo: ["/maps"]
//      useAsDefault: true
//  },
//     {path: '/disaster', name: 'Asteroid', redirectTo: ['CrisisCenter', 'CrisisDetail', {id:3}]}
// ])
//

import {PluginsPreloader} from '../collaboPlugins/pluginsPreloader';

var componentDirectives = [
    MATERIAL_DIRECTIVES,
    MD_SIDENAV_DIRECTIVES,
    ROUTER_DIRECTIVES,
    MdToolbar,
    // MdContent, MdButton,
    //   LoginStatusComponent,
    upgradeAdapter.upgradeNg1Component('knalledgeMap'),
    //  upgradeAdapter.upgradeNg1Component('knalledgeMapTools'),
    upgradeAdapter.upgradeNg1Component('knalledgeMapList'),
//  upgradeAdapter.upgradeNg1Component('ibisTypesList'),
    KnalledgeMapTools,
    MediaShowComponent,
    BottomPanel,
    UserDialogComponent
];

PluginsPreloader.addDirectivesDependenciesForComponent('knalledgeMap.Main', componentDirectives);

@Component({
    selector: 'knalledge-map-main',
    moduleId: module.id,
    templateUrl: 'partials/main.tpl.html',
    providers: [
        // MATERIAL_PROVIDERS,
      //  OVERLAY_PROVIDERS,
        // DbAuditService,
        // ChangeService
        // provideRouter
        // RequestService
        // ROUTER_PROVIDERS
        // BrainstormingService
    ],
    directives: componentDirectives,
    // necessary for having relative paths for templateUrl
    // http://schwarty.com/2015/12/22/angular2-relative-paths-for-templateurl-and-styleurls/
    // t_emplateUrl: 'components/knalledgeMap/partials/main.tpl.html',
    styles: [`

    `]
})

export class KnalledgeMapMain implements OnInit{
    userUrl: String = "www.CollaboScience.com"; //TODO: CF?!
    policyConfig: any;
    viewConfig: any;
    public pluginsConfig: any;
    topPanelVisible: boolean = true;
    status: String;
    navigator = window.navigator;
    checkConnectionFailed: boolean = false;
    public connectivityIssues: boolean = false;
    public info:InfoForDialog = new InfoForDialog();
    private rimaService;
    private knalledgeMapVOsService;
    private PRESENTER_CHANGED: string = "PRESENTER_CHANGED";
    private SHOW_INFO: string = "SHOW_INFO";

    @ViewChild('infoDialog') private infoDialog: MdDialog;

    constructor(
        // public router: Router,
        @Inject('KnalledgeMapViewService') knalledgeMapViewService: KnalledgeMapViewService,
        @Inject('KnalledgeMapPolicyService') public knalledgeMapPolicyService: KnalledgeMapPolicyService,
        @Inject('Plugins') private Plugins,
        @Inject('RimaService') private RimaService,
        @Inject('KnalledgeMapVOsService') _KnalledgeMapVOsService_,
        @Inject('GlobalEmitterServicesArray') private globalEmitterServicesArray: GlobalEmitterServicesArray//,
        // public dbAuditService: DbAuditService
        ) {
        console.log('[KnalledgeMapMain] loaded');
        this.viewConfig = knalledgeMapViewService.get().config;
        this.policyConfig = knalledgeMapPolicyService.get().config;
        this.pluginsConfig = Config.Plugins;
        try {
            this.rimaService = RimaService;
            // * @param  {rima.rimaServices.RimaService}  RimaService
            //   this.rimaService = this.Plugins.puzzles.rima.config.rimaService.available ?
            //   this.$injector.get('RimaService') : null;
        } catch (err) {
            console.warn(err);
        }

        this.knalledgeMapVOsService = _KnalledgeMapVOsService_;
        // this.broadcastManagerService = broadcastManagerService;
        // globalEmitterServicesArray.register('KnalledgeMapMain');
        // globalEmitterServicesArray.get().subscribe('KnalledgeMapMain', (data) => alert("[KnalledgeMapMain]:"+data));
        // globalEmitterServicesArray.broadcast('KnalledgeMapMain', "Hello from KnalledgeMaKnalledgeMapMainpTools!");
        //
        this.globalEmitterServicesArray.register(ChangeService.CONNECTIVITY_ISSUE_EVENT);
        this.globalEmitterServicesArray.get(ChangeService.CONNECTIVITY_ISSUE_EVENT).subscribe('KnalledgeMapMain',
        this.displayConnectivityIssues.bind(this));
        this.globalEmitterServicesArray.register(this.PRESENTER_CHANGED);
        this.globalEmitterServicesArray.register(this.SHOW_INFO);
        this.globalEmitterServicesArray.get(this.SHOW_INFO).subscribe('KnalledgeMapMain',
        this.showInfo.bind(this));
    };

    // testMain() {
      // this.dbAuditService.hello();
      // this.dbAuditService.getOne('577d5cb55be86321489aacaa')
      //     .subscribe(
      //     audit => alert("audit: " +
      //         JSON.stringify(audit)),
      //     error => alert("error: " +
      //         JSON.stringify(error))
      //     );
      //
      // //POST:
      // var change = new Change();
      // change.value = {name:'from NG2 TS service'};
      // this.dbAuditService.create(change)
      //     .subscribe(
      //     result => alert("result: " +
      //         JSON.stringify(result)),
      //     error => alert("error: " +
      //         JSON.stringify(error))
      //     );
    // }

    customClose(interesting: boolean) {
        if (interesting) {
            this.status = 'That article was interesting.';
        } else {
            this.status = 'Look for something else.';
        }
    }

    isOffline(): boolean{
      return !this.navigator.onLine || this.checkConnectionFailed;
    }

    userPanel():void{
      if(confirm("You are about to leave this map an go to the user panel ...")){
        this.go('login');
      }
    }

    displayConnectivityIssues(error: any):void {
      this.connectivityIssues = true;
      var that = this;
      switch(error.type){
          case ChangeService.CONNECTIVITY_ISSUE_TYPE_LATENCY_WARNING_SINGLE:
            setTimeout(function(){
              that.connectivityIssues = false;
            }, 7000);
          break;

          case ChangeService.CONNECTIVITY_ISSUE_TYPE_CHECK_CONNECTION_FAILED:
            this.checkConnectionFailed = true;
          break;

          case ChangeService.CONNECTIVITY_ISSUE_TYPE_CHECK_CONNECTION_SUCCEEDED:
            this.checkConnectionFailed = false;
      }
    }

    navigateBack() {
        //http://localhost:5556/#/map/id/577e948861ab114d16732cb9?node_id=577e948861ab114d16732cda
        //->
        //http://localhost:5556/#/mcmap/id/577e948861ab114d16732cb9
        var mapRoute: string = 'mcmap'; //Config.Plugins.puzzles.mapsList.config.openMap.routes[0].route;
        var mapId: string = this.knalledgeMapVOsService.map._id;
        window.location.href = "#/" + mapRoute + "/id/" + mapId;
    }

    showInfo(info:InfoForDialog):void{
      this.info = info;
      // this.info.title = info.title ? info.title : "";
      // this.info.message = info.message ? info.message : "";
      // this.info.buttons = info.buttons ? info.buttons : "ok";
      this.infoDialog.show();
    }

    // get infoMessage(): string {
    //   return this.info? this.info.message : "";
    // }

    turnOffEditingNode(event) {
        this.viewConfig.states.editingNode = null;
    }

    getMapName(): any {
        return this.knalledgeMapVOsService.map ? this.knalledgeMapVOsService.map.name : 'loading ...';
    }

    followBroadcast(value: boolean): any {
        this.policyConfig.broadcasting.receiveNavigation = value;
    }

    broadcast(value: boolean): any {
        this.globalEmitterServicesArray.get(this.PRESENTER_CHANGED)
        .broadcast('KnalledgeMapMain', {'user': this.rimaService.getWhoAmIid(), 'value': value});
    }

    toggleTopPanel(): any {
        this.viewConfig.panels.topPanel.visible = !this.viewConfig.panels.topPanel.visible;
    }

    amILoggedIn() : boolean{
      return this.rimaService && this.rimaService.getWhoAmI() !== null;
    }

    ngOnInit() {
      if(!this.amILoggedIn()){
        window.alert("Please, log in to be albe to follow the session");
      }
    }

    get following():string{
      if(this.policyConfig.session && this.policyConfig.session.presenter){
        if(this.policyConfig.session.presenter._id === this.rimaService.getWhoAmIid()){
          return "you are presenting";
        }else{
        if(this.policyConfig.broadcasting.receiveNavigation){
              return "following " + this.policyConfig.session.presenter.displayName;
          }else{
            return "you can follow " + this.policyConfig.session.presenter.displayName;
          }
        }
      }else{
        return "";
      }
    }

    getLoggedInUserName(): any {
        var whoAmI = this.rimaService ?
            this.rimaService.getWhoAmI() :
            this.Plugins.puzzles.rima.config.rimaService.ANONYMOUS_USER_ID;
        var name = this.rimaService ?
            this.rimaService.getNameFromUser(whoAmI) :
            this.Plugins.puzzles.rima.config.rimaService.ANONYMOUS_USER_NAME;
        return name;
    }
    getActiveUserName(): any {
        var whoAmI = this.rimaService.getActiveUser();
        var name = this.rimaService.getNameFromUser(whoAmI);
        return name;
    }
    // hasMedia(breakSize: string): boolean {
    //     return Media.hasMedia(breakSize);
    // }
    showContactOptions: Function = function(event) {
        return;
    };

    public go(path: string) {
        // TODO: not implemented
        // alert("Not implemented");
        // this.router.navigate(['/hero', hero.id]);
        //I assumed your `/home` route name is `Home`
        // this._router.navigate([path]); //this will navigate to Home state.
        //below way is to navigate by URL
        //this.router.navigateByUrl('/home')
        // https://angular.io/docs/ts/latest/api/common/index/Location-class.html
        // this.location.go('#/' + path);
        window.location.href = '#/' + path;
    };
}
