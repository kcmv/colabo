import {Component, Inject} from 'angular2/core';
import {NgClass} from 'angular2/common';
import {ROUTER_PROVIDERS, Location} from 'angular2/router';
import {upgradeAdapter} from '../../js/upgrade_adapter';
// import {LoginStatusComponent} from '../login/login-status-component';
// import {MATERIAL_DIRECTIVES} from 'ng2-material/all';

// import {SidenavService, MdContent, MdButton} from 'ng2-material/all';
// import {MATERIAL_DIRECTIVES, Media, SidenavService, MdToolbar} from "ng2-material/all";
import {MATERIAL_DIRECTIVES, Media, SidenavService} from "ng2-material/all";
// import {MdBackdrop} from "ng2-material/components/backdrop/backdrop";
import {KnalledgeMapTools} from './tools';
import {KnalledgeMapPolicyService} from './knalledgeMapPolicyService';
import {KnalledgeMapViewService} from './knalledgeMapViewService';
import {TopPanel} from '../topPanel/topPanel';
// import {RequestService} from '../request/request.service';
// import {GlobalEmitterServicesArray} from '../collaboPlugins/GlobalEmitterServicesArray';


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

@Component({
    selector: 'knalledge-map-main',
    moduleId: module.id,
    templateUrl: 'partials/main.tpl.html',
    providers: [
        // MdBackdrop,
        // MdToolbar,
        SidenavService,
        ROUTER_PROVIDERS
        // ,
        // RequestService
    ],
    directives: [
        MATERIAL_DIRECTIVES,
        NgClass,
        // MdContent, MdButton,
        //   LoginStatusComponent,
        upgradeAdapter.upgradeNg1Component('ontovSearch'),
        upgradeAdapter.upgradeNg1Component('knalledgeMap'),
        //  upgradeAdapter.upgradeNg1Component('knalledgeMapTools'),
        upgradeAdapter.upgradeNg1Component('knalledgeMapList'),
    //  upgradeAdapter.upgradeNg1Component('ibisTypesList'),
        KnalledgeMapTools,
        TopPanel
    ],
    // necessary for having relative paths for templateUrl
    // http://schwarty.com/2015/12/22/angular2-relative-paths-for-templateurl-and-styleurls/
    // t_emplateUrl: 'components/knalledgeMap/partials/main.tpl.html',
    styles: [`
        .md-sidenav-push-in .md-sidenav-push-in-target {
          transform: translate(0px);
          transition: all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
        }
        .md-sidenav-push-in.md-sidenav-left-open .md-sidenav-push-in-target {
          transform: translate(304px);
        }
        .md-sidenav-push-in.md-sidenav-right-open .md-sidenav-push-in-target {
          transform: translate(-304px);
        }
    `]
})
export class KnalledgeMapMain {
    constructor(
        private location: Location,
        private sidenavService: SidenavService,
        @Inject('KnalledgeMapViewService') knalledgeMapViewService: KnalledgeMapViewService,
        @Inject('KnalledgeMapPolicyService') private knalledgeMapPolicyService:KnalledgeMapPolicyService,
        @Inject('RimaService') _RimaService_,
        @Inject('KnalledgeMapVOsService') _KnalledgeMapVOsService_
    // @Inject('BroadcastManagerService') broadcastManagerService:BroadcastManagerService
    // globalEmitterServicesArray:GlobalEmitterServicesArray
    // @Inject('GlobalEmitterServicesArray') globalEmitterServicesArray:GlobalEmitterServicesArray
        ) {
        console.log('[KnalledgeMapMain]');
        this.viewConfig = knalledgeMapViewService.get().config;
        this.policyConfig = knalledgeMapPolicyService.get().config;
        this.rimaService = _RimaService_;
        this.knalledgeMapVOsService = _KnalledgeMapVOsService_;
        // this.broadcastManagerService = broadcastManagerService;
        // globalEmitterServicesArray.register('KnalledgeMapMain');
        // globalEmitterServicesArray.get().subscribe('KnalledgeMapMain', (data) => alert("[KnalledgeMapMain]:"+data));
        // globalEmitterServicesArray.broadcast('KnalledgeMapMain', "Hello from KnalledgeMaKnalledgeMapMainpTools!");
    };

    userUrl: String = "www.CollaboScience.com";
    policyConfig: any;
    viewConfig: any;
    topPanelVisible: boolean = true;

    nodeImageDialog = {
        visible: false as boolean,
        /* knalledge.VKNode */
        node: {
            kNode: {
                name: "Здраво!"
            }
        }
    };

    private rimaService;
    private knalledgeMapVOsService;

    nodeImageDialogClose() {
        this.nodeImageDialog.visible = false;
    }

    nodeImageDialogOpen() {
        // this.nodeImageDialog.node = vkNode;
        this.nodeImageDialog.visible = true;
    }

    getMapName(): any{
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
        this.topPanelVisible = !this.topPanelVisible;
    }
    getLoggedInUserName(): any {
        var whoAmI = this.rimaService.getWhoAmI();
        var name = this.rimaService.getNameFromUser(whoAmI);
        return name;
    }
    getActiveUserName(): any {
        var whoAmI = this.rimaService.getActiveUser();
        var name = this.rimaService.getNameFromUser(whoAmI);
        return name;
    }
    hasMedia(breakSize: string): boolean {
        return Media.hasMedia(breakSize);
    }
    open(name: string) {
        this.sidenavService.show(name);
    }
    close(name: string) {
        this.sidenavService.hide(name);
    }

    toggleList: Function = function(user: Object) {
        var result = this.sidenavService.hide('left');
        console.log("[toggleList] result: ", result);
        // this.sidenavService('left').toggle();
        return;
    };

    showContactOptions: Function = function(event) {
        return;
    };

    public go(path:string){
        this.location.go('#/'+path);
    };
}
