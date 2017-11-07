import {Component, Inject, OnInit, ViewChild, CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {Title} from '@angular/platform-browser';
import {upgradeAdapter} from '../../js/upgrade_adapter';
// import {LoginStatusComponent} from '../login/login-status-component';
import {Media, MdDialog} from "ng2-material";
import {InfoForDialog} from '../../js/interaction/infoForDialog';
// http://stackoverflow.com/questions/35533783/angular2-unable-to-navigate-to-url-using-location-gourl

import { Router} from '@angular/router';

import {KnalledgeMapTools} from './tools';
import {KnalledgeMapPolicyService} from './knalledgeMapPolicyService';
import {KnalledgeMapViewService} from './knalledgeMapViewService';
import {GlobalEmitterServicesArray} from '../collaboPlugins/GlobalEmitterServicesArray';
import {MediaShowComponent} from '../mediaShow/mediaShow.component';
import {BottomPanel, BottomPanelModule, bottomPanelComponentDirectives} from '../bottomPanel/bottomPanel';
import {UserDialogComponent} from '../rima/user-dialog-component';

import {ChangeService} from '../change/change.service';
// import {TopPanelModule} from '../topPanel/topPanel';
declare var window;
declare var Config;
declare var knalledge;
declare var dragscroll;

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


var componentProviders = [
    // MATERIAL_PROVIDERS,
    // provideRouter
    // ROUTER_PROVIDERS
];

import {PluginsPreloader} from '../collaboPlugins/pluginsPreloader';

import {RimaVotingForm} from '../rima/rimaVotingForm';

var componentDirectives = [
    upgradeAdapter.upgradeNg1Component('knalledgeMap'),
    // for knalledgeMapList and inside
    upgradeAdapter.upgradeNg1Component('knalledgeMapList'),
    RimaVotingForm,

    KnalledgeMapTools,
    MediaShowComponent,
    BottomPanel,
    UserDialogComponent
];

PluginsPreloader.addDirectivesDependenciesForComponent('knalledgeMap.Main', componentDirectives);

import {ToolsModule} from './tools';

import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {HttpModule} from '@angular/http';
import {FormsModule} from '@angular/forms';
import {RouterModule} from '@angular/router';

import {MaterialModule} from '@angular/material';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {Ng2MaterialModule} from 'ng2-material';

var moduleImports = [];

PluginsPreloader.addModulesDependenciesForComponent('knalledgeMap.Main', moduleImports);

moduleImports.push(BrowserModule);
moduleImports.push(FormsModule);
moduleImports.push(HttpModule);
// moduleImports.push(RouterModule.forRoot(DEMO_APP_ROUTES));
moduleImports.push(MaterialModule);
moduleImports.push(Ng2MaterialModule);
moduleImports.push(NgbModule);
moduleImports.push(ToolsModule);
moduleImports.push(BottomPanelModule);
// moduleImports.push(TopPanelModule);

let componentExportDirectives = [];
for (let i = 0; i < componentDirectives.length; i++) {
    componentExportDirectives.push(componentDirectives[i]);
}

for (let i = 0; i < bottomPanelComponentDirectives.length; i++) {
    componentExportDirectives.push(bottomPanelComponentDirectives[i]);
}

// needed for coevoludens, temporarily
// import {BrainstormingService} from '../brainstorming/brainstorming.service';
var moduleProviders = [
];

// @NgModule for tools
@NgModule({
    imports: moduleImports,
    providers: moduleProviders,
    exports: componentExportDirectives,
    declarations: componentDirectives,
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class MainModule { }

@Component({
    selector: 'knalledge-map-main',
    moduleId: module.id,
    templateUrl: 'partials/main.tpl.html',
    providers: componentProviders,
    // necessary for having relative paths for templateUrl
    // http://schwarty.com/2015/12/22/angular2-relative-paths-for-templateurl-and-styleurls/
    // t_emplateUrl: 'components/knalledgeMap/partials/main.tpl.html',
    styles: [`

    `]
})

export class KnalledgeMapMain implements OnInit {
    userUrl: String = "www.CollaboScience.com"; //TODO: CF?!
    policyConfig: any;
    viewConfig: any;
    public pluginsConfig: any;
    topPanelVisible: boolean = true;
    _isOptionsFullscreen:boolean = false;
    status: String;
    navigator = window.navigator;
    checkConnectionFailed: boolean = false;
    public connectivityIssues: boolean = false;
    public info: InfoForDialog = new InfoForDialog();
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
        @Inject('GlobalEmitterServicesArray') private globalEmitterServicesArray: GlobalEmitterServicesArray,
        private titleService:Title//,
        // @Inject('CollaboPluginsService') private collaboPluginsService
    ) {
        let that: KnalledgeMapMain = this;

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

        var modelLoadedEvent = "modelLoadedEvent";
				this.globalEmitterServicesArray.register(modelLoadedEvent);

        this.globalEmitterServicesArray.get(modelLoadedEvent).subscribe('KnalledgeMapMain', function(eventModel) {
          console.log("[KnalledgeMapMain::modelLoadedEvent] ModelMap  nodes(len: %d)",
            eventModel.map.nodes.length);
          console.log("[KnalledgeMapMain::modelLoadedEvent] ModelMap  edges(len: %d)",
            eventModel.map.edges.length);
            // https://angular.io/docs/ts/latest/api/platform-browser/index/Title-class.html
            that.titleService.setTitle(eventModel.properties.name);
        });
    }

    customClose(interesting: boolean) {
        if (interesting) {
            this.status = 'That article was interesting.';
        } else {
            this.status = 'Look for something else.';
        }
    }

    isOptionsFullscreen(): boolean {
        return this._isOptionsFullscreen;
    }

    toggleOptionsFullscreen() {
        this._isOptionsFullscreen = !this._isOptionsFullscreen;
    }

    isOffline(): boolean {
        return !this.navigator.onLine || this.checkConnectionFailed;
    }

    userPanel(): void {
        if (confirm("You are about to leave this map an go to the user panel ...")) {
            this.go('login');
        }
    }

    displayConnectivityIssues(error: any): void {
        this.connectivityIssues = true;
        var that = this;
        switch (error.type) {
            case ChangeService.CONNECTIVITY_ISSUE_TYPE_LATENCY_WARNING_SINGLE:
                setTimeout(function() {
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

    showInfo(info: InfoForDialog): void {
        this.info = info;
        // this.info.title = info.title ? info.title : "";
        // this.info.message = info.message ? info.message : "";
        // this.info.buttons = info.buttons ? info.buttons : "ok";
        this.infoDialog.show();
        //this.infoDialog.ngOnDestroy = function(){window.alert('closing');};
    }

    // infoDialogClose():void{
    //   this.infoDialog.close();
    // }

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
            .broadcast('KnalledgeMapMain', { 'user': this.rimaService.getWhoAmIid(), 'value': value });
    }

    // toggleTopPanel(): any {
    //     this.viewConfig.panels.topPanel.visible = !this.viewConfig.panels.topPanel.visible;
    // }

    amILoggedIn(): boolean {
        return this.rimaService && this.rimaService.getWhoAmI() !== null;
    }

    ngOnInit() {
      // update scrolling areas
      // https://github.com/asvd/dragscroll
      setTimeout(function() {
        dragscroll.reset();
      }, 0);

      if (!this.amILoggedIn()) {
          window.alert("Please, log in to be albe to follow the session");
      }
    }

    get following(): string {
        if (this.policyConfig.session && this.policyConfig.session.presenter) {
            if (this.policyConfig.session.presenter._id === this.rimaService.getWhoAmIid()) {
                return "you are presenting";
            } else {
                if (this.policyConfig.broadcasting.receiveNavigation) {
                    return "following " + this.policyConfig.session.presenter.displayName;
                } else {
                    return "you can follow " + this.policyConfig.session.presenter.displayName;
                }
            }
        } else {
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
    }
}
