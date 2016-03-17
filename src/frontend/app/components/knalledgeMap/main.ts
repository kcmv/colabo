import {Component, Inject} from 'angular2/core';
import {upgradeAdapter} from '../../js/upgrade_adapter';
// import {LoginStatusComponent} from '../login/login-status-component';
// import {MATERIAL_DIRECTIVES} from 'ng2-material/all';
import {SidenavService, MdContent, MdButton} from 'ng2-material/all';
import {KnalledgeMapTools} from './tools';
import {KnalledgeMapViewService} from './knalledgeMapViewService';
// import {GlobalEmitterServicesArray} from '../collaboPlugins/GlobalEmitterServicesArray';

@Component({
    selector: 'knalledge-map-main',
    providers: [SidenavService],
    directives: [
        // MATERIAL_DIRECTIVES,
        MdContent, MdButton,
    //   LoginStatusComponent,
     upgradeAdapter.upgradeNg1Component('knalledgeMap'),
    //  upgradeAdapter.upgradeNg1Component('knalledgeMapTools'),
     upgradeAdapter.upgradeNg1Component('ontovSearch'),
     upgradeAdapter.upgradeNg1Component('rimaRelevantList'),
     upgradeAdapter.upgradeNg1Component('knalledgeMapList'),
    //  upgradeAdapter.upgradeNg1Component('ibisTypesList'),
     KnalledgeMapTools
   ],
    templateUrl: 'components/knalledgeMap/partials/main.tpl.html',
    // templateUrl: 'partials/main.tpl.html',
    styles: [`
        .msg {
            font-size: 0.5em;
        }
        .container{
            margin: 5px;
            border: 1px solid gray;
        }
    `]
})
export class KnalledgeMapMain {
    constructor(
        sidenavService:SidenavService,
        @Inject('KnalledgeMapViewService') knalledgeMapViewService:KnalledgeMapViewService
        // globalEmitterServicesArray:GlobalEmitterServicesArray
        // @Inject('GlobalEmitterServicesArray') globalEmitterServicesArray:GlobalEmitterServicesArray
    ) {
        console.log('[KnalledgeMapMain]');
        this.viewConfig = knalledgeMapViewService.get().config;
        this.sidenavService = sidenavService;
        // globalEmitterServicesArray.register('KnalledgeMapMain');
        // globalEmitterServicesArray.get().subscribe('KnalledgeMapMain', (data) => alert("[KnalledgeMapMain]:"+data));
        // globalEmitterServicesArray.broadcast('KnalledgeMapMain', "Hello from KnalledgeMaKnalledgeMapMainpTools!");
    };

    userUrl: String = "www.CollaboScience.com";
    viewConfig:Object;
    private sidenavService:SidenavService;

    toggleList:Function = function(user:Object){
        var result = this.sidenavService.hide('left');
        console.log("[toggleList] result: ", result);
        // this.sidenavService('left').toggle();
        return;
    };

    showContactOptions:Function = function(event){
        return;
    };
}
