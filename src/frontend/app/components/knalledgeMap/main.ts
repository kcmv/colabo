import {Component, Inject} from '@angular/core';
import {upgradeAdapter} from '../../js/upgrade_adapter';
import {MD_SIDENAV_DIRECTIVES} from '@angular2-material/sidenav';
// import {LoginStatusComponent} from '../login/login-status-component';
// import {Media, MdContent, MdButton} from 'ng2-material';
import {MATERIAL_DIRECTIVES, MATERIAL_PROVIDERS, Media} from "ng2-material";
import {MdToolbar} from '@angular2-material/toolbar';
import {OVERLAY_PROVIDERS} from '@angular2-material/core/overlay/overlay';
// http://stackoverflow.com/questions/35533783/angular2-unable-to-navigate-to-url-using-location-gourl

import { Router, ROUTER_DIRECTIVES} from '@angular/router';

import {KnalledgeMapTools} from './tools';
import {KnalledgeMapPolicyService} from './knalledgeMapPolicyService';
import {KnalledgeMapViewService} from './knalledgeMapViewService';
// import {RequestService} from '../request/request.service';
import {GlobalEmitterServicesArray} from '../collaboPlugins/GlobalEmitterServicesArray';

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
    KnalledgeMapTools
];

declare var Config: any;

if (Config.Plugins.topPanel.active && PluginsPreloader.components.TopPanel) {
    console.warn("[KnalledgeMapMain] Loading TopPanel");
    componentDirectives.push(PluginsPreloader.components.TopPanel);
} else {
    console.warn("[KnalledgeMapMain] Not loading TopPanel");
}

if (Config.Plugins.ontov.active) {
    componentDirectives.push(upgradeAdapter.upgradeNg1Component('ontovSearch'));
}

@Component({
    selector: 'knalledge-map-main',
    moduleId: module.id,
    templateUrl: 'partials/main.tpl.html',
    providers: [
        MATERIAL_PROVIDERS,
        OVERLAY_PROVIDERS
        // provideRouter
        // RequestService
        // ROUTER_PROVIDERS
    ],
    directives: componentDirectives,
    // necessary for having relative paths for templateUrl
    // http://schwarty.com/2015/12/22/angular2-relative-paths-for-templateurl-and-styleurls/
    // t_emplateUrl: 'components/knalledgeMap/partials/main.tpl.html',
    styles: [`

    `]
})

export class KnalledgeMapMain {
    userUrl: String = "www.CollaboScience.com";
    policyConfig: any;
    viewConfig: any;
    topPanelVisible: boolean = true;
    status: String;
    private rimaService;
    private knalledgeMapVOsService;

    constructor(
        // public router: Router,
        @Inject('KnalledgeMapViewService') knalledgeMapViewService: KnalledgeMapViewService,
        @Inject('KnalledgeMapPolicyService') private knalledgeMapPolicyService: KnalledgeMapPolicyService,
        @Inject('Plugins') private Plugins,
        @Inject('RimaService') private RimaService,
        @Inject('KnalledgeMapVOsService') _KnalledgeMapVOsService_,
        @Inject('GlobalEmitterServicesArray') private globalEmitterServicesArray: GlobalEmitterServicesArray
    ) {
        console.log('[KnalledgeMapMain] loaded');
        this.viewConfig = knalledgeMapViewService.get().config;
        this.policyConfig = knalledgeMapPolicyService.get().config;
        try {
            this.rimaService = RimaService;
            // * @param  {rima.rimaServices.RimaService}  RimaService
            //   this.rimaService = this.Plugins.rima.config.rimaService.available ?
            //   this.$injector.get('RimaService') : null;
        } catch (err) {
            console.warn(err);
        }

        this.knalledgeMapVOsService = _KnalledgeMapVOsService_;
        // this.broadcastManagerService = broadcastManagerService;
        // globalEmitterServicesArray.register('KnalledgeMapMain');
        // globalEmitterServicesArray.get().subscribe('KnalledgeMapMain', (data) => alert("[KnalledgeMapMain]:"+data));
        // globalEmitterServicesArray.broadcast('KnalledgeMapMain', "Hello from KnalledgeMaKnalledgeMapMainpTools!");

        var nodeMediaClickedEventName = "nodeMediaClickedEvent";
        this.globalEmitterServicesArray.register(nodeMediaClickedEventName);

        this.globalEmitterServicesArray.get(nodeMediaClickedEventName).subscribe('knalledgeMap.Main', function(vkNode) {
            console.log("media clicked: ", vkNode.kNode.name);
        });
    };

    customClose(interesting: boolean) {
        if (interesting) {
            this.status = 'That article was interesting.';
        } else {
            this.status = 'Look for something else.';
        }
    }

    getMapName(): any {
        return this.knalledgeMapVOsService.map ? this.knalledgeMapVOsService.map.name : 'loading ...';
    }

    stopFollowing(): any {
        this.policyConfig.broadcasting.receiveNavigation = false;
    }
    continueFollowing(): any {
        this.policyConfig.broadcasting.receiveNavigation = true;
    }
    disableBroadcasting(): any {
        this.policyConfig.broadcasting.enabled = false;
    }
    enableBroadcasting(): any {
        this.policyConfig.broadcasting.enabled = true;
    }
    toggleTopPanel(): any {
        this.viewConfig.panels.topPanel.visible = !this.viewConfig.panels.topPanel.visible;
    }
    getLoggedInUserName(): any {
        var whoAmI = this.rimaService ?
            this.rimaService.getWhoAmI() :
            this.Plugins.rima.config.rimaService.ANONYMOUS_USER_ID;
        var name = this.rimaService ?
            this.rimaService.getNameFromUser(whoAmI) :
            this.Plugins.rima.config.rimaService.ANONYMOUS_USER_NAME;
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
